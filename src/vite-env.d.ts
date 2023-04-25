// <reference types"vite/client" />

interface ImportMetaEnv {
  readonly VITE_REACT_APP_SPOTIFY_CLIENT_ID: string;
  readonly VITE_REACT_APP_SPOTIFY_CLIENT_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}