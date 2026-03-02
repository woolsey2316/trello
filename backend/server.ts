import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import connect from "./db/connection.js";
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `${__dirname}/.env.${env}.local` });
const app = express();

//connection from db here
connect(app);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.listen(3000, () => {
  console.log("Server is up on port", 3000);
});
