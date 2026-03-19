import "dotenv/config";
import express from "express";
import { handleIntakeRequest } from "../server/intake";

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.all("*", handleIntakeRequest);

export default app;
