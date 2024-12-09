/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `Notes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notes" DROP COLUMN "fileUrl",
ADD COLUMN     "filesUrls" TEXT[];
