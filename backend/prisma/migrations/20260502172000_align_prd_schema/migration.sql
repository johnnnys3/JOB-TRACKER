-- Align the original migration with the PRD/current Prisma schema while preserving existing data where possible.

-- ApplicationStatus changed from a stage-heavy enum to the PRD enum.
CREATE TYPE "ApplicationStatus_new" AS ENUM ('WISHLIST', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED', 'ACCEPTED');

ALTER TABLE "Application"
  ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "Application"
  ALTER COLUMN "status" TYPE "ApplicationStatus_new"
  USING (
    CASE "status"::text
      WHEN 'PHONE_SCREEN' THEN 'INTERVIEW'
      WHEN 'TECHNICAL_INTERVIEW' THEN 'INTERVIEW'
      WHEN 'FINAL_INTERVIEW' THEN 'INTERVIEW'
      WHEN 'WITHDRAWN' THEN 'REJECTED'
      ELSE "status"::text
    END
  )::"ApplicationStatus_new";

ALTER TABLE "Application"
  ALTER COLUMN "status" SET DEFAULT 'APPLIED';

DROP TYPE "ApplicationStatus";
ALTER TYPE "ApplicationStatus_new" RENAME TO "ApplicationStatus";

-- Application fields changed to the PRD names.
ALTER TABLE "Application" RENAME COLUMN "position" TO "jobTitle";
ALTER TABLE "Application" RENAME COLUMN "lastUpdated" TO "updatedAt";
ALTER TABLE "Application" RENAME COLUMN "salary" TO "salaryRange";
ALTER TABLE "Application" RENAME COLUMN "requirements" TO "notes";

ALTER TABLE "Application"
  DROP COLUMN "jobType",
  ADD COLUMN "jobLink" TEXT,
  ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Interview fields changed to stage/date/notes only.
ALTER TABLE "Interview"
  DROP COLUMN "type",
  DROP COLUMN "time",
  DROP COLUMN "location",
  DROP COLUMN "status",
  DROP COLUMN "updatedAt";

DROP TYPE "JobType";
DROP TYPE "InterviewType";
DROP TYPE "InterviewStatus";

-- Tag color is not part of the current schema.
ALTER TABLE "Tag" DROP COLUMN "color";

-- Match current Prisma indexes.
DROP INDEX IF EXISTS "Tag_name_idx";
CREATE INDEX "Application_createdAt_idx" ON "Application"("createdAt");
