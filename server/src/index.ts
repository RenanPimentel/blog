import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import { Application } from "express-ws";
import http from "http";
import { Client } from "pg";
import WebSocket from "ws";
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

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (socket, _) => {
  let user: null | { id: string; password: string } = null;

  socket.on("message", data => {
    let msgUser = JSON.parse(String(data));
    if (!msgUser.id) return;
    user = msgUser;

    db.query("UPDATE users SET online = TRUE WHERE id = $1 AND password = $2", [
      user?.id,
      user?.password,
    ]);
  });

  socket.on("close", () => {
    db.query(
      "UPDATE users SET online = FALSE WHERE id = $1 AND password = $2",
      [user?.id, user?.password]
    );
  });
});

app.use(["/api/v1/posts", "/api/v1/comments", "/api/v1/me"], checkMe);

app.use("/api/v1/account", accountRouter);
app.use("/api/v1/me", meRouter);
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/comments", commentsRouter);
app.use("/api/v1/search", searchRouter);

server.listen(PORT, async () => {
  await db.connect();
  console.log(`ready at port ${PORT}`);
});

export { db };
