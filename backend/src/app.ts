import express from "express";
import cors from "cors";
import initRoute from "./routes/init";
import cafesRoute from "./routes/cafes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/init", initRoute);
app.use("/api/cafes", cafesRoute);

export default app;
