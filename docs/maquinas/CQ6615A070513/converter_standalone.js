#!/usr/bin/env node

/**
 * Conversor de archivos ST*.md al formato listado.md
 * Procesa archivos con formato crudo y los convierte a tablas estructuradas
 */

const fs = require('fs');
const path = require('path');

class ConversorST {
    constructor() {
        this.directorio = __dirname;
    }

    /**
     * Extrae información de un archivo ST*.md
     */
    extraerDeArchivo(rutaArchivo) {
        const contenido = fs.readFileSync(rutaArchivo, 'utf-8');
        const lineas = contenido.split('\n').map(l => l.trim()).filter(l => l);
        
        const items = [];
        let itemActual = null;
        
        for (let i = 0; i < lineas.length; i++) {
            const linea = lineas[i];
            
            // Detectar inicio de item (número seguido de guión)
            if (linea.match(/^\d+\s*-\s*$/)) {
                if (itemActual) {
                    items.push(itemActual);
                }
                itemActual = {
                    descripcion: '',
                    codigo: '',
                    cantidad: '',
                    modelos: ''
                };
                continue;
            }
            
            // Extraer descripción (primera línea después del número)
            if (itemActual && !itemActual.descripcion && !linea.includes('Número de parte')) {
                itemActual.descripcion = linea.replace(/^-\s*/, '').trim();
                continue;
            }
            
            // Extraer número de parte
            if (linea.includes('Número de parte')) {
                const match = linea.match(/Número de parte(.+)/i);
                if (match && itemActual) {
                    itemActual.codigo = match[1].trim();
                }
            }
            
            // Extraer cantidad
            if (linea.includes('Cant. necesaria')) {
                const match = linea.match(/Cant\. necesaria(.+)/i);
                if (match && itemActual) {
                    itemActual.cantidad = match[1].trim();
                }
            }
            
            // Extraer modelos compatibles
            if (linea.includes('Modelos compatibles')) {
                const match = linea.match(/Modelos compatibles(.+)/i);
                if (match && itemActual) {
                    itemActual.modelos = match[1].trim();
                }
            }
        }
        
        if (itemActual) {
            items.push(itemActual);
        }
        
        return items;
    }

    /**
     * Procesa todos los archivos ST*.md en el directorio
     */
    procesarArchivos() {
        const archivos = fs.readdirSync(this.directorio)
            .filter(file => file.startsWith('ST') && file.endsWith('.md'));
        
        console.log(`Encontrados ${archivos.length} archivos ST*.md`);
        
        const resultados = {};
        
        archivos.forEach(archivo => {
            const ruta = path.join(this.directorio, archivo);
            try {
                const items = this.extraerDeArchivo(ruta);
                resultados[archivo] = items;
                console.log(`${archivo}: ${items.length} items encontrados`);
            } catch (error) {
                console.error(`Error procesando ${archivo}:`, error.message);
            }
        });
        
        return resultados;
    }

    /**
     * Genera tabla markdown para un conjunto de items
     */
    generarTablaMarkdown(items, titulo) {
        let markdown = `## ${titulo}\n\n`;
        markdown += '| Nº | Descripción | Código | Cantidad | Modelos |\n';
        markdown += '|---|---|---|---|---|\n';
        
        items.forEach((item, index) => {
            markdown += `| ${index + 1} | ${item.descripcion} | ${item.codigo} | ${item.cantidad} | ${item.modelos} |\n`;
        });
        
        markdown += '\n---\n\n';
        return markdown;
    }

    /**
     * Genera archivo consolidado
     */
    generarArchivoConsolidado(resultados) {
        let contenido = `# RESOLUCIÓN DE EQUIPAMIENTO - TRACTOR JOHN DEERE 6615J\n\n`;
        contenido += `**PIN:** CQ6615A070513\n\n`;
        contenido += `## INFORMACIÓN GENERAL\n\n`;
        contenido += `- **Modelo:** 6615J\n`;
        contenido += `- **Número de Serie:** CQ6615A070513\n`;
        contenido += `- **Tipo:** Tractor Agrícola\n`;
        contenido += `- **Marca:** John Deere\n\n`;
        contenido += `---\n\n`;
        
        // Procesar archivos en orden numérico
        const archivosOrdenados = Object.keys(resultados).sort();
        
        archivosOrdenados.forEach(archivo => {
            const items = resultados[archivo];
            if (items.length > 0) {
                const titulo = archivo.replace('.md', '');
                contenido += this.generarTablaMarkdown(items, titulo);
            }
        });
        
        contenido += `## NOTAS IMPORTANTES\n\n`;
        contenido += `- **Códigos de repuesto:** Todos los códigos comienzan con "ST" seguido de números únicos\n`;
        contenido += `- **Compatibilidad:** Verificar compatibilidad según número de serie del tractor\n`;
        contenido += `- **Actualización:** Esta lista corresponde a la configuración estándar del modelo 6615J\n`;
        contenido += `- **Consultas:** Para piezas específicas o actualizaciones, consultar con el concesionario John Deere\n\n`;
        contenido += `---\n\n`;
        contenido += `**Documento generado:** Resolución completa de equipamiento para Tractor John Deere 6615J PIN CQ6615A070513\n`;
        
        const outputPath = path.join(this.directorio, 'listado_convertido.md');
        fs.writeFileSync(outputPath, contenido, 'utf-8');
        
        console.log(`Archivo generado: ${outputPath}`);
        return outputPath;
    }

    /**
     * Función principal de conversión
     */
    convertir() {
        console.log('=== INICIANDO CONVERSIÓN DE COMPONENTES ===\n');
        
        const resultados = this.procesarArchivos();
        const archivoGenerado = this.generarArchivoConsolidado(resultados);
        
        console.log('\n=== RESUMEN ===');
        console.log(`Total de archivos procesados: ${Object.keys(resultados).length}`);
        
        let totalItems = 0;
        Object.values(resultados).forEach(items => {
            totalItems += items.length;
        });
        console.log(`Total de items encontrados: ${totalItems}`);
        console.log(`Archivo generado: ${archivoGenerado}`);
        
        return {
            archivosProcesados: Object.keys(resultados).length,
            totalItems,
            archivoSalida: archivoGenerado,
            resultados
        };
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    const conversor = new ConversorST();
    conversor.convertir();
}

// Exportar para uso como módulo
module.exports = ConversorST;
