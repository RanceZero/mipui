class State {
  constructor() {
    this.pstate_ = {
      ver: '1.0',
      props: {},
      // cell key -> (layer id -> content)
      content: {},
      lastOpNum: 0,
    };

    this.metadata = {};

    this.theMap = new CellMap();

    this.mid_ = null;

    this.secret_ = null;

    this.gesture_ = null;

    this.opCenter = new OperationCenter();

    this.navigation = {
      scale: 1.0,
    };

    this.defaultFloorContent_ = {
      [ck.kind]: ct.floors.floor.id,
      [ck.variation]: ct.floors.floor.generic.id,
    };

    this.defaultProperties_ = {
      [pk.title]: 'Unnamed',
      [pk.longDescription]: '',
      [pk.firstRow]: 0,
      [pk.lastRow]: 20,
      [pk.firstColumn]: 0,
      [pk.lastColumn]: 20,
      [pk.theme]: 0,
    };

    this.autoSaveTimerId_ = null;

    this.pendingOperations_ = [];

    this.currentlySendingOperations_ = false;

    this.lastAppliedOperation_ = null;

    this.user = null;

    this.menu = null;
    // Icon hash -> use count in the map
    this.usedIcons_ = new Map();

    this.clipboard = null;

    this.currentTheme = themes[0];
    this.appliedThemeElements_ = new Map();

    this.lastUsedSvg = null;

    this.hasUnsavedChanges = false;

    this.tileGridImager = new GridImager({
      selectorsOfElementsToStrip: ['.grid-layer', '*[visibility="hidden"]'],
      scale: 6,
      margins: 1,
      disableSmoothing: true,
      xmlPreProcessor: xml =>
        this.stripText_(
            '<div class="layer-container"',
            '<div class="layer ',
            this.stripText_('transform: scale(', '">', xml)),
    });

    this.cursorStatusBar = null;
    this.progressStatusBar = null;
    this.infoStatusBar = null;

    this.tilingEnabled = false;
    this.tilingCachingEnabled = false;
    this.cachedTilesGreyedOut = false;

    this.currentSightRange = 30;

    this.mode = '';

    this.dialog = null;
  }

  isReadOnly() {
    return this.mid_ && !this.secret_;
    // TODO or the user knows about it
  }

  set gesture(newGesture) {
    if (this.gesture_) this.gesture_.onUnselect();
    this.gesture_ = newGesture;
  }

  get gesture() {
    return this.gesture_;
  }

  setLastOpNum(num) {
    this.pstate_.lastOpNum = num;
  }

  getLastOpNum() {
    return this.pstate_.lastOpNum;
  }

  getLayerContent(cellKey, layer) {
    const content = this.pstate_.content || null;
    const cellContent = content ? content[cellKey] : null;
    const layerContent = cellContent ? cellContent[layer.id] : null;
    return layerContent || null;
  }

  setLayerContent(cellKey, layer, content) {
    if (!this.pstate_.content) {
      this.pstate_.content = {};
    }
    let cellContent = this.pstate_.content[cellKey];
    if (layer == ct.images) {
      if (cellContent && cellContent[ct.images.id] &&
          cellContent[ct.images.id][ck.imageHash]) {
        const hash = 'h' + cellContent[ct.images.id][ck.imageHash];
        const currentCounter = this.usedIcons_.get(hash);
        if (currentCounter == 1) {
          this.usedIcons_.delete(hash);
        } else {
          this.usedIcons_.set(hash, currentCounter - 1);
        }
      }
      if (content && content[ck.imageHash]) {
        const hash = 'h' + content[ck.imageHash];
        this.usedIcons_.set(hash,
            this.usedIcons_.has(hash) ? this.usedIcons_.get(hash) + 1 : 1);
      }
    }
    if (!cellContent) {
      if (!content) return;
      cellContent = {};
      this.pstate_.content[cellKey] = cellContent;
    } else if (!content) {
      delete cellContent[layer.id];
      return;
    }
    if (layer == ct.floors &&
        Object.keys(content).length == 2 &&
        content[ck.kind] == this.defaultFloorContent_[ck.kind] &&
        content[ck.variation] == this.defaultFloorContent_[ck.variation]) {
      // If it's the floor layer with a content equivalent to the default
      // floor, it can be deleted.
      delete cellContent[layer.id];
      return;
    }
    cellContent[layer.id] = content;
  }

  stripText_(start, end, text) {
    const startIndex = text.indexOf(start);
    if (startIndex < 0) return text;
    const endIndex = text.indexOf(end, startIndex + start.length);
    if (endIndex < 0) return text;
    return text.substring(0, startIndex) + text.substr(endIndex);
  }

  getProperty(property) {
    if (this.pstate_.props && this.pstate_.props[property]) {
      return this.pstate_.props[property];
    }
    return this.defaultProperties_[property];
  }

  setProperty(property, value, recordChange) {
    if (value == this.defaultProperties_[property]) {
      value = null;
    }
    const oldValue = this.getProperty(property);
    const newValue = value != this.defaultProperties_[property] ? value : null;
    if (oldValue != newValue) {
      if (!this.pstate_.props) this.pstate_.props = {};
      this.pstate_.props[property] = value != null ? value : undefined;
      if (recordChange) {
        state.opCenter.recordPropertyChange(property, oldValue, newValue);
      }
    }
  }

  isStylesheetLoaded_(css) {
    try {
      return css.sheet && css.sheet.cssRules.length >= 0;
    } catch (e) {
      // In Firefox, accessing cssRules before it's fully loaded will throw.
      return false;
    }
  }

  reloadTheme() {
    return new Promise((resolve, reject) => {
      const newPropertyIndex = this.getProperty(pk.theme);
      if (this.currentTheme.propertyIndex == newPropertyIndex) resolve();
      const appliedCoverEffect = state.shouldApplyCoverEffect();
      this.currentTheme =
          themes.find(theme => theme.propertyIndex == newPropertyIndex);

      this.appliedThemeElements_.forEach((element, path) => {
        element.parentNode.removeChild(element);
        this.tileGridImager.removeCssFile(path);
      });
      this.appliedThemeElements_ = new Map();
      const head = document.getElementsByTagName('head')[0];
      const gridImagerPromises = [];
      this.currentTheme.files.forEach((path, index) => {
        const css = document.createElement('link');
        css.type = 'text/css';
        css.rel = 'stylesheet';
        const gridImagerPromise = new Promise((innerResolve, innerReject) => {
          const addSheet = sheet => {
            this.tileGridImager.addCssStyleSheet(index + 1, sheet).then(
                () => { innerResolve(); }).catch(err => { debug(err); });
          };
          if (this.isStylesheetLoaded_(css)) {
            addSheet(css.sheet);
          } else {
            css.onload = () => addSheet(css.sheet);
          }
        });
        gridImagerPromises.push(gridImagerPromise);
        this.appliedThemeElements_.set(path, css);
        css.href = path;
        head.appendChild(css);
      });
      const menuIconsFromMap =
          Array.from(document.getElementsByClassName('menu-icon-from-map'));
      menuIconsFromMap.forEach(menuIconFromMap => {
        menuIconFromMap.style.backgroundImage =
            `url("${this.currentTheme.menuIconFile}")`;
      });

      Promise.all(gridImagerPromises).then(() => {
        this.tileGridImager.recalculateStyleString();
        this.theMap.invalidateTiles();
        if (appliedCoverEffect !== this.shouldApplyCoverEffect()) {
          // When the cover effect toggles, cells need to redraw themselves.
          // Do so asynchronously, probably to ensure doms are up-to-date with
          // the new css files.
          setTimeout(() => {
            this.theMap.updateAllCells();
            this.theMap.invalidateTiles();
          }, 0);
        }
        resolve();
      });
    });
  }

  setMid(mid) {
    this.mid_ = mid;
    let newUrl = 'index.html?mid=' + encodeURIComponent(this.mid_);
    if (!this.tilingCachingEnabled) newUrl += '&tc=no';
    window.history.replaceState(null, '', newUrl);
  }

  setSecret(secret, writeSecret, callback) {
    this.secret_ = secret;
    if (!this.user) {
      setStatus(Status.AUTH_ERROR);
      callback();
      return;
    }
    let newUrl = `index.html?mid=${encodeURIComponent(this.mid_)}` +
        `&secret=${encodeURIComponent(secret)}`;
    if (!this.tilingCachingEnabled) newUrl += '&tc=no';
    window.history.replaceState(null, '', newUrl);
    document.getElementById('theMap').classList.add('editor-view');
    if (writeSecret) {
      if (!secret) {
        debug('secret is missing');
        callback();
        return;
      }
      debug('writing secret ' + secret);
      firebase.database().ref(`/users/${this.user.uid}/secrets/${this.mid_}`)
          .set(secret).then(() => { callback(); })
          .catch(error => { setStatus(Status.AUTH_ERROR); });
    } else {
      callback();
    }
  }

  getMid() {
    return this.mid_;
  }

  getSecret() {
    return this.secret_;
  }

  getTitle() {
    const title = this.getProperty(pk.title);
    return title == this.defaultProperties_[pk.title] ? '' : title;
  }

  getTitleOrMid() {
    return this.getTitle() || this.mid_ || 'unnamed';
  }

  nameChanged() {
    document.title = 'Mipui - ' + this.getProperty(pk.title);
  }

  sanitizeTitle_(title) {
    if (!title) return title;
    return title;
  }

  load(pstate) {
    this.pstate_ = pstate;
    createTheMapAndUpdateElements();
    updateMapTransform(true);
    this.usedIcons_.clear();
    for (const cell of this.theMap.cells.values()) {
      if (cell.hasLayerContent(ct.images) &&
          cell.getVal(ct.images, ck.imageHash)) {
        const hash = 'h' + cell.getVal(ct.images, ck.imageHash);
        this.usedIcons_.set(hash,
            this.usedIcons_.has(hash) ? this.usedIcons_.get(hash) + 1 : 1);
      }
    }
    if (this.menu) {
      this.menu.descChanged();
    }
    this.reloadTheme();
  }

  setupNewMid(callback) {
    this.setMid('m' + this.generateRandomString_());
    this.setSecret('s' + this.generateRandomString_(), true, callback);
  }

  // Create a random 10-character string with characters belonging to [a-z0-9].
  generateRandomString_() {
    // From http://stackoverflow.com/a/19964557
    return (Math.random().toString(36) + '00000000000000000').slice(2, 12);
  }

  shouldApplyCoverEffect() {
    return !!this.currentTheme.hasCoverEffect;
  }

  isIconUsed(iconHash) {
    return this.usedIcons_.get(iconHash);
  }
}
