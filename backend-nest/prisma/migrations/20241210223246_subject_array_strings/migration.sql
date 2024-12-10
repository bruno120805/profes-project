/*
  Warnings:

  - The `subject` column on the `Proffessor` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Proffessor" DROP COLUMN "subject",
ADD COLUMN     "subject" TEXT[];
