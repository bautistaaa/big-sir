// <reference types"vite/client" />
/// <reference types="spotify-api" />
/// <reference types="spotify-web-playback-sdk" />

interface ImportMetaEnv {
  readonly VITE_REACT_APP_SPOTIFY_CLIENT_ID: string;
  readonly VITE_REACT_APP_SPOTIFY_CLIENT_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}