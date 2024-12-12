/*
  Warnings:

  - The `difficulty` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `rating` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `wouldRetake` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Rating" AS ENUM ('Excellent', 'Good', 'Bad');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('Easy', 'Regular', 'Hard');

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" "Difficulty" NOT NULL DEFAULT 'Regular',
DROP COLUMN "rating",
ADD COLUMN     "rating" "Rating" NOT NULL DEFAULT 'Good',
ALTER COLUMN "wouldRetake" SET NOT NULL,
ALTER COLUMN "wouldRetake" SET DEFAULT false;
