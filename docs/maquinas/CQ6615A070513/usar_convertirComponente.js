#!/usr/bin/env node

/**
 * Script de uso para la función convertirComponente
 * Ejemplo práctico de cómo usar la función para convertir archivos ST*.md
 */

const fs = require('fs');
const path = require('path');

// Función simple convertirComponente
function convertirComponente(directorioEntrada, directorioSalida) {
    console.log('=== CONVERTIR COMPONENTE - IMPORTACIÓN MASIVA ===\n');
    
    // Verificar directorio
    if (!fs.existsSync(directorioEntrada)) {
        console.error(`Error: El directorio ${directorioEntrada} no existe`);
        return null;
    }
    
    // Buscar archivos ST*.md
    const archivos = fs.readdirSync(directorioEntrada)
        .filter(file => file.startsWith('ST') && file.endsWith('.md'));
    
    if (archivos.length === 0) {
        console.error('Error: No se encontraron archivos ST*.md');
        return null;
    }
    
    console.log(`Encontrados ${archivos.length} archivos para procesar`);
    
    // Procesar cada archivo
    const resultados = [];
    
    archivos.forEach(archivo => {
        const rutaArchivo = path.join(directorioEntrada, archivo);
        const contenido = fs.readFileSync(rutaArchivo, 'utf-8');
        
        // Parsear el formato: n° 'Nombre';'Codigo';'Cantidad';'Compatibilidad';'Disponibilidad'
        const lineas = contenido.split('\n').map(l => l.trim()).filter(l => l);
        
        const items = [];
        let itemActual = null;
        
        for (let i = 0; i < lineas.length; i++) {
            const linea = lineas[i];
            
            // Detectar inicio de item
            if (linea.match(/^\d+\s*-\s*$/)) {
                if (itemActual) items.push(itemActual);
                itemActual = { numero: items.length + 1, descripcion: '', codigo: '' };
                continue;
            }
            
            // Extraer descripción
            if (itemActual && !itemActual.descripcion && !linea.includes('Número de parte')) {
                itemActual.descripcion = linea.replace(/^-\s*/, '').trim();
                continue;
            }
            
            // Extraer código (número de parte)
            if (linea.includes('Número de parte')) {
                const match = linea.match(/Número de parte(.+)/i);
                if (match && itemActual) {
                    itemActual.codigo = match[1].trim();
                }
            }
        }
        
        if (itemActual) items.push(itemActual);
        
        // Formatear al estilo listado.md
        const contenidoFormateado = items.map(item => 
            `${item.numero};'${item.descripcion}';'${item.codigo}';1;'';''`
        ).join('\n');
        
        resultados.push({
            archivo,
            items: items.length,
            contenido: contenidoFormateado
        });
        
        console.log(`${archivo}: ${items.length} items procesados`);
    });
    
    // Generar archivo consolidado
    const archivoConsolidado = path.join(directorioSalida || directorioEntrada, 'componentes_convertidos.md');
    let contenidoFinal = '# Componentes Convertidos - Importación Masiva\n\n';
    
    resultados.forEach(resultado => {
        contenidoFinal += `## ${resultado.archivo}\n\n`;
        contenidoFinal += '| Nº | Descripción | Código |\n|---|---|---|\n';
        
        const lineas = resultado.contenido.split('\n');
        lineas.forEach(linea => {
            if (linea.trim()) {
                const partes = linea.split(';');
                contenidoFinal += `| ${partes[0]} | ${partes[1].replace(/'/g, '')} | ${partes[2].replace(/'/g, '')} |\n`;
            }
        });
        
        contenidoFinal += '\n---\n\n';
    });
    
    fs.writeFileSync(archivoConsolidado, contenidoFinal, 'utf-8');
    
    console.log(`\n=== RESULTADO ===`);
    console.log(`Archivos procesados: ${resultados.length}`);
    console.log(`Total items: ${resultados.reduce((sum, r) => sum + r.items, 0)}`);
    console.log(`Archivo generado: ${archivoConsolidado}`);
    
    return {
        archivosProcesados: resultados.length,
        totalItems: resultados.reduce((sum, r) => sum + r.items, 0),
        archivoSalida: archivoConsolidado,
        detalles: resultados
    };
}

// Ejemplo de uso
if (require.main === module) {
    const directorio = __dirname; // Usar directorio actual
    const resultado = convertirComponente(directorio);
    
    if (resultado) {
        console.log('\n✅ Conversión completada exitosamente');
    }
}

// Exportar la función
module.exports = { convertirComponente };
