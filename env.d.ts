/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_EMAIL_FOR_FEEDBACK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
