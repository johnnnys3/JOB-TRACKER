import { readFileSync } from 'fs';
import { join } from 'path';

describe('Prisma schema integrity', () => {
  const schema = readFileSync(join(process.cwd(), 'prisma', 'schema.prisma'), 'utf8');

  it('cascades user-owned applications, interviews, tags, and application tag joins', () => {
    expect(schema).toContain('user        User @relation(fields: [userId], references: [id], onDelete: Cascade)');
    expect(schema).toContain('application   Application @relation(fields: [applicationId], references: [id], onDelete: Cascade)');
    expect(schema).toContain('user          User @relation(fields: [userId], references: [id], onDelete: Cascade)');
    expect(schema).toContain('application Application @relation(fields: [applicationId], references: [id], onDelete: Cascade)');
    expect(schema).toContain('tag         Tag @relation(fields: [tagId], references: [id], onDelete: Cascade)');
  });

  it('keeps tags scoped per user to avoid cross-account data leakage', () => {
    expect(schema).toContain('@@unique([userId, name])');
    expect(schema).toContain('@@index([userId])');
  });
});
