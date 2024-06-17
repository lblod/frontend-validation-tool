/**
 * Type declarations for
 *    import config from 'frontend-validation-tool/config/environment'
 */
declare const config: {
  environment: string;
  modulePrefix: string;
  podModulePrefix: string;
  locationType: 'history' | 'hash' | 'none' | 'auto';
  rootURL: string;
  APP: Record<string, unknown>;
  CORS_PROXY_URL: string;
  EmberENV: Record<string, unknown>;
};

export default config;
