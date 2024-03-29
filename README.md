﻿# PWA Event explication

Le fichier JavaScript `worker.js` est responsable de la gestion du service worker, une fonctionnalité essentielle pour le fonctionnement hors ligne d'une Progressive Web App (PWA). Expliquons le fonctionnement des événements `install`, `fetch`, et `beforeinstallprompt` dans ce contexte :

## Attendu

https://kferrandonfulbert.github.io/pwa-04-manifest/

## `install` Event

L'événement `install` est déclenché lorsque le service worker est installé pour la première fois. Cet événement est utilisé pour mettre en cache les ressources statiques nécessaires à l'application dans le service worker.

``` javascript
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll(resourcesToCache);
      })
  );
}); 
```

- `event.waitUntil`: Cette méthode garantit que l'installation du service worker ne sera considérée comme terminée que lorsque toutes les opérations à l'intérieur de la fonction promise seront terminées.

- `caches.open(cacheName)`: Cette méthode ouvre le cache spécifié (dans ce cas, `beer-Management`) ou le crée s'il n'existe pas encore.

- `cache.addAll(resourcesToCache)`: Cette méthode ajoute toutes les ressources spécifiées dans `resourcesToCache` au cache.

## `fetch` Event

L'événement `fetch` est déclenché chaque fois que l'application fait une requête réseau. Dans ce contexte, le service worker intercepte les requêtes réseau et vérifie d'abord si la ressource demandée est présente dans le cache. Si oui, elle est renvoyée depuis le cache. Sinon, une requête réseau est effectuée et la réponse est mise en cache pour une utilisation future.

``` javascript
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }

        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();

            caches.open(cacheName)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
}); 
```

- `caches.match(event.request)`: Cette méthode recherche la ressource demandée dans le cache. Si elle est présente, elle est renvoyée immédiatement.

- `fetch(event.request)`: Si la ressource n'est pas trouvée dans le cache, une requête réseau est effectuée pour obtenir la ressource depuis le serveur.

- `caches.open(cacheName)`: Comme dans l'événement `install`, cette méthode ouvre le cache spécifié.

- `cache.put(event.request, responseToCache)`: Cette méthode met en cache la réponse de la requête réseau pour une utilisation future.

## `beforeinstallprompt` Event

L'événement `beforeinstallprompt` est déclenché avant que la fenêtre d'installation de l'application ne s'affiche. Cela permet de personnaliser le comportement de l'invitation à l'installation.

```  javascript
let installPrompt = null;
const installButton = document.querySelector("#install");

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  installButton.removeAttribute("hidden");
});
```

- `event.preventDefault()`: Empêche l'affichage automatique de la fenêtre d'installation pour permettre une personnalisation.

- `installPrompt = event`: Stocke l'événement d'installation pour une utilisation ultérieure.

- `installButton.removeAttribute("hidden")`: Affiche le bouton d'installation lorsque l'événement `beforeinstallprompt` est déclenché.

Ces événements et leurs gestionnaires sont cruciaux pour la création d'une PWA fonctionnelle qui offre une expérience utilisateur fluide, même en l'absence d'une connexion Internet stable.
