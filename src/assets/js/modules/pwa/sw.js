import { n } from '../../helpers/web';
import { log, error } from '../../helpers/console';

export const registerSW = () => {
  if ('serviceWorker' in n) {
    n
      .serviceWorker
      .register(`${PUBLIC_PATH.pathname}dvx-sw.js`)
      .then(() => {
        log('[sw -client]', 'registered successfully');
      })
      .catch(err => error('[sw client]', 'Registered falied', err));
  }
};

export default pwa = {
  init: () => {
    registerSW();
  }
};
