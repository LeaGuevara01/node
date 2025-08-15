/**
 * Script de migración para refactorizar páginas al nuevo sistema de navegación
 *
 * Este script ayuda a migrar páginas existentes para usar:
 * - AppLayout en lugar de layouts manuales
 * - NavigationButtons en lugar de botones personalizados
 * - Contexto de navegación en lugar de useNavigate directo
 */

const fs = require('fs');
const path = require('path');

// Configuración de la migración
const PAGES_DIR = path.join(__dirname, '../pages');
const BACKUP_DIR = path.join(__dirname, '../pages/backup');

// Patrones de reemplazo
const REPLACEMENTS = [
  // Importaciones
  {
    pattern: /import \{ useNavigate \} from 'react-router-dom';/g,
    replacement: "import { useNavigation } from '../hooks/useNavigation';",
  },

  // Hook usage
  {
    pattern: /const navigate = useNavigate\(\);/g,
    replacement:
      'const { navigateToListPage, navigateToDetailPage, navigateToFormPage, goBack } = useNavigation();',
  },

  // Navegación a listas
  {
    pattern: /navigate\(['"`]\/(\w+)['"`]\)/g,
    replacement: "navigateToListPage('$1')",
  },

  // Navegación a detalles
  {
    pattern: /navigate\(['"`]\/(\w+)\/\$\{([^}]+)\}['"`]\)/g,
    replacement: "navigateToDetailPage('$1', $2)",
  },

  // Botones de volver
  {
    pattern: /navigate\(-1\)/g,
    replacement: 'goBack()',
  },
];

// Plantilla base para páginas migradas
const PAGE_TEMPLATE = `
/**
 * PÁGINA MIGRADA AL NUEVO SISTEMA DE NAVEGACIÓN
 * 
 * Esta página ha sido refactorizada para usar:
 * - AppLayout para layout consistente
 * - NavigationButtons para botones estándar
 * - Contexto de navegación para manejo de rutas
 */

import AppLayout from '../components/navigation/AppLayout';
import { CreateButton, BackButton, EditButton, DeleteButton } from '../components/navigation/NavigationButtons';
import { useNavigation } from '../hooks/useNavigation';

// ... resto de imports existentes ...

function {{PAGE_NAME}}({{ props }}) {
  // Usar el nuevo hook de navegación
  const { navigateToListPage, navigateToDetailPage, navigateToFormPage } = useNavigation();
  
  // ... resto del código existente ...
  
  // Definir breadcrumbs para la página
  const breadcrumbs = [
    { label: 'Inicio', href: '/' },
    { label: '{{SECTION_NAME}}', href: '/{{SECTION_ROUTE}}' },
    // Agregar más breadcrumbs según sea necesario
  ];
  
  // Definir acciones de la página
  const pageActions = (
    <div className="flex items-center space-x-3">
      <CreateButton entity="{{ENTITY}}" />
      {/* Agregar más acciones según sea necesario */}
    </div>
  );
  
  return (
    <AppLayout
      currentSection="{{SECTION}}"
      breadcrumbs={breadcrumbs}
      title="{{PAGE_TITLE}}"
      subtitle="{{PAGE_SUBTITLE}}"
      actions={pageActions}
      token={token}
      role={role}
      onLogout={onLogout}
    >
      {/* Contenido existente de la página */}
      {{EXISTING_CONTENT}}
    </AppLayout>
  );
}

export default {{PAGE_NAME}};
`;

/**
 * Crear backup de archivo antes de modificar
 */
function createBackup(filePath) {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const fileName = path.basename(filePath);
  const backupPath = path.join(BACKUP_DIR, `${fileName}.backup`);

  fs.copyFileSync(filePath, backupPath);
  console.log(`✅ Backup created: ${backupPath}`);
}

/**
 * Aplicar reemplazos automáticos a un archivo
 */
function applyReplacements(content) {
  let modifiedContent = content;

  REPLACEMENTS.forEach(({ pattern, replacement }) => {
    modifiedContent = modifiedContent.replace(pattern, replacement);
  });

  return modifiedContent;
}

/**
 * Analizar archivo para detectar qué necesita migración
 */
function analyzeFile(content, fileName) {
  const analysis = {
    needsMigration: false,
    hasUseNavigate: false,
    hasManualLayout: false,
    hasCustomButtons: false,
    suggestions: [],
  };

  // Detectar uso de useNavigate
  if (content.includes('useNavigate')) {
    analysis.hasUseNavigate = true;
    analysis.needsMigration = true;
    analysis.suggestions.push('Reemplazar useNavigate con useNavigation context');
  }

  // Detectar layouts manuales
  if (content.includes('min-h-screen') || content.includes('sidebar')) {
    analysis.hasManualLayout = true;
    analysis.needsMigration = true;
    analysis.suggestions.push('Usar AppLayout en lugar de layout manual');
  }

  // Detectar botones personalizados
  if (content.includes('onClick={() => navigate(') || content.includes('navigate(-1)')) {
    analysis.hasCustomButtons = true;
    analysis.needsMigration = true;
    analysis.suggestions.push('Usar NavigationButtons en lugar de botones personalizados');
  }

  return analysis;
}

/**
 * Migrar un archivo específico
 */
function migrateFile(filePath) {
  try {
    console.log(`\n🔄 Migrando: ${filePath}`);

    // Leer contenido actual
    const content = fs.readFileSync(filePath, 'utf8');

    // Analizar archivo
    const analysis = analyzeFile(content, path.basename(filePath));

    if (!analysis.needsMigration) {
      console.log('ℹ️  Archivo no requiere migración');
      return;
    }

    console.log('📋 Análisis:', analysis);

    // Crear backup
    createBackup(filePath);

    // Aplicar reemplazos automáticos
    let migratedContent = applyReplacements(content);

    // Agregar comentario de migración
    const migrationComment = `/**
 * MIGRADO AL NUEVO SISTEMA DE NAVEGACIÓN
 * Fecha: ${new Date().toISOString()}
 * 
 * Cambios aplicados:
${analysis.suggestions.map((s) => ` * - ${s}`).join('\n')}
 */\n\n`;

    migratedContent = migrationComment + migratedContent;

    // Guardar archivo migrado
    fs.writeFileSync(filePath, migratedContent);

    console.log('✅ Migración completada');
    console.log('⚠️  NOTA: Revisar manualmente y completar la migración a AppLayout');
  } catch (error) {
    console.error(`❌ Error migrando ${filePath}:`, error.message);
  }
}

/**
 * Migrar todas las páginas
 */
function migrateAllPages() {
  console.log('🚀 Iniciando migración de navegación...\n');

  if (!fs.existsSync(PAGES_DIR)) {
    console.error(`❌ Directorio de páginas no encontrado: ${PAGES_DIR}`);
    return;
  }

  // Obtener todos los archivos .jsx del directorio de páginas
  const pageFiles = fs
    .readdirSync(PAGES_DIR)
    .filter((file) => file.endsWith('.jsx') || file.endsWith('.js'))
    .filter((file) => !file.includes('Refactored')) // Skip ya refactorizados
    .map((file) => path.join(PAGES_DIR, file));

  console.log(`📁 Encontrados ${pageFiles.length} archivos para migrar`);

  // Migrar cada archivo
  pageFiles.forEach(migrateFile);

  console.log('\n🎉 Migración completada!');
  console.log('\n📝 Pasos siguientes:');
  console.log('1. Revisar archivos migrados manualmente');
  console.log('2. Completar migración a AppLayout');
  console.log('3. Agregar breadcrumbs apropiados');
  console.log('4. Reemplazar botones personalizados con NavigationButtons');
  console.log('5. Probar funcionalidad');
}

/**
 * Generar guía de migración
 */
function generateMigrationGuide() {
  const guide = `# Guía de Migración de Navegación

## Resumen
Esta guía explica cómo migrar páginas existentes al nuevo sistema de navegación refactorizado.

## Componentes Principales

### AppLayout
Reemplaza el layout manual y proporciona:
- Sidebar consistente
- TopNavBar con acciones
- Breadcrumbs automáticos
- Área de contenido responsivo

\`\`\`jsx
<AppLayout
  currentSection="maquinarias"
  breadcrumbs={breadcrumbs}
  title="Página Title"
  subtitle="Página Subtitle"
  actions={pageActions}
  token={token}
  role={role}
  onLogout={onLogout}
>
  {/* Contenido de la página */}
</AppLayout>
\`\`\`

### NavigationButtons
Botones estándar para navegación:
- \`<CreateButton entity="maquinarias" />\`
- \`<EditButton entity="maquinarias" id={id} />\`
- \`<DeleteButton onClick={handleDelete} />\`
- \`<BackButton />\`
- \`<ViewButton entity="maquinarias" id={id} />\`

### useNavigation Hook
Reemplaza useNavigate con funciones específicas:
- \`navigateToListPage(entity)\`
- \`navigateToDetailPage(entity, id)\`
- \`navigateToFormPage(entity, id?)\`
- \`navigateToDashboard()\`
- \`goBack()\`

## Pasos de Migración

1. **Importar componentes nuevos**
   \`\`\`jsx
   import AppLayout from '../components/navigation/AppLayout';
   import { CreateButton, BackButton } from '../components/navigation/NavigationButtons';
   import { useNavigation } from '../hooks/useNavigation';
   \`\`\`

2. **Reemplazar useNavigate**
   \`\`\`jsx
   // Antes
   const navigate = useNavigate();
   
   // Después
   const { navigateToListPage, navigateToDetailPage } = useNavigation();
   \`\`\`

3. **Envolver contenido con AppLayout**
   \`\`\`jsx
   return (
     <AppLayout {...layoutProps}>
       {/* contenido existente */}
     </AppLayout>
   );
   \`\`\`

4. **Definir breadcrumbs y acciones**
   \`\`\`jsx
   const breadcrumbs = [
     { label: 'Inicio', href: '/' },
     { label: 'Sección' }
   ];
   
   const pageActions = (
     <CreateButton entity="maquinarias" />
   );
   \`\`\`

5. **Reemplazar navegación manual**
   \`\`\`jsx
   // Antes
   navigate('/maquinarias');
   navigate(\`/maquinarias/\${id}\`);
   navigate(-1);
   
   // Después
   navigateToListPage('maquinarias');
   navigateToDetailPage('maquinarias', id);
   goBack();
   \`\`\`

## Verificación

Después de migrar, verificar:
- [ ] Layout se ve consistente
- [ ] Navegación funciona correctamente
- [ ] Breadcrumbs se muestran correctamente
- [ ] Botones tienen estilos consistentes
- [ ] Responsive design funciona
- [ ] Accesibilidad se mantiene

## Ejemplos Completos

Ver archivos de ejemplo:
- \`DashboardRefactored.jsx\`
- \`MaquinariasPageRefactored.jsx\`
- \`MaquinariaDetailsRefactored.jsx\`
`;

  const guidePath = path.join(__dirname, '../docs/MIGRATION_GUIDE.md');
  fs.writeFileSync(guidePath, guide);
  console.log(`📖 Guía de migración generada: ${guidePath}`);
}

// Ejecutar migración si se llama directamente
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--guide')) {
    generateMigrationGuide();
  } else if (args.includes('--analyze')) {
    // Solo analizar sin modificar
    console.log('🔍 Modo análisis - no se modificarán archivos');
  } else {
    migrateAllPages();
  }
}

module.exports = {
  migrateFile,
  migrateAllPages,
  analyzeFile,
  generateMigrationGuide,
};
