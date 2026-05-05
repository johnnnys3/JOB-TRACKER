DROP INDEX IF EXISTS "Tag_name_key";

ALTER TABLE "Tag" ADD COLUMN "userId" TEXT;

CREATE TEMP TABLE "_TagUserMap" AS
SELECT
  "oldTagId",
  "userId",
  CASE
    WHEN "ownerRank" = 1 THEN "oldTagId"
    ELSE "oldTagId" || '_' || "userId"
  END AS "newTagId"
FROM (
  SELECT DISTINCT
    t."id" AS "oldTagId",
    a."userId",
    ROW_NUMBER() OVER (PARTITION BY t."id" ORDER BY a."userId") AS "ownerRank"
  FROM "Tag" t
  INNER JOIN "ApplicationTag" at ON at."tagId" = t."id"
  INNER JOIN "Application" a ON a."id" = at."applicationId"
) ranked;

UPDATE "Tag" t
SET "userId" = m."userId"
FROM "_TagUserMap" m
WHERE t."id" = m."oldTagId"
  AND m."newTagId" = m."oldTagId";

INSERT INTO "Tag" ("id", "name", "createdAt", "updatedAt", "userId")
SELECT
  m."newTagId",
  t."name",
  t."createdAt",
  t."updatedAt",
  m."userId"
FROM "_TagUserMap" m
INNER JOIN "Tag" t ON t."id" = m."oldTagId"
WHERE m."newTagId" <> m."oldTagId";

UPDATE "ApplicationTag" at
SET "tagId" = m."newTagId"
FROM "Application" a
INNER JOIN "_TagUserMap" m ON m."userId" = a."userId"
WHERE at."applicationId" = a."id"
  AND at."tagId" = m."oldTagId";

DELETE FROM "Tag" WHERE "userId" IS NULL;

ALTER TABLE "Tag" ALTER COLUMN "userId" SET NOT NULL;

CREATE INDEX "Tag_userId_idx" ON "Tag"("userId");
CREATE UNIQUE INDEX "Tag_userId_name_key" ON "Tag"("userId", "name");

ALTER TABLE "Tag" ADD CONSTRAINT "Tag_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
