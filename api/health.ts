import "dotenv/config";
import express from "express";
import { handleHealthRequest } from "../server/intake";

const app = express();

app.all("*", handleHealthRequest);

export default app;
