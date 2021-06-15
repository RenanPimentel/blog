import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Client } from "pg";
import loginRouter from "./routes/login";
import logoutRouter from "./routes/logout";
import meRouter from "./routes/me";
import postsRouter from "./routes/posts";
import registerRouter from "./routes/register";
dotenv.config({ path: "src/config/config.env" });

const pgClient = new Client();
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/me", meRouter);
app.use("/api/v1/register", registerRouter);
app.use("/api/v1/login", loginRouter);
app.use("/api/v1/logout", logoutRouter);
app.use("/api/v1/posts", postsRouter);

app.listen(process.env.PORT, async () => {
  await pgClient.connect();
  console.log("ready at port 4000");
});

export { pgClient };
