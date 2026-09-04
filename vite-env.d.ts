/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly service_role_KEY?: string;
  readonly SUPABASE?: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}

