-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportId" TEXT,
    "department" TEXT NOT NULL,
    "credentialNo" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "verifiedBy" TEXT NOT NULL,
    "notes" TEXT,
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Verification_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Verification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Verification" ("createdAt", "credentialNo", "department", "id", "notes", "reportId", "result", "userId", "verifiedBy") SELECT "createdAt", "credentialNo", "department", "id", "notes", "reportId", "result", "userId", "verifiedBy" FROM "Verification";
DROP TABLE "Verification";
ALTER TABLE "new_Verification" RENAME TO "Verification";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
