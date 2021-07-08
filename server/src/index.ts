import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import { Application } from "express-ws";
import http from "http";
import { Client } from "pg";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { checkMe } from "./checkMe";
import { PORT } from "./config";
import { corsOptions } from "./constants";
import accountRouter from "./routes/account";
import commentsRouter from "./routes/comments";
import meRouter from "./routes/me";
import notificationsRouter from "./routes/notifications";
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

app.use(
  [
    "/api/v1/me",
    "/api/v1/users",
    "/api/v1/posts",
    "/api/v1/comments",
    "/api/v1/notifications",
  ],
  checkMe
);

app.use("/api/v1/me", meRouter);
app.use("/api/v1/account", accountRouter);
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/comments", commentsRouter);
app.use("/api/v1/search", searchRouter);
app.use("/api/v1/notifications", notificationsRouter);

type MySocket = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap> & {
  me?: { id: string; password: string };
};

io.on("connection", (socket: MySocket) => {
  socket.on("notification", msg => {
    if (msg.data.type === "post")
      msg.for = msg.for.map((str: string) => `user${str}`);

    io.to(msg.for).emit("notification", { ...msg, for: null });
  });

  socket.on("connect_message", async data => {
    socket.me = data;

    if (!socket.me?.id) return;

    const followResponse = await db.query(
      "SELECT followed_id id FROM follows WHERE follower_id = $1",
      [socket.me.id]
    );
    const postResponse = await db.query(
      "SELECT id FROM posts WHERE author_id = $1",
      [socket.me.id]
    );

    const socketRooms = [
      ...followResponse.rows.map(row => `user${row.id}`),
      ...postResponse.rows.map(row => `post${row.id}`),
      socket.me.id,
    ];

    socket.join(socketRooms);

    db.query(
      "UPDATE users SET last_login = NOW() WHERE id = $1 AND password = $2",
      [data?.id, data?.password]
    );
    db.query("UPDATE users SET online = TRUE WHERE id = $1 AND password = $2", [
      data?.id,
      data?.password,
    ]);
  });

  socket.on("disconnecting", () => {
    db.query(
      "UPDATE users SET last_login = NOW() WHERE id = $1 AND password = $2",
      [socket.me?.id, socket.me?.password]
    );
    db.query(
      "UPDATE users SET online = FALSE WHERE id = $1 AND password = $2",
      [socket.me?.id, socket.me?.password]
    );
  });
});

httpServer.listen(PORT, async () => {
  await db.connect();
  console.log(`server at ${PORT}`);
});

export { db };
