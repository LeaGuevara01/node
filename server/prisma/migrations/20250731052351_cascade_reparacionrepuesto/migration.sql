-- DropForeignKey
ALTER TABLE "public"."ReparacionRepuesto" DROP CONSTRAINT "ReparacionRepuesto_reparacionId_fkey";

-- AddForeignKey
ALTER TABLE "public"."ReparacionRepuesto" ADD CONSTRAINT "ReparacionRepuesto_reparacionId_fkey" FOREIGN KEY ("reparacionId") REFERENCES "public"."Reparacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
