import { NetworkFirst } from 'workbox-strategies';
import { registerRoute } from 'workbox-routing';

registerRoute(
    /^https:\/\/www\.infoclimat\.fr\/.*/i,
    new NetworkFirst({
      cacheName: 'weather-cache',
      plugins: [
        {
          cacheableResponse: {
            statuses: [0, 200]
          }
        },
        {
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
          }
        }
      ]
    })
  );