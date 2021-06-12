import dotenv from "dotenv";
import express from "express";
import { Client } from "pg";
import meRouter from "./routes/me";
import cookieParser from "cookie-parser";
import registerRouter from "./routes/register";
import loginRouter from "./routes/login";
dotenv.config({ path: "src/config/config.env" });

const pgClient = new Client();
const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/me", meRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);

app.listen(4000, async () => {
  await pgClient.connect();
  console.log("ready at http://localhost:4000");
});

export { pgClient };
