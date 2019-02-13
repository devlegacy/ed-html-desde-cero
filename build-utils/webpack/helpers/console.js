const util = require('util');

/**
 * Info console.log with color
 */
const RESET = '\x1b[0m';
const BLUE = '\x1b[44m';
global.info = (title = 'Title', text = '') => console.log(`${BLUE}%s${RESET}`, title, text);

/**
 * Format console log, util for arrays and objects too large
 * @param {*} data
 */
global.flog = (data) => console.log(util.inspect(data, { showHidden: false, depth: null }));

const FG_BLACK = '\x1b[30m';
const BRIGHT = '\x1b[1m';
const BG_RESET = '\x1b[0m';
const BG_WHITE = `\x1b[47m${FG_BLACK}${BRIGHT}`;
const BG_GREEN = `\x1b[42m${FG_BLACK}${BRIGHT}`;
const BG_YELLOW = `\x1b[43m${FG_BLACK}${BRIGHT}`;
const BG_RED = `\x1b[41m${BRIGHT}`;
const BG_BLUE = '\x1b[44m';
const levelToColor = {
  debug: BG_WHITE,
  log: BG_GREEN,
  warn: BG_YELLOW,
  error: BG_RED,
  groupCollapsed: BG_BLUE,
};

global.log = (...args) => {
  let title = '[Dvx]:';
  if (args.length > 1) {
    title = args.shift();
  }
  console.log(`${levelToColor['log']}%s${BG_RESET}`, title, ...args);
};

global.warn = (...args) => {
  let title = '[Dvx]:';
  if (args.length > 1) {
    title = args.shift();
  }
  console.log(`${levelToColor['warn']}%s${BG_RESET}`, title, ...args);
};

global.error = (...args) => {
  let title = '[Dvx]:';
  if (args.length > 1) {
    title = args.shift();
  }
  console.log(`${levelToColor['error']}%s${BG_RESET}`, title, ...args);
};

