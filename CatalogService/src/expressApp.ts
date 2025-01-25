import express from "express";
import catalogRouter from "./apis/catalog.routes";

const app = express();
app.use(express.json());

app.use("/", catalogRouter);

export default app;
