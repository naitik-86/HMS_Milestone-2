import express from "express";
import cors from "cors";

import staffRoutes from "./routes/staffRoutes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message:
            "HMS Backend Running",
    });
});

app.use(
    "/api/staff",
    staffRoutes
);

export default app;