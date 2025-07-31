-- DropForeignKey
ALTER TABLE "public"."Reparacion" DROP CONSTRAINT "Reparacion_maquinariaId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Reparacion" ADD CONSTRAINT "Reparacion_maquinariaId_fkey" FOREIGN KEY ("maquinariaId") REFERENCES "public"."Maquinaria"("id") ON DELETE CASCADE ON UPDATE CASCADE;
