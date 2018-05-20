module.exports = {
  stripPrefix: 'build/',
  staticFileGlobs: [
    'build/*.html',
    'build/manifest.json',
    'build/static/**/!(*map*)'
  ],
  // dontCacheBustUrlsMatching: /\.\w{8}\./,
  swFilePath: 'build/service-worker.js'/*,
  runtimeCaching: [{
    // urlPattern: /^https:\/\/example\.com\/api/,
    urlPattern: /^https:\/\/maps\.googleapis\/com/,
    handler: 'networkFirst'
  }]*/
};