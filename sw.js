// Namespaced config to avoid collisions and accidental overwrites
self.__cinecash_sw_options__ = {
  domain: "3nbf4.com",
  zoneId: 10824161
};

// Try to import the remote script but fail gracefully so the service worker
// registration/installation doesn't completely break if the network request fails.
try {
  // Prefer local vendored copy to avoid executing remote code directly.
  importScripts('/vendor/service-worker.min.js');
} catch (err) {
  // Keep a clear error message in the console for debugging
  console.error('[sw] Failed to import remote service worker script:', err);

  // Minimal fallback: add a no-op fetch handler so the SW doesn't crash
  // and requests continue to the network as usual.
  self.addEventListener('fetch', function noopFetchHandler(event) {
    // Intentionally empty: allow network to handle requests.
  });
}
