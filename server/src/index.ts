import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Client } from "pg";
import loginRouter from "./routes/login";
import meRouter from "./routes/me";
import registerRouter from "./routes/register";
dotenv.config({ path: "src/config/config.env" });

const pgClient = new Client();
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/me", meRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);

app.listen(4000, async () => {
  await pgClient.connect();
  console.log("ready at port 4000");
});

export { pgClient };
