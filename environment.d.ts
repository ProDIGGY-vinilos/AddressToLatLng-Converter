export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APIKEY: string;
      EXCEL_URL: string;
    }
  }
}
