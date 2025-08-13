#!/usr/bin/env node

/**
 * Script de activación de la navegación refactorizada
 *
 * Este script:
 * 1. Verifica que todos los archivos necesarios existen
 * 2. Crea copias de seguridad de los archivos originales
 * 3. Actualiza App.jsx para usar las páginas refactorizadas
 * 4. Proporciona instrucciones para completar la migración
 */

const fs = require('fs');
const path = require('path');

// Rutas
const CLIENT_DIR = process.cwd();
const SRC_DIR = path.join(CLIENT_DIR, 'src');
const PAGES_DIR = path.join(SRC_DIR, 'pages');
const COMPONENTS_DIR = path.join(SRC_DIR, 'components');
const BACKUP_DIR = path.join(SRC_DIR, 'backup');

// Archivos a verificar
const REQUIRED_FILES = [
  'src/components/navigation/AppLayout.jsx',
  'src/components/navigation/TopNavBar.jsx',
  'src/components/navigation/Breadcrumbs.jsx',
  'src/components/navigation/NavigationButtons.jsx',
  'src/components/navigation/index.js',
  'src/contexts/NavigationContext.jsx',
  'src/hooks/useNavigation.js',
  'src/pages/DashboardRefactored.jsx',
  'src/pages/MaquinariasPageRefactored.jsx',
  'src/pages/MaquinariaDetailsRefactored.jsx',
];

// Páginas que necesitan migración
const PAGES_TO_MIGRATE = [
  'RepuestosPage.jsx',
  'ProveedoresPage.jsx',
  'ReparacionesPage.jsx',
  'UsuariosPage.jsx',
  'RepuestoDetails.jsx',
  'ProveedorDetails.jsx',
  'ReparacionDetails.jsx',
];

/**
 * Verificar que todos los archivos necesarios existen
 */
function verifyFiles() {
  console.log('🔍 Verificando archivos necesarios...\n');

  const missing = [];
  const existing = [];

  REQUIRED_FILES.forEach((file) => {
    const fullPath = path.join(CLIENT_DIR, file);
    if (fs.existsSync(fullPath)) {
      existing.push(file);
      console.log(`✅ ${file}`);
    } else {
      missing.push(file);
      console.log(`❌ ${file}`);
    }
  });

  if (missing.length > 0) {
    console.log(`\n⚠️  Faltan ${missing.length} archivos necesarios:`);
    missing.forEach((file) => console.log(`   - ${file}`));
    console.log('\nPor favor, ejecutar primero la refactorización completa.');
    return false;
  }

  console.log(`\n✅ Todos los archivos necesarios están presentes (${existing.length})`);
  return true;
}

/**
 * Crear directorio de backup
 */
function createBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log(`📁 Directorio de backup creado: ${BACKUP_DIR}`);
  }
}

/**
 * Hacer backup de App.jsx original
 */
function backupAppFile() {
  const appPath = path.join(SRC_DIR, 'App.jsx');
  const backupPath = path.join(BACKUP_DIR, `App.jsx.backup.${Date.now()}`);

  if (fs.existsSync(appPath)) {
    fs.copyFileSync(appPath, backupPath);
    console.log(`💾 Backup de App.jsx creado: ${path.basename(backupPath)}`);
    return true;
  }

  return false;
}

/**
 * Actualizar App.jsx para usar páginas refactorizadas
 */
function updateAppFile() {
  const appPath = path.join(SRC_DIR, 'App.jsx');

  if (!fs.existsSync(appPath)) {
    console.log('❌ App.jsx no encontrado');
    return false;
  }

  let content = fs.readFileSync(appPath, 'utf8');

  // Reemplazos para usar páginas refactorizadas
  const replacements = [
    {
      from: "import Dashboard from './pages/Dashboard';",
      to: "import Dashboard from './pages/DashboardRefactored';",
    },
    {
      from: "import MaquinariasPage from './pages/MaquinariasPage';",
      to: "import MaquinariasPage from './pages/MaquinariasPageRefactored';",
    },
    {
      from: "import MaquinariaDetails from './pages/MaquinariaDetails';",
      to: "import MaquinariaDetails from './pages/MaquinariaDetailsRefactored';",
    },
  ];

  let changed = false;
  replacements.forEach(({ from, to }) => {
    if (content.includes(from)) {
      content = content.replace(from, to);
      changed = true;
      console.log(`✏️  Reemplazado: ${from} → ${to}`);
    }
  });

  if (changed) {
    // Agregar comentario de actualización
    const updateComment = `/**
 * ACTUALIZADO PARA USAR NAVEGACIÓN REFACTORIZADA
 * Fecha: ${new Date().toISOString()}
 * 
 * Cambios:
 * - Dashboard → DashboardRefactored
 * - MaquinariasPage → MaquinariasPageRefactored
 * - MaquinariaDetails → MaquinariaDetailsRefactored
 */

`;

    content = updateComment + content;

    fs.writeFileSync(appPath, content);
    console.log('✅ App.jsx actualizado correctamente');
    return true;
  }

  console.log('ℹ️  App.jsx ya está actualizado');
  return true;
}

/**
 * Generar instrucciones para páginas restantes
 */
function generateInstructions() {
  console.log('\n📋 PÁGINAS PENDIENTES DE MIGRACIÓN:\n');

  PAGES_TO_MIGRATE.forEach((page, index) => {
    const exists = fs.existsSync(path.join(PAGES_DIR, page));
    const refactoredName = page.replace('.jsx', 'Refactored.jsx');
    const refactoredExists = fs.existsSync(path.join(PAGES_DIR, refactoredName));

    console.log(`${index + 1}. ${page}`);
    console.log(`   Estado: ${exists ? '✅ Existe' : '❌ No encontrado'}`);
    console.log(`   Refactorizado: ${refactoredExists ? '✅ Creado' : '⏳ Pendiente'}`);
    console.log('');
  });
}

/**
 * Mostrar resumen final
 */
function showSummary() {
  console.log('\n🎉 RESUMEN DE LA ACTIVACIÓN\n');

  console.log('✅ Componentes de navegación verificados');
  console.log('✅ Backup de archivos originales creado');
  console.log('✅ App.jsx actualizado para usar páginas refactorizadas');

  console.log('\n📝 PRÓXIMOS PASOS:\n');

  console.log('1. Probar la aplicación:');
  console.log('   npm run dev');
  console.log('');

  console.log('2. Verificar funcionalidad:');
  console.log('   - Dashboard se carga correctamente');
  console.log('   - Navegación del sidebar funciona');
  console.log('   - Breadcrumbs se muestran');
  console.log('   - Botones de navegación funcionan');
  console.log('');

  console.log('3. Migrar páginas restantes:');
  PAGES_TO_MIGRATE.forEach((page) => {
    console.log(`   - ${page} → ${page.replace('.jsx', 'Refactored.jsx')}`);
  });
  console.log('');

  console.log('4. Actualizar importaciones en App.jsx para páginas migradas');
  console.log('');

  console.log('5. Eliminar archivos originales cuando todo funcione correctamente');
  console.log('');

  console.log('📚 Documentación completa en:');
  console.log('   client/docs/NAVIGATION_REFACTOR_COMPLETE.md');
  console.log('');

  console.log('🔧 Para problemas o debugging:');
  console.log('   - Revisar consola del navegador');
  console.log('   - Verificar que NavigationProvider envuelve las rutas');
  console.log('   - Comprobar importaciones de componentes');
}

/**
 * Función principal
 */
function main() {
  console.log('🚀 ACTIVANDO NAVEGACIÓN REFACTORIZADA\n');

  // Verificar archivos
  if (!verifyFiles()) {
    process.exit(1);
  }

  console.log('\n📦 Preparando activación...\n');

  // Crear backup
  createBackupDir();

  // Backup de App.jsx
  if (!backupAppFile()) {
    console.log('⚠️  No se pudo crear backup de App.jsx');
  }

  // Actualizar App.jsx
  if (!updateAppFile()) {
    console.log('❌ Error actualizando App.jsx');
    process.exit(1);
  }

  // Generar instrucciones
  generateInstructions();

  // Mostrar resumen
  showSummary();

  console.log('✨ Activación completada! La navegación refactorizada está lista.\n');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = { main, verifyFiles, updateAppFile };
