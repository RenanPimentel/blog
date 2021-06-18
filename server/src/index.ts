import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { Client } from "pg";
import { PORT } from "./config";
import { corsOptions } from "./constants";
import loginRouter from "./routes/login";
import logoutRouter from "./routes/logout";
import meRouter from "./routes/me";
import postsRouter from "./routes/posts";
import registerRouter from "./routes/register";
import usersRouter from "./routes/users";

const db = new Client();
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

app.use(
  ["/api/v1/posts", "/api/v1/users", "/api/v1/me"],
  async (req, res, next) => {
    const { me } = req.cookies;

    if (!me) {
      res.status(400).json({
        data: null,
        errors: [{ reason: "You may have to able cookies" }],
      } as MyResponse);
      return;
    }

    const passwordResponse = await db.query(
      "SELECT password FROM users WHERE id = $1",
      [me.id]
    );
    const userActualPassword = passwordResponse.rows[0].password;

    if (userActualPassword !== me.password) {
      res.status(400).json({
        data: null,
        errors: [
          {
            reason: "User failed authentication, you may have to able cookies",
          },
        ],
      } as MyResponse);
      return;
    }

    next();
  }
);

app.use("/api/v1/register", registerRouter);
app.use("/api/v1/login", loginRouter);
app.use("/api/v1/logout", logoutRouter);
app.use("/api/v1/me", meRouter);
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/users", usersRouter);

app.listen(PORT, async () => {
  await db.connect();
  console.log(`ready at port ${PORT}`);
});

export { db };
