import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Client } from "pg";
import loginRouter from "./routes/login";
import logoutRouter from "./routes/logout";
import meRouter from "./routes/me";
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

if (process.env.NODE_ENV === "production") {
  app.get("/", (_, res) => {
    res.sendFile(
      path.join(__dirname, "..", "..", "client", "build", "index.html")
    );
  });

  app.use(express.static(path.resolve("../client/build")));
}

app.listen(process.env.PORT, async () => {
  await pgClient.connect();
  console.log("ready at port 4000");
});

export { pgClient };
