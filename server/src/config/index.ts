import dotenv from "dotenv";
dotenv.config({ path: "src/config/config.env" });

const { NODE_ENV, PGDATABASE, PGHOST, PGPASSWORD, PGPORT, PGUSER, PORT } =
  process.env as unknown as ENV;

export { NODE_ENV, PGDATABASE, PGHOST, PGPASSWORD, PGPORT, PGUSER, PORT };
