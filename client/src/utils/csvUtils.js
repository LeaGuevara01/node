// Shared CSV processing utilities
import Papa from 'papaparse';

export const processCSVFile = async (file, validationFn, createFn, token) => {
  return new Promise((resolve) => {
    let successCount = 0;
    let failCount = 0;
    const errors = [];

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const validRows = results.data.filter(validationFn);
        
        for (const [index, row] of validRows.entries()) {
          try {
            await createFn(row, token);
            successCount++;
          } catch (err) {
            failCount++;
            errors.push(`Fila ${index + 1}: ${err.message}`);
          }
        }

        resolve({
          success: successCount,
          failed: failCount,
          errors: errors.slice(0, 5), // Limit to first 5 errors
          totalErrors: errors.length
        });
      },
      error: (err) => {
        resolve({
          success: 0,
          failed: 0,
          errors: ['Error al procesar el archivo CSV'],
          totalErrors: 1
        });
      }
    });
  });
};

export const createCSVValidators = {
  maquinaria: (row) => row.nombre && row.tipo,
  repuesto: (row) => row.nombre && row.codigo,
  proveedor: (row) => row.nombre && row.email,
  reparacion: (row) => row.fecha && row.maquinariaId && row.userId
};

export const createCSVMappers = {
  maquinaria: (row) => ({
    nombre: row.nombre,
    tipo: row.tipo,
    marca: row.marca || '',
    modelo: row.modelo || '',
    año: row.año ? Number(row.año) : null,
    numeroSerie: row.numeroSerie || ''
  }),
  
  repuesto: (row) => ({
    nombre: row.nombre,
    codigo: row.codigo,
    descripcion: row.descripcion || '',
    precio: row.precio ? Number(row.precio) : 0,
    stock: row.stock ? Number(row.stock) : 0,
    categoria: row.categoria || '',
    proveedor: row.proveedor || ''
  }),
  
  proveedor: (row) => ({
    nombre: row.nombre,
    cuit: row.cuit || '',
    telefono: row.telefono || '',
    email: row.email,
    direccion: row.direccion || '',
    web: row.web || '',
    productos: row.productos || ''
  }),
  
  reparacion: (row) => ({
    fecha: row.fecha,
    maquinariaId: Number(row.maquinariaId),
    descripcion: row.descripcion || '',
    userId: Number(row.userId),
    estado: row.estado || 'pendiente',
    prioridad: row.prioridad || 'media',
    costo: row.costo ? Number(row.costo) : 0,
    duracionEstimada: row.duracionEstimada ? Number(row.duracionEstimada) : 0,
    repuestos: []
  })
};
