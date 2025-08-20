/**
 * Función para convertir archivos .md del estilo ST* al formato listado.md
 * Procesa archivos con formato crudo y los convierte a tablas estructuradas
 */

const fs = require('fs');
const path = require('path');

class ComponenteConverter {
    constructor(directorioBase) {
        this.directorioBase = directorioBase;
        this.resultados = [];
    }

    /**
     * Extrae información de un archivo .md individual
     * @param {string} filePath - Ruta del archivo a procesar
     * @returns {Array} Array de objetos con descripción y código
     */
    extraerInformacion(filePath) {
        const contenido = fs.readFileSync(filePath, 'utf-8');
        const lineas = contenido.split('\n').filter(linea => linea.trim() !== '');
        
        const items = [];
        let itemActual = null;
        
        for (let i = 0; i < lineas.length; i++) {
            const linea = lineas[i].trim();
            
            // Detectar inicio de nuevo item
            if (linea.match(/^\d+\s*-\s*$/)) {
                if (itemActual) {
                    items.push(itemActual);
                }
                itemActual = {
                    descripcion: '',
                    codigo: '',
                    numero: items.length + 1
                };
                continue;
            }
            
            // Extraer descripción (línea después del número)
            if (itemActual && !itemActual.descripcion && !linea.startsWith('Número de parte')) {
                itemActual.descripcion = linea.replace(/^-\s*/, '').trim();
                continue;
            }
            
            // Extraer número de parte
            if (linea.startsWith('Número de parte')) {
                const match = linea.match(/Número de parte(.+)/);
                if (match && itemActual) {
                    itemActual.codigo = match[1].trim();
                }
            }
        }
        
        if (itemActual) {
            items.push(itemActual);
        }
        
        return items;
    }

    /**
     * Formatea los items extraídos al estilo listado.md
     * @param {Array} items - Array de items a formatear
     * @param {string} tituloSeccion - Título de la sección
     * @returns {string} Contenido formateado en markdown
     */
    formatearListado(items, tituloSeccion) {
        let contenido = `## ${tituloSeccion}\n\n`;
        contenido += '| Nº | Descripción | Código |\n';
        contenido += '|---|---|---|\n';
        
        items.forEach(item => {
            contenido += `| ${item.numero} | ${item.descripcion} | ${item.codigo} |\n`;
        });
        
        contenido += '\n---\n\n';
        return contenido;
    }

    /**
     * Procesa todos los archivos ST*.md en el directorio
     * @returns {Object} Objeto con resultados por archivo
     */
    procesarTodos() {
        const archivos = fs.readdirSync(this.directorioBase)
            .filter(file => file.startsWith('ST') && file.endsWith('.md'));
        
        const resultados = {};
        
        archivos.forEach(archivo => {
            const filePath = path.join(this.directorioBase, archivo);
            const items = this.extraerInformacion(filePath);
            resultados[archivo] = items;
        });
        
        return resultados;
    }

    /**
     * Genera un archivo listado.md consolidado
     * @param {Object} resultados - Resultados de procesarTodos()
     * @param {string} outputPath - Ruta del archivo de salida
     */
    generarListadoConsolidado(resultados, outputPath) {
        let contenido = '# RESOLUCIÓN DE EQUIPAMIENTO - TRACTOR JOHN DEERE 6615J\n\n';
        contenido += '**PIN:** CQ6615A070513\n\n';
        contenido += '## INFORMACIÓN GENERAL\n\n';
        contenido += '- **Modelo:** 6615J\n';
        contenido += '- **Número de Serie:** CQ6615A070513\n';
        contenido += '- **Tipo:** Tractor Agrícola\n';
        contenido += '- **Marca:** John Deere\n\n';
        contenido += '---\n\n';
        
        // Agrupar por categorías basadas en los números de ST
        const categorias = this.agruparPorCategorias(resultados);
        
        Object.keys(categorias).forEach(categoria => {
            const items = categorias[categoria];
            contenido += this.formatearListado(items, categoria);
        });
        
        contenido += '## NOTAS IMPORTANTES\n\n';
        contenido += '- **Códigos de repuesto:** Todos los códigos comienzan con "ST" seguido de números únicos\n';
        contenido += '- **Compatibilidad:** Verificar compatibilidad según número de serie del tractor\n';
        contenido += '- **Actualización:** Esta lista corresponde a la configuración estándar del modelo 6615J\n';
        contenido += '- **Consultas:** Para piezas específicas o actualizaciones, consultar con el concesionario John Deere\n\n';
        contenido += '---\n\n';
        contenido += '**Documento generado:** Resolución completa de equipamiento para Tractor John Deere 6615J PIN CQ6615A070513\n';
        
        fs.writeFileSync(outputPath, contenido, 'utf-8');
    }

    /**
     * Agrupa los items por categorías basadas en patrones
     * @param {Object} resultados - Resultados de procesarTodos()
     * @returns {Object} Items agrupados por categoría
     */
    agruparPorCategorias(resultados) {
        const categorias = {
            '30 COMPONENTES AUXILIARES DEL MOTOR, DEPÓSITO, SISTEMA DE ADMISIÓN': [],
            '40 COMPONENTES ELÉCTRICOS': [],
            '52 TRANSMISIÓN SYNCROPLUS': [],
            '54 TRANSMISIÓN POWRQUAD': [],
            '56 TRANSMISIÓN': [],
            '58 TOMA DE FUERZA (PTO)': [],
            '60 DIRECCIÓN Y FRENOS': [],
            '70 COMPONENTES HIDRÁULICOS': [],
            '80 BASTIDOR, EJES DELANTEROS, PIEZAS DE CHAPA, VARIOS': [],
            '92 PLATAFORMA DE CONDUCCIÓN': [],
            '93 MANDOS, ACCESORIOS Y AIRE ACONDICIONADO': [],
            '94 CABLES Y ASIENTO': [],
            '100 MOTOR 4045TJ04-RE538110': [],
            '112 MOTOR 6068TJ14-RE538111': []
        };
        
        // Mapeo simple basado en rangos de números ST
        Object.keys(resultados).forEach(archivo => {
            const numero = parseInt(archivo.replace('ST', '').replace('.md', ''));
            const items = resultados[archivo];
            
            let categoria = '30 COMPONENTES AUXILIARES DEL MOTOR, DEPÓSITO, SISTEMA DE ADMISIÓN';
            
            if (numero >= 350439 && numero <= 350879) categoria = '40 COMPONENTES ELÉCTRICOS';
            else if (numero >= 350880 && numero <= 350895) categoria = '52 TRANSMISIÓN SYNCROPLUS';
            else if (numero >= 350896 && numero <= 350914) categoria = '54 TRANSMISIÓN POWRQUAD';
            else if (numero >= 350915 && numero <= 350942) categoria = '56 TRANSMISIÓN';
            else if (numero >= 350943 && numero <= 350948) categoria = '58 TOMA DE FUERZA (PTO)';
            else if (numero >= 351042 && numero <= 351061) categoria = '60 DIRECCIÓN Y FRENOS';
            else if (numero >= 350974 && numero <= 350983) categoria = '70 COMPONENTES HIDRÁULICOS';
            else if (numero >= 351019 && numero <= 351055) categoria = '80 BASTIDOR, EJES DELANTEROS, PIEZAS DE CHAPA, VARIOS';
            else if (numero >= 351058 && numero <= 351084) categoria = '92 PLATAFORMA DE CONDUCCIÓN';
            else if (numero >= 351087 && numero <= 351116) categoria = '93 MANDOS, ACCESORIOS Y AIRE ACONDICIONADO';
            else if (numero >= 351118 && numero <= 351143) categoria = '94 CABLES Y ASIENTO';
            
            items.forEach(item => {
                categorias[categoria].push(item);
            });
        });
        
        return categorias;
    }

    /**
     * Función principal para convertir componentes
     * @param {string} directorio - Directorio con archivos ST*.md
     * @param {string} outputFile - Archivo de salida
     */
    convertirComponente(directorio, outputFile) {
        console.log('Iniciando conversión de componentes...');
        
        const resultados = this.procesarTodos();
        this.generarListadoConsolidado(resultados, outputFile);
        
        console.log(`Conversión completada. Archivo generado: ${outputFile}`);
        console.log(`Archivos procesados: ${Object.keys(resultados).length}`);
        
        return resultados;
    }
}

// Función principal exportable
function convertirComponente(directorio = './docs/maquinas/CQ6615A070513', outputFile = './docs/maquinas/CQ6615A070513/listado_generado.md') {
    const converter = new ComponenteConverter(directorio);
    return converter.convertirComponente(directorio, outputFile);
}

// Exportar para uso como módulo
module.exports = {
    ComponenteConverter,
    convertirComponente
};

// Si se ejecuta directamente
if (require.main === module) {
    convertirComponente();
}
