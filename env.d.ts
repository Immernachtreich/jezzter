declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    PORT: number;
    BOT_TOKEN: string;
    JWT_SECRET: string;
    PGHOST: string;
    PGDATABASE: string;
    PGUSER: string;
    PGPASSWORD: string;
  }
}
