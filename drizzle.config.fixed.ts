import { defineConfig } from "drizzle-kit";

// Fixed configuration for your actual database setup
export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://findawise_user:findawise@localhost:5432/findawise_empire",
  },
  verbose: true,
  strict: true,
});
