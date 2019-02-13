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
  if (d.getElementById('name')) {
    d.getElementById('name').addEventListener('keyup', e => {
      log(e.target.value);
    });
  }

  if (d.getElementById('video')) {
    const video = d.getElementById('video');
    const play = d.getElementById('play');
    const pause = d.getElementById('pause');

    play.addEventListener('click', () => {
      video.play();
    });

    pause.addEventListener('click', () => {
      video.pause();
    });

  }

  if (d.getElementById('modal')) {
    const modal = d.getElementById('modal');
    const open = d.getElementById('open');
    const close = d.getElementById('close');

    open.addEventListener('click', () => {
      modal.setAttribute('open', true);
    });

    close.addEventListener('click', () => {
      modal.removeAttribute('open');
    });

  }
};

if (ENV === 'production') consoleUserWarning();
app();

hmr(module);
