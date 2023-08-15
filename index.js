import express from "express";
import userRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
const app = express();
import auth from "./middleware/auth.js";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

// database connection configuration
connectDB();

// cors configuration
app.use(cors());

// middleware
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// api routes
app.use("/api/auth", userRoutes);

// auth middlewares routes
app.post("/profile", auth, (req, res) => {
  res.status(200).send("Welcome to Middleware");
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
