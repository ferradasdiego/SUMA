const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Wasm es necesario para SQLite en web (wa-sqlite).
if (!config.resolver.assetExts.includes('wasm')) {
  config.resolver.assetExts.push('wasm');
}

// SQLite web usa SharedArrayBuffer: el servidor de desarrollo debe aislar el origen.
const enhanceMiddleware = config.server.enhanceMiddleware;
config.server.enhanceMiddleware = (middleware, metroServer) => {
  const enhanced = enhanceMiddleware ? enhanceMiddleware(middleware, metroServer) : middleware;

  return (req, res, next) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    return enhanced(req, res, next);
  };
};

module.exports = config;
