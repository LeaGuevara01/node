-- CreateTable Compra and CompraDetalle for purchases module

-- CreateTable Compra
CREATE TABLE IF NOT EXISTS "Compra" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "proveedorId" INTEGER NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "total" INTEGER,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Compra_pkey" PRIMARY KEY ("id")
);

-- CreateTable CompraDetalle
CREATE TABLE IF NOT EXISTS "CompraDetalle" (
    "id" SERIAL NOT NULL,
    "compraId" INTEGER NOT NULL,
    "repuestoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" INTEGER,
    "maquinariaId" INTEGER,
    "reparacionId" INTEGER,
    CONSTRAINT "CompraDetalle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey for Compra.proveedorId -> Proveedor.id
ALTER TABLE "Compra"
ADD CONSTRAINT IF NOT EXISTS "Compra_proveedorId_fkey"
FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKeys for CompraDetalle
ALTER TABLE "CompraDetalle"
ADD CONSTRAINT IF NOT EXISTS "CompraDetalle_compraId_fkey"
FOREIGN KEY ("compraId") REFERENCES "Compra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CompraDetalle"
ADD CONSTRAINT IF NOT EXISTS "CompraDetalle_repuestoId_fkey"
FOREIGN KEY ("repuestoId") REFERENCES "Repuesto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "CompraDetalle"
ADD CONSTRAINT IF NOT EXISTS "CompraDetalle_maquinariaId_fkey"
FOREIGN KEY ("maquinariaId") REFERENCES "Maquinaria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "CompraDetalle"
ADD CONSTRAINT IF NOT EXISTS "CompraDetalle_reparacionId_fkey"
FOREIGN KEY ("reparacionId") REFERENCES "Reparacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Trigger to update updatedAt on Compra
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW."updatedAt" = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_compra_updated_at ON "Compra";
CREATE TRIGGER update_compra_updated_at BEFORE UPDATE ON "Compra" FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
