-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "difficulty" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rating" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "wouldRetake" BOOLEAN;