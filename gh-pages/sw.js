const DB_OPENED = 'opened';
const DB_CLOSED = 'closed';

let dbManager = (function (undef) {
  let dbState = DB_CLOSED;
  let internalDB = undef;

  return {
    open() {
      if (dbState === DB_OPENED) {
        return Promise.resolve(internalDB);
      }
      return new Promise((resolve, reject) => {
        const request = indexedDB.open('templateDB', 1);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          // Create an object store for templates
          if (!db.objectStoreNames.contains('templates')) {
            let templateStore = db.createObjectStore('templates', {
              keyPath: 'id',
              autoIncrement: true,
            });

            templateStore.createIndex('name', 'name', { unique: true });
          }
        };

        request.onsuccess = (event) => {
          internalDB = event.target.result;
          dbState = DB_OPENED;
          internalDB.addEventListener('close', () => {
            dbState = DB_CLOSED;
            internalDB = undef;
          });
          resolve(internalDB);
        };

        request.onerror = (event) => {
          dbState = event.target.error;
          reject(event.target.error);
        };
      });
    },
    state() {
      return dbState;
    },
    close() {
      dbState = DB_CLOSED;
      internalDB = internalDB && internalDB.close();
    },
  };
})();

function saveTemplate({ id, name, template, data } = {}) {
  return dbManager.open().then(
    (db) =>
      new Promise((resolve) => {
        let transaction = db.transaction(['templates'], 'readwrite');
        let store = transaction.objectStore('templates');

        let request;
        if (id) {
          request = store.put({ id: +id, name, template, data });
        } else {
          request = store.add({ name, template, data });
        }

        request.onsuccess = (event) => {
          resolve(event.target.result);
        };
        request.onerror = (event) => {
          throw new Error(`Error saving template: ${event.target.error}`);
        };
      }),
  );
}

function getTemplates() {
  return dbManager.open().then(
    (db) =>
      new Promise((resolve) => {
        if (!db) {
          throw new Error('Database is not initialized');
        }

        let transaction = db.transaction(['templates'], 'readonly');
        let store = transaction.objectStore('templates');

        let request = store.getAll();
        request.onsuccess = (event) => {
          let templates = event.target.result;
          resolve(templates);
        };
        request.onerror = (event) => {
          throw new Error(`Error fetching templates: ${event.target.error}`);
        };
      }),
  );
}

function getTemplateById(id) {
  return dbManager.open().then(
    (db) =>
      new Promise((resolve) => {
        let transaction = db.transaction(['templates'], 'readonly');
        let store = transaction.objectStore('templates');

        let request = store.get(+id);

        request.onsuccess = (event) => {
          let template = event.target.result;
          resolve(template);
        };
        request.onerror = (event) => {
          throw new Error(`Error fetching templates: ${event.target.error}`);
        };
      }),
  );
}

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Activate the service worker immediately
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async function () {
      self.clients.claim(); // Take control of all clients immediately
      await dbManager.open().catch((error) => {
        console.error('Error opening database:', error);
      });
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  // Intercept fetch requests and log them
  let url = new URL(event.request.url);
  if (url.pathname === '/templates' && event.request.method === 'GET') {
    // Handle template requests
    event.respondWith(
      getTemplates()
        .then((templates) => {
          return new Response(JSON.stringify(templates), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        })
        .catch((error) => {
          return new Response(
            { message: 'Error fetching templates', error },
            { status: 500 },
          );
        }),
    );
    return;
  }

  if (url.pathname === '/template') {
    let args = url.searchParams;
    let id = +args.get('id');
    let name = args.get('name');
    if (event.request.method === 'POST') {
      event.respondWith(
        (async function () {
          let requestData = await event.request.json();
          let template = requestData.template;
          let data = requestData.data || '';
          if (!template) {
            return new Response('Invalid request data', { status: 400 });
          }
          return saveTemplate({ id, name, template, data })
            .then((res) => {
              return new Response(JSON.stringify({ id: res }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              });
            })
            .catch((error) => {
              return new Response(
                { message: 'Error saving template', error },
                { status: 500 },
              );
            });
        })(),
      );
      return;
    }

    if (event.request.method === 'GET') {
      event.respondWith(
        getTemplateById(id)
          .then((template) => {
            if (!template) {
              return new Response('Template not found', { status: 404 });
            }
            return new Response(JSON.stringify(template), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            });
          })
          .catch((error) => {
            return new Response(
              { message: 'Error fetching template', error },
              { status: 500 },
            );
          }),
      );
      return;
    }
  }
});
