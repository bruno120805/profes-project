/*
  Warnings:

  - You are about to drop the column `expirationToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `expirationTokenDate` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "expirationToken",
DROP COLUMN "expirationTokenDate";
