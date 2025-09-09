import { defineConfig } from "drizzle-kit";

// Local development configuration
export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://empire_user:empire_password@localhost:5432/empire_database",
  },
  verbose: true,
  strict: true,
});