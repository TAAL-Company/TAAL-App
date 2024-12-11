import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import App from "./App";
import * as serviceWorker from './serviceWorkerRegistration'
import i18next from './i18n'

import posthog from "posthog-js";
import { PostHogProvider } from 'posthog-js/react'

posthog.init('phc_GI1wu4eVOdPZaWmNCsmrvGzisDDLPX1StZIR6mcJGJ6', { api_host: 'https://us.i.posthog.com', person_profiles: 'always' })

ReactDOM.render(
  <Suspense fallback={(<div>Loading</div>)}>
    <React.StrictMode>
      <PostHogProvider >
        <App />
      </PostHogProvider>
    </React.StrictMode>
  </Suspense>
  ,
  document.getElementById('root')
);

serviceWorker.register();

// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('/service-worker.js').then(registration => {
//             console.log('SW registered: ', registration);
//         }).catch(registrationError => {
//             console.log('SW registration failed: ', registrationError);
//         });
//     });
// }

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}
