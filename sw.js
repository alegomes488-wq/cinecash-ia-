// Namespaced config to avoid collisions and accidental overwrites
self.__cinecash_sw_options__ = {
  domain: "3nbf4.com",
  zoneId: 10824161
};

// Try to import the remote script but fail gracefully so the service worker
// registration/installation doesn't completely break if the network request fails.
try {
  // Do not import remote scripts automatically. If you have a vetted local copy,
  // update this path to a local asset like `/static/service-worker.min.js`.
  // importScripts('/static/service-worker.min.js');
  // For now, avoid executing unknown remote code.
} catch (err) {
  console.error('[sw] unexpected error in service worker:', err);
}
