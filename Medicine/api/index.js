import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

//savinda
import SuserRoutes from "./routes/savinda/user.routes.js";
import Sauthroutes from "./routes/savinda/auth.routes.js";
import Sadminroutes from "./routes/savinda/admin.routes.js";
//hiruni
import HuserRoutes from "./routes/hiruni/user.routes.js";
import Hauthroutes from "./routes/hiruni/auth.routes.js";
import Hadminroutes from "./routes/hiruni/admin.routes.js";
//nisal
import userRoutes from "./routes/nisal/user.routes.js";
import authroutes from "./routes/nisal/auth.routes.js";

import cookieParser from "cookie-parser";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to Mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log("server listen on port 3000!");
});
//savinda
app.use("/api/savinda/user", SuserRoutes);
app.use("/api/savinda/auth", Sauthroutes);
app.use("/api/savinda/admin", Sadminroutes);
//hiruni
app.use("/api/hiruni/user", HuserRoutes);
app.use("/api/hiruni/auth", Hauthroutes);
app.use("/api/hiruni/admin", Hadminroutes);
//nisal

app.use("/api/nisal/user", userRoutes);
app.use("/api/nisal/auth", authroutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
