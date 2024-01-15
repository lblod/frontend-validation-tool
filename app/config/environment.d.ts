/**
 * Type declarations for
 *    import config from 'validation-monitoring-tool/config/environment'
 */
declare const config: {
  environment: string;
  modulePrefix: string;
  podModulePrefix: string;
  locationType: 'history' | 'hash' | 'none' | 'auto';
  rootURL: string;
  APP: Record<string, unknown>;
  EmberENV: Record<string, unknown>;
};

export default config;
