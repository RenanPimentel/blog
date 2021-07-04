import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import { Application } from "express-ws";
import http from "http";
import { Client } from "pg";
import { Server } from "socket.io";
import { checkMe } from "./checkMe";
import { PORT } from "./config";
import { corsOptions } from "./constants";
import accountRouter from "./routes/account";
import commentsRouter from "./routes/comments";
import meRouter from "./routes/me";
import postsRouter from "./routes/posts";
import searchRouter from "./routes/search";
import usersRouter from "./routes/users";

interface App extends Express, Application {}

const db = new Client();
const app = express() as App;
const httpServer = http.createServer(app);
const io = require("socket.io")(httpServer, {
  cors: { origin: "*" },
}) as Server;

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use(["/api/v1/posts", "/api/v1/comments", "/api/v1/me"], checkMe);

app.use("/api/v1/account", accountRouter);
app.use("/api/v1/me", meRouter);
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/comments", commentsRouter);
app.use("/api/v1/search", searchRouter);

io.on("connection", socket => {
  let data: null | { id: string; password: string } = null;

  socket.on("notification", message => {
    /*
      notify comments in author posts or new posts from followed user
    */

    const msg = typeof message === "string" ? JSON.parse(message) : message;

    io.emit("notification", JSON.stringify(msg));
  });

  socket.on("message", message => {
    let msg = JSON.parse(String(message));

    if (msg.status === "connecting") {
      data = msg;

      db.query(
        "UPDATE users SET last_login = NOW() WHERE id = $1 AND password = $2",
        [data?.id, data?.password]
      );
      db.query(
        "UPDATE users SET online = TRUE WHERE id = $1 AND password = $2",
        [data?.id, data?.password]
      );
    } else if (msg.status === "notification") {
      /*
        TODO: push notification data to table and if user is online push it to client via ws
      */
    }
  });

  socket.on("close", () => {
    db.query(
      "UPDATE users SET last_login = NOW() WHERE id = $1 AND password = $2",
      [data?.id, data?.password]
    );
    db.query(
      "UPDATE users SET online = FALSE WHERE id = $1 AND password = $2",
      [data?.id, data?.password]
    );
  });
});

httpServer.listen(PORT, async () => {
  await db.connect();
  console.log(`server at ${PORT}`);
});

export { db };
