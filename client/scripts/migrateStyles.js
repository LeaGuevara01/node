#!/usr/bin/env node

/**
 * Script de Aplicación Masiva de Estilos Modulares
 * 
 * Este script automatiza la aplicación del sistema de estilos modulares
 * a todas las páginas de la aplicación.
 */

const fs = require('fs');
const path = require('path');

// Configuración
const CONFIG = {
  pagesDirectory: './src/pages',
  backupDirectory: './src/pages_backup',
  stylesDirectory: './src/styles',
  excludeFiles: [
    'StyleExamples.jsx',
    'StatsCardDemo.jsx',
    'DashboardModern.jsx',
    'MaquinariaFormModular.jsx'
  ],
  dryRun: false // Cambiar a true para solo mostrar lo que haría
};

// Patrones de detección y reemplazo
const PATTERNS = {
  // Detectar componentes que necesitan migración
  needsMigration: [
    /className="min-h-screen bg-gray-50"/,
    /className="pl-12 md:pl-60"/,
    /className="bg-white.*?rounded.*?shadow/,
    /className="px-4 py-4"/
  ],
  
  // Imports necesarios
  requiredImports: `import {
  StyledPageWrapper,
  ContentSection,
  PageHeader,
  LoadingState,
  Alert,
  ResponsiveGrid,
  usePageState
} from '../styles';`,
  
  // Plantillas de migración
  templates: {
    simpleWrapper: (title, content) => `
<StyledPageWrapper
  title="${title}"
  subtitle="Página migrada al sistema modular"
>
  ${content}
</StyledPageWrapper>`,
    
    formWrapper: (title, content) => `
<StyledPageWrapper
  title="${title}"
  subtitle="Formulario con estilos modulares"
>
  <ContentSection>
    ${content}
  </ContentSection>
</StyledPageWrapper>`,
    
    listWrapper: (title, content) => `
<StyledPageWrapper
  title="${title}"
  subtitle="Lista con estilos modulares"
>
  ${content}
</StyledPageWrapper>`
  }
};

/**
 * Detecta si un archivo necesita migración
 */
function needsMigration(fileContent) {
  return PATTERNS.needsMigration.some(pattern => pattern.test(fileContent));
}

/**
 * Detecta el tipo de componente
 */
function detectComponentType(fileContent) {
  if (fileContent.includes('onSubmit') && fileContent.includes('<form')) {
    return 'form';
  }
  if (fileContent.includes('.map(') && fileContent.includes('key=')) {
    return 'list';
  }
  if (fileContent.includes('useState') && fileContent.includes('useEffect')) {
    return 'interactive';
  }
  return 'simple';
}

/**
 * Extrae el título del componente
 */
function extractTitle(fileContent, fileName) {
  // Buscar en h1, h2, o title prop
  const titleMatches = [
    /<h1[^>]*>([^<]+)<\/h1>/,
    /<h2[^>]*>([^<]+)<\/h2>/,
    /title[\"']?\s*:\s*[\"']([^\"']+)[\"']/,
    /title={[\"']([^\"']+)[\"']}/
  ];
  
  for (const pattern of titleMatches) {
    const match = fileContent.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  // Fallback: usar nombre del archivo
  return fileName.replace(/Form|Page|Details|\.jsx$/g, '').trim();
}

/**
 * Migra un archivo individual
 */
function migrateFile(filePath) {
  console.log(`\n📄 Procesando: ${filePath}`);
  
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath, '.jsx');
  
  // Verificar si necesita migración
  if (!needsMigration(fileContent)) {
    console.log(`   ✅ Ya tiene estilos modulares o no necesita migración`);
    return { success: true, skipped: true };
  }
  
  try {
    let migratedContent = fileContent;
    
    // 1. Agregar imports si no existen
    if (!migratedContent.includes("from '../styles'")) {
      migratedContent = migratedContent.replace(
        /(import React[^;]*;)/,
        `$1\n${PATTERNS.requiredImports}`
      );
      console.log(`   📦 Imports agregados`);
    }
    
    // 2. Detectar tipo y título
    const componentType = detectComponentType(migratedContent);
    const title = extractTitle(migratedContent, fileName);
    
    console.log(`   🔍 Tipo detectado: ${componentType}`);
    console.log(`   📝 Título extraído: ${title}`);
    
    // 3. Envolver el componente
    const template = PATTERNS.templates[`${componentType}Wrapper`] || PATTERNS.templates.simpleWrapper;
    
    // Buscar el return statement principal
    const returnMatch = migratedContent.match(/return\s*\(([\s\S]*?)\);?\s*}/);
    if (returnMatch) {
      const originalContent = returnMatch[1].trim();
      const wrappedContent = template(title, originalContent);
      
      migratedContent = migratedContent.replace(
        returnMatch[0],
        `return (${wrappedContent}\n  );\n}`
      );
      
      console.log(`   🔄 Contenido envuelto con ${componentType}Wrapper`);
    }
    
    // 4. Limpiar clases CSS duplicadas
    const cleanupPatterns = [
      [/className="min-h-screen bg-gray-50[^"]*"/g, ''],
      [/className="pl-12 md:pl-60[^"]*"/g, ''],
      [/className="px-4 py-4[^"]*"/g, '']
    ];
    
    cleanupPatterns.forEach(([pattern, replacement]) => {
      if (pattern.test(migratedContent)) {
        migratedContent = migratedContent.replace(pattern, replacement);
        console.log(`   🧹 Clases CSS limpiadas`);
      }
    });
    
    // 5. Escribir archivo migrado
    if (!CONFIG.dryRun) {
      fs.writeFileSync(filePath, migratedContent, 'utf8');
      console.log(`   💾 Archivo migrado exitosamente`);
    } else {
      console.log(`   👀 [DRY RUN] Cambios que se aplicarían:`);
      console.log(`      - Agregar imports modulares`);
      console.log(`      - Envolver con ${componentType}Wrapper`);
      console.log(`      - Limpiar clases CSS obsoletas`);
    }
    
    return { 
      success: true, 
      type: componentType, 
      title: title,
      changes: ['imports', 'wrapper', 'cleanup']
    };
    
  } catch (error) {
    console.error(`   ❌ Error migrando archivo: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Crea backup de archivos
 */
function createBackup() {
  if (!fs.existsSync(CONFIG.backupDirectory)) {
    fs.mkdirSync(CONFIG.backupDirectory, { recursive: true });
  }
  
  const files = fs.readdirSync(CONFIG.pagesDirectory);
  files.forEach(file => {
    if (file.endsWith('.jsx')) {
      const srcPath = path.join(CONFIG.pagesDirectory, file);
      const backupPath = path.join(CONFIG.backupDirectory, file);
      fs.copyFileSync(srcPath, backupPath);
    }
  });
  
  console.log(`📂 Backup creado en: ${CONFIG.backupDirectory}`);
}

/**
 * Restaura archivos desde backup
 */
function restoreBackup() {
  if (!fs.existsSync(CONFIG.backupDirectory)) {
    console.error('❌ No existe directorio de backup');
    return;
  }
  
  const files = fs.readdirSync(CONFIG.backupDirectory);
  files.forEach(file => {
    const backupPath = path.join(CONFIG.backupDirectory, file);
    const srcPath = path.join(CONFIG.pagesDirectory, file);
    fs.copyFileSync(backupPath, srcPath);
  });
  
  console.log('🔄 Archivos restaurados desde backup');
}

/**
 * Función principal
 */
function main() {
  console.log('🚀 Iniciando aplicación masiva de estilos modulares\n');
  
  // Verificar directorios
  if (!fs.existsSync(CONFIG.pagesDirectory)) {
    console.error(`❌ Directorio de páginas no encontrado: ${CONFIG.pagesDirectory}`);
    return;
  }
  
  // Crear backup antes de comenzar
  if (!CONFIG.dryRun) {
    createBackup();
  }
  
  // Obtener lista de archivos
  const files = fs.readdirSync(CONFIG.pagesDirectory)
    .filter(file => file.endsWith('.jsx'))
    .filter(file => !CONFIG.excludeFiles.includes(file))
    .map(file => path.join(CONFIG.pagesDirectory, file));
  
  console.log(`📋 Archivos a procesar: ${files.length}`);
  console.log(`🚫 Archivos excluidos: ${CONFIG.excludeFiles.join(', ')}\n`);
  
  // Procesar archivos
  const results = {
    processed: 0,
    migrated: 0,
    skipped: 0,
    errors: 0,
    details: []
  };
  
  files.forEach(filePath => {
    const result = migrateFile(filePath);
    results.processed++;
    
    if (result.success) {
      if (result.skipped) {
        results.skipped++;
      } else {
        results.migrated++;
      }
    } else {
      results.errors++;
    }
    
    results.details.push({
      file: path.basename(filePath),
      ...result
    });
  });
  
  // Resumen final
  console.log('\n📊 RESUMEN DE MIGRACIÓN');
  console.log('========================');
  console.log(`📄 Archivos procesados: ${results.processed}`);
  console.log(`✅ Archivos migrados: ${results.migrated}`);
  console.log(`⏭️  Archivos omitidos: ${results.skipped}`);
  console.log(`❌ Errores: ${results.errors}`);
  
  if (results.migrated > 0) {
    console.log('\n🎉 Migración completada exitosamente!');
    console.log('📝 Próximos pasos:');
    console.log('   1. Revisar los archivos migrados');
    console.log('   2. Probar la aplicación');
    console.log('   3. Ajustar estilos específicos si es necesario');
    
    if (!CONFIG.dryRun) {
      console.log(`   4. Eliminar backup si todo funciona: rm -rf ${CONFIG.backupDirectory}`);
    }
  }
  
  if (results.errors > 0) {
    console.log('\n⚠️  Se encontraron errores. Revisar archivos manualmente.');
    if (!CONFIG.dryRun) {
      console.log(`📂 Para restaurar backup: node migrateStyles.js --restore`);
    }
  }
}

// Manejar argumentos de línea de comandos
const args = process.argv.slice(2);

if (args.includes('--restore')) {
  restoreBackup();
} else if (args.includes('--dry-run')) {
  CONFIG.dryRun = true;
  console.log('👀 Modo DRY RUN activado - no se realizarán cambios\n');
  main();
} else if (args.includes('--help')) {
  console.log(`
Aplicación Masiva de Estilos Modulares

Uso:
  node migrateStyles.js [opciones]

Opciones:
  --dry-run    Mostrar cambios sin aplicarlos
  --restore    Restaurar archivos desde backup
  --help       Mostrar esta ayuda

Ejemplos:
  node migrateStyles.js --dry-run   # Ver qué cambios se harían
  node migrateStyles.js             # Aplicar migración
  node migrateStyles.js --restore   # Restaurar backup
`);
} else {
  main();
}

module.exports = {
  migrateFile,
  needsMigration,
  detectComponentType,
  extractTitle,
  createBackup,
  restoreBackup
};
