import "dotenv/config";
import express from "express";
import { handleLeadsRequest } from "../server/intake";

const app = express();

app.all("*", handleLeadsRequest);

export default app;
