import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import connect from "./db/connection.js";
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import dotenv from "dotenv";
import passport from "passport";
import boardRouter from "./routes/board.route.js";
import listRouter from "./routes/list.route.js";
import cardRouter from "./routes/card.route.js";
import authRouter, { configurePassport } from "./routes/auth.route.js";
import { requireAuth } from "./middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `${__dirname}/.env.${env}.local` });
configurePassport();
const app = express();

// connection from db here
connect(app);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRouter);
app.use("/api/boards", requireAuth, boardRouter);
app.use("/api/lists", requireAuth, listRouter);
app.use("/api/cards", requireAuth, cardRouter);

app.listen(3000, () => {
  console.log("Server is up on port", 3000);
});
