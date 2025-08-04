const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function importRepuestosFromCSV() {
  try {
    console.log('🚀 Iniciando importación de repuestos...');
    
    // Leer el archivo CSV
    const csvPath = path.join(__dirname, '../repuestos_normalizado.csv');
    const csvData = fs.readFileSync(csvPath, 'utf-8');
    
    // Parsear CSV
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    
    console.log(`📊 Headers encontrados: ${headers.join(', ')}`);
    console.log(`📄 Total de líneas: ${lines.length - 1}`);
    
    let importedCount = 0;
    let errorCount = 0;
    
    // Procesar cada línea (saltar header)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(',');
      
      // Mapear valores a campos
      const repuestoData = {
        nombre: values[0] || 'Sin nombre',
        codigo: values[1] || null,
        stock: values[2] ? parseInt(values[2]) : 0,
        precio: values[3] ? parseInt(values[3]) : null,
        categoria: values[4] || null,
        descripcion: values[5] || null,
        proveedor: values[6] || null,
        ubicacion: values[7] || null
      };
      
      try {
        // Verificar si ya existe un repuesto con el mismo código
        let existingRepuesto = null;
        if (repuestoData.codigo) {
          existingRepuesto = await prisma.repuesto.findFirst({
            where: { codigo: repuestoData.codigo }
          });
        }
        
        if (existingRepuesto) {
          // Actualizar stock si ya existe
          await prisma.repuesto.update({
            where: { id: existingRepuesto.id },
            data: {
              stock: existingRepuesto.stock + repuestoData.stock,
              ubicacion: repuestoData.ubicacion || existingRepuesto.ubicacion
            }
          });
          console.log(`📦 Actualizado stock para: ${repuestoData.nombre} (${repuestoData.codigo})`);
        } else {
          // Crear nuevo repuesto
          await prisma.repuesto.create({
            data: repuestoData
          });
          console.log(`✅ Importado: ${repuestoData.nombre}`);
        }
        
        importedCount++;
        
      } catch (error) {
        console.error(`❌ Error en línea ${i}: ${error.message}`);
        console.error(`   Datos: ${JSON.stringify(repuestoData)}`);
        errorCount++;
      }
    }
    
    console.log('\n📈 Resumen de importación:');
    console.log(`✅ Repuestos procesados: ${importedCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    
    // Mostrar estadísticas finales
    const totalRepuestos = await prisma.repuesto.count();
    const categorias = await prisma.repuesto.groupBy({
      by: ['categoria'],
      _count: { categoria: true }
    });
    
    console.log(`📊 Total de repuestos en base de datos: ${totalRepuestos}`);
    console.log('\n📋 Repuestos por categoría:');
    categorias.forEach(cat => {
      console.log(`   ${cat.categoria || 'Sin categoría'}: ${cat._count.categoria}`);
    });
    
  } catch (error) {
    console.error('💥 Error durante la importación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  importRepuestosFromCSV()
    .then(() => {
      console.log('🎉 Importación completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { importRepuestosFromCSV };
