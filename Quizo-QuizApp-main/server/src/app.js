import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import helmet from "helmet";
import conf from "./conf/conf.js";
import path from "path";
import scoreRoutes from "./routes/score.routes.js";

import Routes from "./routes/index.js"; // central routes file

const app = express();

// Body parser
app.use(bodyParser.json());

// Apply security headers using Helmet
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use("/api/scores", scoreRoutes);


// ✅ CORS (allow your frontend)
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Additional security headers
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  next();
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));
app.use(cookieParser());

// ✅ Central routes
app.use("/api", Routes);

// Test routes
app.post("/testing", (req, res) => {
  console.log("Testing");
  res.send("Hello, testing completed");
});

app.get("/", (req, res) => {
  res.send("Welcome to the Express Server with Security Measures!");
});

export { app };
