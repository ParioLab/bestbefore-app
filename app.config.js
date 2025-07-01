import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  owner: "georgeeshes",
  ios: {
    ...(config.ios || {}),
    bundleIdentifier: "com.georgeeshes.bestbefore",
    scheme: "bestbefore",
  },
  android: {
    ...(config.android || {}),
    package: "com.georgeeshes.bestbefore",
    scheme: "bestbefore",
  },
  extra: {
    ...config.extra,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    // Add other env vars as needed
    eas: {
      ...(config.extra && config.extra.eas ? config.extra.eas : {}),
      projectId: "1c412bec-ff0f-4cba-bb4f-db758ee0c924"
    }
  },
  plugins: [
    ...(config.plugins || []),
  ],
}); 