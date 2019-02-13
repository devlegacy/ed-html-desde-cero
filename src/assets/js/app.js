// import '@babel/polyfill';
import { w, n, d } from './helpers/web';
import { log, error, warn, consoleUserWarning } from './helpers/console';

import hmr from './helpers/hrm';

const app = () => {
  log('[app]', 'Start');
  if (d.querySelector('h1')) {
    d.querySelector('h1').addEventListener('click', () => {
      d.body.style.backgroundColor = '#00ff00';
    });
  }
};

if (ENV === 'production') consoleUserWarning();
app();

hmr(module);
