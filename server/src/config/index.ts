import dotenv from "dotenv";
dotenv.config({ path: "src/config/config.env" });

const {
  NODE_ENV,
  PGDATABASE,
  PGHOST,
  PGPASSWORD,
  PGPORT,
  PGUSER,
  PORT,
  GMAILPASS,
  GMAILUSER,
  CLIENT_URL,
} = process.env;

export {
  NODE_ENV,
  PGDATABASE,
  PGHOST,
  PGPASSWORD,
  PGPORT,
  PGUSER,
  PORT,
  GMAILPASS,
  GMAILUSER,
  CLIENT_URL,
};
