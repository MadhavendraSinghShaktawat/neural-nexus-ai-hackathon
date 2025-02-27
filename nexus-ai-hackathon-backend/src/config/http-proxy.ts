import { createProxyMiddleware } from 'http-proxy-middleware';
import { logger } from './logger';
import { Express } from 'express';

export const setupProxy = (app: Express): void => {
  try {
    // Proxy requests to Gemini API
    app.use(
      '/api/proxy/gemini',
      createProxyMiddleware({
        target: 'https://generativelanguage.googleapis.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api/proxy/gemini': '/v1',
        },
        onProxyReq: (proxyReq, req, res) => {
          // Add API key to the request
          const url = new URL(proxyReq.path, 'https://generativelanguage.googleapis.com');
          url.searchParams.append('key', process.env.GEMINI_API_KEY || '');
          proxyReq.path = url.pathname + url.search;
        },
        logLevel: 'debug',
        onError: (err, req, res) => {
          logger.error('Proxy error', { error: err });
          res.writeHead(500, {
            'Content-Type': 'application/json',
          });
          res.end(JSON.stringify({ error: 'Proxy error', message: err.message }));
        },
      })
    );
    
    logger.info('HTTP proxy middleware configured');
  } catch (error) {
    logger.error('Failed to set up proxy middleware', { 
      error: error instanceof Error ? error.message : String(error)
    });
  }
}; 