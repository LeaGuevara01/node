
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:4000/api/repuestos/bulk';

async function importRepuestosFromCSV() {
  try {
    console.log('🚀 Iniciando importación de repuestos vía API bulk...');

    // Leer el archivo CSV
    const csvPath = path.join(__dirname, '../repuestos_normalizado.csv');
    const csvData = fs.readFileSync(csvPath, 'utf-8');

    // Parsear CSV
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');

    console.log(`📊 Headers encontrados: ${headers.join(', ')}`);
    console.log(`📄 Total de líneas: ${lines.length - 1}`);

    // Convertir a objetos
    const repuestos = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const values = line.split(',');
      repuestos.push({
        nombre: values[0] || 'Sin nombre',
        codigo: values[1] || null,
        stock: values[2] ? parseInt(values[2]) : 0,
        precio: values[3] ? parseInt(values[3]) : null,
        categoria: values[4] || null,
        descripcion: values[5] || null,
        proveedor: values[6] || null,
        ubicacion: values[7] || null,
      });
    }

    // Importar en lotes/chunks
    const chunkSize = 20;
    let importedCount = 0;
    let errorCount = 0;
    for (let i = 0; i < repuestos.length; i += chunkSize) {
      const chunk = repuestos.slice(i, i + chunkSize);
      try {
        const response = await axios.post(API_URL, { repuestos: chunk }, {
          headers: { 'Content-Type': 'application/json' },
        });
        importedCount += response.data.created.length;
        console.log(`✅ Lote importado (${i + 1}-${i + chunk.length})`);
      } catch (error) {
        errorCount += chunk.length;
        console.error(`❌ Error en lote ${i + 1}-${i + chunk.length}: ${error.message}`);
      }
    }

    console.log('\n📈 Resumen de importación:');
    console.log(`✅ Repuestos procesados: ${importedCount}`);
    console.log(`❌ Errores: ${errorCount}`);
  } catch (error) {
    console.error('💥 Error durante la importación:', error);
  }
}

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
