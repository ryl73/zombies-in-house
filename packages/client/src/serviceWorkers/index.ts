export function startServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js')
        .then(registration => {
          registration.onupdatefound = () => {
            const installingWorker = registration.installing
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    console.log('New content is available; please refresh.')
                  } else {
                    console.log('Content cached for offline use.')
                  }
                }
              }
            }
          }
        })
        .catch((error: unknown) => {
          console.error('ServiceWorker registration failed: ', error)
        })
    })
  }
}
