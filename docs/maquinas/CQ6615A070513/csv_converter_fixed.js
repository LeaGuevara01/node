#!/usr/bin/env node

/**
 * Conversor Completo: Texto Crudo → Documentación Tabular → CSV para Importación
 * 
 * Este script implementa el flujo triangular completo:
 * 1. Parsea texto crudo de archivos ST*.md
 * 2. Genera documentación en formato tabular (markdown)
 * 3. Exporta CSV optimizado para importación a base de datos
 * 4. Mantiene compatibilidad bidireccional
 */

const fs = require('fs');
const path = require('path');

class CSVConverter {
    constructor(directorioBase = null) {
        // Usar el directorio actual si no se especifica
        this.directorioBase = directorioBase || __dirname;
        this.resultados = [];
        this.estadisticas = {
            archivosProcesados: 0,
            totalComponentes: 0,
            errores: []
        };
    }

    /**
     * Parsea texto crudo de un archivo ST*.md
     * @param {string} filePath - Ruta del archivo
     * @returns {Array} Array de objetos con datos estructurados
     */
    parsearTextoCrudo(filePath) {
        const contenido = fs.readFileSync(filePath, 'utf-8');
        const lineas = contenido.split('\n').map(l => l.trim()).filter(l => l);
        
        const componentes = [];
        let componenteActual = null;
        let numeroSecuencial = 1;

        for (let i = 0; i < lineas.length; i++) {
            const linea = lineas[i];

            // Detectar inicio de nuevo componente
            if (linea.match(/^\d+\s*-\s*$/)) {
                if (componenteActual) {
                    componentes.push(componenteActual);
                }
                componenteActual = {
                    numero: numeroSecuencial++,
                    descripcion: '',
                    codigo: '',
                    cantidad: '',
                    modelos: '',
                    observaciones: '',
                    archivoOrigen: path.basename(filePath)
                };
                continue;
            }

            // Extraer descripción
            if (componenteActual && !componenteActual.descripcion && !linea.includes('Número de parte')) {
                componenteActual.descripcion = linea.replace(/^-\s*/, '').trim();
                continue;
            }

            // Extraer número de parte
            if (linea.includes('Número de parte')) {
                const match = linea.match(/Número de parte\s*(.+)/i);
                if (match && componenteActual) {
                    componenteActual.codigo = match[1].trim();
                }
            }

            // Extraer cantidad
            if (linea.includes('Cant. necesaria')) {
                const match = linea.match(/Cant\. necesaria\s*(\d+)/i);
                if (match && componenteActual) {
                    componenteActual.cantidad = match[1].trim();
                }
            }

            // Extraer modelos compatibles
            if (linea.includes('Modelos compatibles')) {
                const match = linea.match(/Modelos compatibles\s*(.+)/i);
                if (match && componenteActual) {
                    componenteActual.modelos = match[1].trim();
                }
            }

            // Extraer observaciones
            if (linea.includes('Observaciones')) {
                const match = linea.match(/Observaciones(.+)/i);
                if (match && componenteActual) {
                    componenteActual.observaciones = match[1].trim();
                }
            }
        }

        if (componenteActual) {
            componentes.push(componenteActual);
        }

        return componentes;
    }

    /**
     * Genera documentación en formato tabular markdown
     * @param {Array} componentes - Array de componentes
     * @param {string} titulo - Título de la sección
     * @returns {string} Contenido markdown
     */
    generarDocumentacionTabular(componentes, titulo) {
        let markdown = `## ${titulo}\n\n`;
        markdown += '| Nº | Descripción | Código | Cantidad | Modelos | Observaciones |\n';
        markdown += '|---|---|---|---|---|---|\n';
        
        componentes.forEach(comp => {
            markdown += `| ${comp.numero} | ${comp.descripcion} | ${comp.codigo} | ${comp.cantidad || '1'} | ${comp.modelos || 'N/A'} | ${comp.observaciones || '-'} |\n`;
        });
        
        markdown += '\n---\n\n';
        return markdown;
    }

    /**
     * Genera CSV optimizado para importación a base de datos
     * @param {Array} componentes - Array de componentes
     * @returns {string} Contenido CSV
     */
    generarCSV(componentes) {
        const headers = ['numero', 'descripcion', 'codigo', 'cantidad', 'modelos', 'observaciones', 'archivo_origen'];
        let csv = headers.join(',') + '\n';
        
        componentes.forEach(comp => {
            const fila = [
                comp.numero,
                `"${comp.descripcion.replace(/"/g, '""')}"`,
                `"${comp.codigo.replace(/"/g, '""')}"`,
                comp.cantidad || '1',
                `"${(comp.modelos || 'N/A').replace(/"/g, '""')}"`,
                `"${(comp.observaciones || '').replace(/"/g, '""')}"`,
                `"${comp.archivoOrigen}"`
            ];
            csv += fila.join(',') + '\n';
        });
        
        return csv;
    }

    /**
     * Procesa todos los archivos ST*.md en el directorio
     * @returns {Object} Resultados del procesamiento
     */
    procesarTodos() {
        console.log(`📁 Buscando archivos en: ${this.directorioBase}`);
        
        const archivos = fs.readdirSync(this.directorioBase)
            .filter(file => file.startsWith('ST') && file.endsWith('.md'));
        
        console.log(`📊 Encontrados ${archivos.length} archivos ST*.md`);
        
        const todosLosComponentes = [];
        const resultadosPorArchivo = {};
        
        archivos.forEach(archivo => {
            const filePath = path.join(this.directorioBase, archivo);
            try {
                const componentes = this.parsearTextoCrudo(filePath);
                resultadosPorArchivo[archivo] = componentes;
                todosLosComponentes.push(...componentes);
                
                this.estadisticas.archivosProcesados++;
                this.estadisticas.totalComponentes += componentes.length;
                
                console.log(`✅ ${archivo}: ${componentes.length} componentes extraídos`);
            } catch (error) {
                this.estadisticas.errores.push(`${archivo}: ${error.message}`);
                console.error(`❌ Error en ${archivo}:`, error.message);
            }
        });
        
        return {
            porArchivo: resultadosPorArchivo,
            consolidado: todosLosComponentes
        };
    }

    /**
     * Genera todos los archivos necesarios para el flujo triangular
     */
    generarFlujoCompleto() {
        console.log('🚀 Iniciando flujo triangular de conversión...\n');
        
        const resultados = this.procesarTodos();
        
        // 1. Generar documentación tabular por archivo
        console.log('\n📄 Generando documentación tabular...');
        Object.keys(resultados.porArchivo).forEach(archivo => {
            const componentes = resultados.porArchivo[archivo];
            if (componentes.length > 0) {
                const titulo = archivo.replace('.md', '');
                const contenidoTabular = this.generarDocumentacionTabular(componentes, titulo);
                
                const outputPath = path.join(this.directorioBase, `${archivo.replace('.md', '_tabular.md')}`);
                fs.writeFileSync(outputPath, contenidoTabular, 'utf-8');
                console.log(`   📋 ${archivo.replace('.md', '_tabular.md')} generado (${componentes.length} componentes)`);
            }
        });
        
        // 2. Generar documentación consolidada
        const contenidoConsolidado = this.generarDocumentacionConsolidada(resultados.consolidado);
        const consolidadoPath = path.join(this.directorioBase, 'documentacion_consolidada.md');
        fs.writeFileSync(consolidadoPath, contenidoConsolidado, 'utf-8');
        console.log(`   📊 documentacion_consolidada.md generado (${resultados.consolidado.length} componentes totales)`);
        
        // 3. Generar CSV para importación
        const csvContent = this.generarCSV(resultados.consolidado);
        const csvPath = path.join(this.directorioBase, 'componentes_importacion.csv');
        fs.writeFileSync(csvPath, csvContent, 'utf-8');
        console.log(`   📈 componentes_importacion.csv generado (${resultados.consolidado.length} registros)`);
        
            // 3b. Generar CSV en formato masivo esperado
            if (typeof convertirComponentesParaImportacionMasiva === 'function') {
                const csvMasivo = convertirComponentesParaImportacionMasiva(resultados.consolidado);
                const csvMasivoPath = path.join(this.directorioBase, 'componentes_importacion_masiva.csv');
                fs.writeFileSync(csvMasivoPath, csvMasivo, 'utf-8');
                console.log(`   📊 componentes_importacion_masiva.csv generado (${resultados.consolidado.length} registros)`);
            }
        
        // 4. Generar resumen JSON para referencia
        const resumenJSON = {
            estadisticas: this.estadisticas,
            totalComponentes: resultados.consolidado.length,
            archivosProcesados: Object.keys(resultados.porArchivo),
            fechaGeneracion: new Date().toISOString()
        };
        
        const jsonPath = path.join(this.directorioBase, 'resumen_conversion.json');
        fs.writeFileSync(jsonPath, JSON.stringify(resumenJSON, null, 2), 'utf-8');
        console.log(`   📊 resumen_conversion.json generado`);
        
        return {
            archivosTabulares: Object.keys(resultados.porArchivo).filter(f => resultados.porArchivo[f].length > 0).map(f => f.replace('.md', '_tabular.md')),
            documentacionConsolidada: 'documentacion_consolidada.md',
            csvImportacion: 'componentes_importacion.csv',
            resumenJSON: 'resumen_conversion.json',
            estadisticas: this.estadisticas
        };
    }

    /**
     * Genera documentación consolidada con todas las tablas
     */
    generarDocumentacionConsolidada(componentes) {
        let contenido = `# DOCUMENTACIÓN CONSOLIDADA - COMPONENTES TRACTOR JOHN DEERE 6615J\n\n`;
        contenido += `**PIN:** CQ6615A070513  \n`;
        contenido += `**Fecha de generación:** ${new Date().toLocaleDateString('es-ES')}  \n`;
        contenido += `**Total de componentes:** ${componentes.length}  \n\n`;
        
        contenido += `## RESUMEN POR ARCHIVO\n\n`;
        
        // Agrupar por archivo de origen
        const porArchivo = {};
        componentes.forEach(comp => {
            if (!porArchivo[comp.archivoOrigen]) {
                porArchivo[comp.archivoOrigen] = [];
            }
            porArchivo[comp.archivoOrigen].push(comp);
        });
        
        Object.keys(porArchivo).sort().forEach(archivo => {
            const componentesArchivo = porArchivo[archivo];
            contenido += this.generarDocumentacionTabular(componentesArchivo, archivo.replace('.md', ''));
        });
        
        contenido += `## NOTAS DE IMPORTACIÓN\n\n`;
        contenido += `- **Formato CSV:** Los datos están disponibles en \`componentes_importacion.csv\`\n`;
        contenido += `- **Columnas:** numero, descripcion, codigo, cantidad, modelos, observaciones, archivo_origen\n`;
        contenido += `- **Codificación:** UTF-8 con comillas para campos con comas\n`;
        contenido += `- **Separador:** Coma (,) estándar CSV\n`;
        contenido += `- **Total registros:** ${componentes.length}\n\n`;
        
        return contenido;
    }

    /**
     * Función principal para ejecutar el flujo completo
     */
    ejecutar() {
        console.log('🔄 FLUJO TRIANGULAR DE CONVERSIÓN\n');
        console.log('=================================\n');
        
        const resultados = this.generarFlujoCompleto();
        
        console.log('\n✅ FLUJO COMPLETADO EXITOSAMENTE\n');
        console.log('================================\n');
        console.log(`📊 Estadísticas:`);
        console.log(`   • Archivos procesados: ${resultados.estadisticas.archivosProcesados}`);
        console.log(`   • Total componentes: ${resultados.estadisticas.totalComponentes}`);
        console.log(`   • Errores: ${resultados.estadisticas.errores.length}`);
        
        console.log('\n📁 Archivos generados:');
        console.log(`   • ${resultados.archivosTabulares.length} archivos tabulares individuales`);
        console.log(`   • ${resultados.documentacionConsolidada}`);
        console.log(`   • ${resultados.csvImportacion}`);
        console.log(`   • ${resultados.resumenJSON}`);
        
        if (resultados.estadisticas.errores.length > 0) {
            console.log('\n⚠️  Errores encontrados:');
            resultados.estadisticas.errores.forEach(error => console.log(`   • ${error}`));
        }
        
        return resultados;
    }
}

// Función principal exportable
function convertirParaImportacion(directorio = null) {
    const converter = new CSVConverter(directorio);
    return converter.ejecutar();
}

// Nueva función para convertir componentes a CSV para importación masiva
function convertirComponentesParaImportacionMasiva(componentes) {
    const headers = ['nombre', 'stock', 'categoria', 'ubicacion', 'codigo', 'descripcion'];
    let csv = headers.join(',') + '\n';

    componentes.forEach(comp => {
        // Inferir categoría
        let categoria = '';
        const desc = (comp.descripcion || '').toLowerCase();
        if (desc.includes('tornillo')) categoria = 'Tornillo';
        else if (desc.includes('tuerca')) categoria = 'Tuerca';
        else if (desc.includes('arandela')) categoria = 'Arandela';
        else if (desc.includes('manguera')) categoria = 'Manguera';
        else if (desc.includes('abrazadera')) categoria = 'Abrazadera';
        else if (desc.includes('espárrago')) categoria = 'Espárrago';
        else if (desc.includes('soporte')) categoria = 'Soporte';
        else if (desc.includes('correa')) categoria = 'Correa';
        else if (desc.includes('retendedor')) categoria = 'Retenedor';
        else if (desc.includes('radiador')) categoria = 'Radiador';
        else if (desc.includes('filtro')) categoria = 'Filtro';
        else if (desc.includes('polea')) categoria = 'Polea';
        else if (desc.includes('ventilador')) categoria = 'Ventilador';
        else if (desc.includes('tapón')) categoria = 'Tapón';
        else if (desc.includes('aislante')) categoria = 'Aislante';
        else if (desc.includes('banda')) categoria = 'Banda';
        else if (desc.includes('apoyo')) categoria = 'Apoyo';
        else if (desc.includes('cabeza')) categoria = 'Cabeza';
        else if (desc.includes('espaciador')) categoria = 'Espaciador';
        else if (desc.includes('rodamiento')) categoria = 'Rodamiento';
        else if (desc.includes('anillo')) categoria = 'Anillo';
        else if (desc.includes('cubo')) categoria = 'Cubo';
        else if (desc.includes('tensor')) categoria = 'Tensor';
        else if (desc.includes('rueda')) categoria = 'Rueda';
        else if (desc.includes('tapa')) categoria = 'Tapa';
        else if (desc.includes('coraza')) categoria = 'Coraza';
        else if (desc.includes('tapadera')) categoria = 'Tapadera';
        else if (desc.includes('refrigerador')) categoria = 'Refrigerador';
        else categoria = 'Componente';

        // Ubicación: solo el valor de modelos, sin prefijo
        let ubicacion = comp.modelos ? comp.modelos : (comp.archivo_origen || '');

        csv += [
            `"${comp.descripcion.replace(/"/g, '""')}"`,
            comp.cantidad || '1',
            `"${categoria}"`,
            `"${ubicacion}"`,
            `"${comp.codigo.replace(/"/g, '""')}"`,
            `"${comp.observaciones.replace(/"/g, '""') || ''}"`
        ].join(',') + '\n';
    });

    return csv;
}

// Exportar para uso como módulo
module.exports = {
    CSVConverter,
    convertirParaImportacion
};

// Si se ejecuta directamente
if (require.main === module) {
    convertirParaImportacion();
}
