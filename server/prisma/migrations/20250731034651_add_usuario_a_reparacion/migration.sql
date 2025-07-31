-- AlterTable
ALTER TABLE "public"."Reparacion" ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Reparacion" ADD CONSTRAINT "Reparacion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
