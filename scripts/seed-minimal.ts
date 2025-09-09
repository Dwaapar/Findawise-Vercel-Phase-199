// <repo root>/scripts/seed-minimal.ts
import 'dotenv/config';
import { Pool } from 'pg';
import { randomUUID } from 'crypto';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Utility: show table columns
async function columns(table: string) {
  const q = `
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema='public' AND table_name=$1
    ORDER BY ordinal_position
  `;
  const { rows } = await pool.query(q, [table]);
  console.log(`\nColumns for ${table}: ${rows.map(r => r.column_name).join(', ')}`);
}

// Utility: check if a column is nullable
async function isNullable(table: string, column: string) {
  const q = `
    SELECT is_nullable
    FROM information_schema.columns
    WHERE table_schema='public' AND table_name=$1 AND column_name=$2
    LIMIT 1
  `;
  const { rows } = await pool.query(q, [table, column]);
  return rows[0]?.is_nullable === 'YES';
}

// ---------------- VECTOR MODELS ----------------
async function seedVectorModels() {
  try {
    const sql = `
      INSERT INTO vector_embedding_models
        (model_name, provider, dimensions, max_input_length, is_active, is_default,
         configuration, performance, supported_languages, api_endpoint, api_key_required, cost_per_token)
      VALUES
        ($1,$2,$3,$4,$5,$6,$7::jsonb,$8::jsonb,$9::jsonb,$10,$11,$12)
      ON CONFLICT DO NOTHING;
    `;
    await pool.query(sql, [
      'all-mpnet-base-v2',
      'local',
      768,
      2048,
      true,
      true,
      '{}',
      '{}',
      JSON.stringify(["en"]),
      null,
      false,
      0.0,
    ]);
    console.log('[OK] vector_embedding_models seeded');
  } catch (err) {
    console.error('[ERR] vector_embedding_models:', err.message);
  }
}

// ---------------- PROMPT TEMPLATES ----------------
async function seedPromptTemplates() {
  try {
    const templateId = randomUUID();
    const createdByNullable = await isNullable('prompt_templates', 'created_by');
    const createdBy = createdByNullable ? null : 1;

    const sql = `
      INSERT INTO prompt_templates
        (template_id, name, description, category, template, variables, supported_agents,
         average_tokens, success_rate, usage_count, created_by, version, status, metadata)
      VALUES
        ($1,$2,$3,$4,$5,$6::jsonb,$7::jsonb,$8,$9,$10,$11,$12,$13,$14::jsonb)
      ON CONFLICT DO NOTHING;
    `;
    await pool.query(sql, [
      templateId,
      'CTA Rewrite',
      'Rewrite CTA copy for target archetype.',
      'cta',
      'Rewrite CTA for {archetype} with emotion {emotion}.',
      JSON.stringify(['archetype', 'emotion']),
      JSON.stringify([]),
      60,
      0.0,
      0,
      createdBy,
      'v1',
      'active',
      '{}',
    ]);
    console.log('[OK] prompt_templates seeded');
  } catch (err) {
    console.error('[ERR] prompt_templates:', err.message);
  }
}

// ---------------- API-ONLY NEURONS ----------------
async function seedApiOnlyNeuron() {
  try {
    const endpoints = JSON.stringify([
      { path: "/infer", method: "POST", description: "Run inference" },
      { path: "/meta", method: "GET", description: "Fetch model metadata" },
      { path: "/health", method: "GET", description: "Health check" }
    ]);

    const apiKey = randomUUID(); // ✅ Generate API key so NOT NULL constraint passes

    const sql = `
      INSERT INTO api_only_neurons
        (neuron_id, name, type, language, version, base_url, healthcheck_endpoint,
         api_endpoints, authentication, capabilities, dependencies, resource_requirements,
         deployment_info, status, is_active, api_key, metadata)
      VALUES
        ($1,$2,$3,$4,$5,$6,$7,
         $8::jsonb,$9::jsonb,$10::jsonb,$11::jsonb,$12::jsonb,
         $13::jsonb,$14,$15,$16,$17::jsonb)
      ON CONFLICT DO NOTHING;
    `;
    await pool.query(sql, [
      'python-neuron-1',
      'Python Neuron 1',
      'service',
      'en',
      '1.0.0',
      'http://localhost:9001',
      '/health',
      endpoints,
      '{}',
      '[]',
      '{}',
      '{}',
      '{}',
      'online',
      true,
      apiKey, // ✅ Required field
      '{}'
    ]);
    console.log('[OK] api_only_neurons seeded');
  } catch (err) {
    console.error('[ERR] api_only_neurons:', err.message);
  }
}

// ---------------- MAIN ----------------
async function main() {
  await columns('vector_embedding_models');
  await seedVectorModels();

  await columns('prompt_templates');
  await seedPromptTemplates();

  await columns('api_only_neurons');
  await seedApiOnlyNeuron();

  await pool.end();
  console.log('\nSeed complete.');
}

main().catch(async (e) => {
  console.error('[FATAL]', e);
  await pool.end();
  process.exit(1);
});
