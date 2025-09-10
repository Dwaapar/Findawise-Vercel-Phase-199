import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/pglite';
import { eq } from 'drizzle-orm';
import { PGlite } from '@electric-sql/pglite';

const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

describe('Drizzle ORM basic operations', () => {
  let db: ReturnType<typeof drizzle>;
  let client: PGlite;

  beforeEach(async () => {
    client = new PGlite();
    db = drizzle(client);
    await client.exec('CREATE TABLE users (id serial PRIMARY KEY, name text NOT NULL);');
  });

  afterEach(async () => {
    await client.close();
  });

  it('should insert and update records', async () => {
    const inserted = await db.insert(users).values({ name: 'Alice' }).returning();
    expect(inserted[0]).toMatchObject({ id: 1, name: 'Alice' });

    const updated = await db
      .update(users)
      .set({ name: 'Alicia' })
      .where(eq(users.id, inserted[0].id))
      .returning();
    expect(updated[0]).toMatchObject({ id: 1, name: 'Alicia' });

    const all = await db.select().from(users);
    expect(all).toHaveLength(1);
    expect(all[0].name).toBe('Alicia');
  });
});
