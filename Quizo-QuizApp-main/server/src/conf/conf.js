import dotenv from "dotenv";
dotenv.config();

const conf = {
  MONGODB_URI: String(process.env.MONGO_DB_URL),
  JWT_SECRET: String(process.env.JWT_SECRET),
  PORT: Number(process.env.PORT) || 5000, // ✅ convert to number
  CORS_ORIGIN1: process.env.CORS_ORIGIN1,
  CORS_ORIGIN2: process.env.CORS_ORIGIN2,
  // CORS_ORIGIN3: process.env.CORS_ORIGIN3,
};
export default conf;

