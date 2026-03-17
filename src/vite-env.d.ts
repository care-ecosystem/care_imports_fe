/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly REACT_DISABLE_OVERRIDE: string;
}

declare global {
  var __CORE_ENV__: {
    readonly apiUrl: string;
  };
}
