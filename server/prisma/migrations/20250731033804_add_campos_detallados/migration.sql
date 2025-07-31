/*
  Warnings:

  - You are about to drop the column `tipo` on the `Maquinaria` table. All the data in the column will be lost.
  - Made the column `modelo` on table `Maquinaria` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Maquinaria" DROP COLUMN "tipo",
ADD COLUMN     "anio" INTEGER,
ADD COLUMN     "categoria" TEXT,
ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "estado" TEXT,
ADD COLUMN     "numero_serie" TEXT,
ADD COLUMN     "proveedor" TEXT,
ADD COLUMN     "ubicacion" TEXT,
ALTER COLUMN "modelo" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Proveedor" ADD COLUMN     "cuit" TEXT,
ADD COLUMN     "direccion" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "productos" TEXT[],
ADD COLUMN     "telefono" TEXT,
ADD COLUMN     "web" TEXT;

-- AlterTable
ALTER TABLE "public"."Repuesto" ADD COLUMN     "categoria" TEXT,
ADD COLUMN     "codigo" TEXT,
ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "precio" INTEGER,
ADD COLUMN     "proveedor" TEXT,
ADD COLUMN     "ubicacion" TEXT;
