import express from "express";
import cors from "cors";
import initRoute from "./routes/init";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/init", initRoute);

export default app;
