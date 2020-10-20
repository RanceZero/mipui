// Content types.
// * "ct" contains "layer"s.
// * Each "layer" contains "kind"s.
// * Each "kind" contains "variation"s.
const ct = {
  floors: {
    classNames: ['floor-cell', 'floor-cell-_ROLE_'],
    floor: {
      generic: {},
    },
    pit: {
      square: {
        classNames: [
          'pit-cell',
          'pit-cell-_ROLE_',
          'pit-cell-_ADDING-REMOVING_',
          'pit-cell-_ROLE_-_ADDING-REMOVING_',
        ],
      },
    },
  },
  walls: {
    classNames: [
      'wall-cell',
      'wall-cell-_ADDING_',
      'wall-cell-_REMOVING_',
      'wall-cell-_EDITING_',
    ],
    smooth: {
      square: {classNames: ['square-wall-cell']},
      angled: {classNames: ['angled-wall-cell']},
      oval: {classNames: ['oval-wall-cell']},
    },
  },
  images: {
    image: {
      classNames: [
        'image-cell',
        'image-cell-_ADDING-REMOVING_',
        'image-cell-_EDITING_',
      ],
      black: {classNames: ['image-black']},
      green: {classNames: ['image-green']},
      brown: {classNames: ['image-brown']},
      blue: {classNames: ['image-blue']},
      red: {classNames: ['image-red']},
    },
  },
  separators: {
    classNames: ['separator-cell'],
    door: {
      classNames: [
        'door-cell',
        'door-cell-_ROLE_',
        'door-cell-_ADDING-REMOVING_',
      ],
      single: {},
      double: {classNames: ['double-door-cell-_ROLE_']},
      secret: {classNames: ['secret-door-cell', 'secret-door-cell-_ROLE_']},
      hiddenSecret: {classNames: [
        'hidden-secret-door-cell',
        'hidden-secret-door-cell-_ROLE_',
      ]},
      marked: {classNames: ['marked-door-cell']},
    },
    window: {
      classNames: [
        'window-cell',
        'window-cell-_ROLE_',
        'window-cell-_ADDING-REMOVING_',
      ],
      generic: {},
    },
    bars: {
      classNames: [
        'bars-cell',
        'bars-cell-_ROLE_',
        'bars-cell-_ADDING-REMOVING_',
      ],
      generic: {},
    },
    fence: {
      classNames: [
        'fence-cell',
        'fence-cell-_ROLE_',
        'fence-cell-_ADDING-REMOVING_',
      ],
      generic: {},
    },
    curtain: {
      classNames: [
        'curtain-cell',
        'curtain-cell-_ROLE_',
        'curtain-cell-_ADDING-REMOVING_',
      ],
      generic: {},
    },
    archway: {
      classNames: [
        'archway-cell',
        'archway-cell-_ROLE_',
        'archway-cell-_ADDING-REMOVING_',
      ],
      generic: {},
    },
  },
  text: {
    classNames: [
      'text-cell',
      'text-cell-_ADDING-REMOVING_',
      'text-cell-_EDITING_',
    ],
    text: {
      standard: {},
    },
    gmNote: {
      classNames: ['gm-note'],
      standard: {},
    },
  },
  shapes: {
    classNames: [
      'shape-cell',
      'shape-cell-_ADDING-REMOVING_',
      'shape-cell-_ROLE_',
      'shape-cell-_ROLE_-_ADDING-REMOVING_',
    ],
    square: {
      green: {classNames: ['shape-green']},
      brown: {classNames: ['shape-brown']},
      blue: {classNames: ['shape-blue']},
      red: {classNames: ['shape-red']},
      white: {classNames: ['shape-white']},
      orange: {classNames: ['shape-orange']},
      black: {classNames: ['shape-black']},
    },
    circle: {
      green: {classNames: ['shape-green']},
      brown: {classNames: ['shape-brown']},
      blue: {classNames: ['shape-blue']},
      red: {classNames: ['shape-red']},
      white: {classNames: ['shape-white']},
      orange: {classNames: ['shape-orange']},
      black: {classNames: ['shape-black']},
    },
    diamond: {
      green: {classNames: ['shape-green']},
      brown: {classNames: ['shape-brown']},
      blue: {classNames: ['shape-blue']},
      red: {classNames: ['shape-red']},
      white: {classNames: ['shape-white']},
      orange: {classNames: ['shape-orange']},
      black: {classNames: ['shape-black']},
    },
  },
  elevation: {
    horizontal: {
      classNames: [
        'stairs-cell',
        'stairs-cell-_ADDING-REMOVING_',
        'stairs-cell-_EDITING_',
        'stairs-cell-horizontal',
      ],
      generic: {},
      ascendingLeft: {classNames: ['stairs-cell-ascending-left']},
      ascendingRight: {classNames: ['stairs-cell-ascending-right']},
    },
    vertical: {
      classNames: [
        'stairs-cell',
        'stairs-cell-_ADDING-REMOVING_',
        'stairs-cell-_EDITING_',
        'stairs-cell-vertical',
      ],
      generic: {},
      ascendingTop: {classNames: ['stairs-cell-ascending-top']},
      ascendingBottom: {classNames: ['stairs-cell-ascending-bottom']},
    },
    spiral: {
      classNames: [
        'stairs-cell',
        'stairs-cell-_ADDING-REMOVING_',
        'stairs-cell-_EDITING_',
      ],
      generic: {classNames: ['stairs-cell-spiral']},
      rotated90: {classNames: ['stairs-cell-spiral', 'rotated-90']},
      rotated180: {classNames: ['stairs-cell-spiral', 'rotated-180']},
      rotated270: {classNames: ['stairs-cell-spiral', 'rotated-270']},
    },
    passage: {
      classNames: [
        'passage-cell',
        'passage-cell-_ADDING-REMOVING_',
        'passage-cell-_ROLE_',
      ],
      dashed: {classNames: ['passage-cell-dashed-_OVER-WALL_']},
      hidden: {classNames: ['passage-cell-hidden']},
    },
  },
  gmoverlay: {
    shape: {
      square: {
        classNames: [
          'gmoverlay-square',
          'gmoverlay-square-_ADDING-REMOVING_',
        ],
      },
    },
  },
  mask: {
    hidden: {
      black: {classNames: ['hidden-cell', 'hidden-cell-_ADDING-REMOVING_']},
    },
  },
};

// Content keys.
const ck = {
  kind: 'k',
  variation: 'v',
  startCell: 's',
  endCell: 'e',
  text: 't',
  image: 'i',
  imageHash: 'h',
  connections: 'c',
  clipInclude: 'p',
  clipExclude: 'x',
  transform: 'r',
};

// Property keys.
const pk = {
  title: 'n',
  longDescription: 'd',
  firstRow: 't',
  lastRow: 'b',
  firstColumn: 'l',
  lastColumn: 'r',
  theme: 'h',
};

function sameContent(c1, c2) {
  if (!c1 && !c2) return true;
  if (!!c1 != !!c2) return false;
  return Object.keys(ck).every(k => {
    const key = ck[k];
    const has1 = c1.hasOwnProperty(key);
    const has2 = c2.hasOwnProperty(key);
    if (has1 != has2) return false;
    return c1[key] === c2[key];
  });
}

function getContentType(layer, content) {
  return ct
      .children[layer.id]
      .children[content[ck.kind]]
      .children[content[ck.variation]];
}

function initializeContentTypes(obj) {
  const children = [];
  Object.keys(obj).forEach(prop => {
    const field = obj[prop];
    if (['classNames', 'name', 'id', 'imagePath'].includes(prop)) return;
    field.name = prop;
    initializeContentTypes(field);
    field.id = children.length;
    children.push(field);
  });
  obj.children = children;
}

initializeContentTypes(ct);
