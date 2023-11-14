/// <reference types="astro/client" />
declare module "*.astro";

// Typescript support for user-defined environment variables in .env files
// (see https://docs.astro.build/en/guides/environment-variables/)
interface ImportMetaEnv {
  readonly CONTENTFUL_DELIVERY_TOKEN: string;
  readonly CONTENTFUL_PREVIEW_TOKEN: string;
  readonly CONTENTFUL_SPACE_ID: string;
  readonly CONTENTFUL_ENVIRONMENT: string;
  readonly GEOAPIFY_KEY: string;
  readonly MAPTILES_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
