/*
  Warnings:

  - You are about to drop the `Website` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `userId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `websiteUrl` on the `Message` table. All the data in the column will be lost.
  - Added the required column `formSlug` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Website";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Form" (
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL PRIMARY KEY,
    "domain" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Form_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "from" TEXT,
    "object" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "formSlug" TEXT NOT NULL,
    CONSTRAINT "Message_formSlug_fkey" FOREIGN KEY ("formSlug") REFERENCES "Form" ("slug") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("content", "createdAt", "from", "id", "object", "updatedAt") SELECT "content", "createdAt", "from", "id", "object", "updatedAt" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
