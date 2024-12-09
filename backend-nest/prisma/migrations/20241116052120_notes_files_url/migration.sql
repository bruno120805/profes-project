/*
  Warnings:

  - The `fileUrl` column on the `Notes` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Notes" DROP COLUMN "fileUrl",
ADD COLUMN     "fileUrl" TEXT[];
