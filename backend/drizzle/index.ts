import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { relations } from "../src/db/relations";

export const db = drizzle(process.env.DATABASE_URL as string, { relations });
