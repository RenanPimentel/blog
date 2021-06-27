import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { Client } from "pg";
import { checkMe } from "./checkMe";
import { PORT } from "./config";
import { corsOptions } from "./constants";
import meRouter from "./routes/me";
import postsRouter from "./routes/posts";
import accountRouter from "./routes/account";
import usersRouter from "./routes/users";
import commentsRouter from "./routes/comments";

const db = new Client();
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

app.use(["/api/v1/posts", "/api/v1/comments", "/api/v1/me"], checkMe);

app.use("/api/v1/account", accountRouter);
app.use("/api/v1/me", meRouter);
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/comments", commentsRouter);

app.listen(PORT, async () => {
  await db.connect();

  console.log(`ready at port ${PORT}`);
});

export { db };
