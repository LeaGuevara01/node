-- CreateTable
CREATE TABLE "Maquinaria" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "modelo" TEXT,

    CONSTRAINT "Maquinaria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Repuesto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "proveedorId" INTEGER,

    CONSTRAINT "Repuesto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proveedor" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reparacion" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "maquinariaId" INTEGER NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Reparacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReparacionRepuesto" (
    "id" SERIAL NOT NULL,
    "reparacionId" INTEGER NOT NULL,
    "repuestoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "ReparacionRepuesto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Repuesto" ADD CONSTRAINT "Repuesto_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reparacion" ADD CONSTRAINT "Reparacion_maquinariaId_fkey" FOREIGN KEY ("maquinariaId") REFERENCES "Maquinaria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReparacionRepuesto" ADD CONSTRAINT "ReparacionRepuesto_reparacionId_fkey" FOREIGN KEY ("reparacionId") REFERENCES "Reparacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReparacionRepuesto" ADD CONSTRAINT "ReparacionRepuesto_repuestoId_fkey" FOREIGN KEY ("repuestoId") REFERENCES "Repuesto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
