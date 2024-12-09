-- AlterTable
ALTER TABLE "Notes" ADD COLUMN     "proffessorId" TEXT;

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_proffessorId_fkey" FOREIGN KEY ("proffessorId") REFERENCES "Proffessor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
