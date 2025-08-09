#!/usr/bin/env node

/**
 * Script de Migración Automática: StyledComponents → Sistema Modular
 * 
 * Este script ayuda a migrar del sistema deprecado de styledComponents
 * al nuevo sistema de componentes modulares.
 */

const fs = require('fs');
const path = require('path');

const CLIENT_SRC = path.join(__dirname, '..', 'src');
const BACKUP_DIR = path.join(__dirname, '..', 'migration-backups');

// Mapeos de migración
const MIGRATION_MAP = {
  'StyledPageWrapper': {
    replacement: 'AppLayout',
    import: "import AppLayout from '../components/navigation/AppLayout';",
    note: 'Requiere props adicionales: token, role, onLogout, currentSection'
  },
  'StyledForm': {
    replacement: 'FormLayout',
    import: "import { FormLayout } from '../styles';",
    note: 'Manejo manual de Alert y LoadingState requerido'
  },
  'StyledList': {
    replacement: 'UniversalList + ListLayout',
    import: "import { UniversalList, ListLayout } from '../styles';",
    note: 'Separar renderizado de lista del layout'
  },
  'StyledDashboard': {
    replacement: 'PageContainer + StatsGrid',
    import: "import { PageContainer, StatsGrid } from '../styles';",
    note: 'Composición manual de dashboard requerida'
  },
  'withStyledPage': {
    replacement: 'AppLayout directo',
    import: "import AppLayout from '../components/navigation/AppLayout';",
    note: 'Eliminar HOC, usar AppLayout directamente'
  },
  'useStyledPage': {
    replacement: 'AppLayout + PageContainer',
    import: "import { PageContainer } from '../styles';",
    note: 'Hook no necesario con nuevo sistema'
  }
};

// Patrones de detección
const DEPRECATED_PATTERNS = [
  /import\s+{[^}]*StyledPageWrapper[^}]*}\s+from\s+['"'][^'"]*styledComponents['"']/g,
  /import\s+{[^}]*StyledForm[^}]*}\s+from\s+['"'][^'"]*styledComponents['"']/g,
  /import\s+{[^}]*StyledList[^}]*}\s+from\s+['"'][^'"]*styledComponents['"']/g,
  /import\s+{[^}]*StyledDashboard[^}]*}\s+from\s+['"'][^'"]*styledComponents['"']/g,
  /import\s+{[^}]*withStyledPage[^}]*}\s+from\s+['"'][^'"]*styledComponents['"']/g,
  /import\s+{[^}]*useStyledPage[^}]*}\s+from\s+['"'][^'"]*styledComponents['"']/g,
  /<StyledPageWrapper/g,
  /<StyledForm/g,
  /<StyledList/g,
  /<StyledDashboard/g,
  /withStyledPage\(/g,
  /useStyledPage\(/g
];

function crearBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log(`📁 Directorio de backup creado: ${BACKUP_DIR}`);
  }
}

function crearBackup(filePath, content) {
  const relativePath = path.relative(CLIENT_SRC, filePath);
  const backupPath = path.join(BACKUP_DIR, relativePath);
  const backupDir = path.dirname(backupPath);
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  fs.writeFileSync(backupPath, content);
  return backupPath;
}

function analizarArchivo(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const usos = [];
    
    // Detectar componentes deprecados
    Object.keys(MIGRATION_MAP).forEach(component => {
      if (content.includes(component)) {
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          if (line.includes(component)) {
            usos.push({
              componente: component,
              linea: index + 1,
              contenido: line.trim(),
              migracion: MIGRATION_MAP[component]
            });
          }
        });
      }
    });
    
    return usos;
  } catch (error) {
    console.error(`❌ Error analizando ${filePath}:`, error.message);
    return [];
  }
}

function escanearDirectorio(dir) {
  const resultados = [];
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && entry.name !== 'node_modules') {
        resultados.push(...escanearDirectorio(fullPath));
      } else if (entry.name.endsWith('.jsx') || entry.name.endsWith('.js')) {
        const usos = analizarArchivo(fullPath);
        if (usos.length > 0) {
          resultados.push({
            archivo: path.relative(CLIENT_SRC, fullPath),
            usos: usos
          });
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error escaneando directorio ${dir}:`, error.message);
  }
  
  return resultados;
}

function generarSugerenciasMigracion(resultados) {
  console.log('\n📋 PLAN DE MIGRACIÓN SUGERIDO:\n');
  
  let totalArchivos = 0;
  let totalComponentes = 0;
  
  resultados.forEach(resultado => {
    totalArchivos++;
    console.log(`📄 ${resultado.archivo}:`);
    
    resultado.usos.forEach(uso => {
      totalComponentes++;
      console.log(`   Línea ${uso.linea}: ${uso.componente}`);
      console.log(`   ❌ ANTES: ${uso.contenido}`);
      console.log(`   ✅ MIGRAR A: ${uso.migracion.replacement}`);
      console.log(`   📥 IMPORT: ${uso.migracion.import}`);
      console.log(`   💡 NOTA: ${uso.migracion.note}`);
      console.log('');
    });
    
    console.log('');
  });
  
  return { totalArchivos, totalComponentes };
}

function generarEjemploMigracion(componenteDeprecado, archivo) {
  const ejemplos = {
    'StyledPageWrapper': `
// ❌ ANTES:
import { StyledPageWrapper } from '../styles/styledComponents';

function ${archivo.replace('.jsx', '')}() {
  return (
    <StyledPageWrapper title="Mi Página" loading={loading}>
      <div>Contenido...</div>
    </StyledPageWrapper>
  );
}

// ✅ DESPUÉS:
import AppLayout from '../components/navigation/AppLayout';
import { PageContainer } from '../styles';

function ${archivo.replace('.jsx', '')}({ token, role, onLogout }) {
  return (
    <AppLayout
      title="Mi Página"
      token={token}
      role={role}
      onLogout={onLogout}
      currentSection="mi-seccion"
    >
      <PageContainer>
        <div>Contenido...</div>
      </PageContainer>
    </AppLayout>
  );
}`,

    'StyledForm': `
// ❌ ANTES:
import { StyledForm } from '../styles/styledComponents';

// ✅ DESPUÉS:
import { FormLayout, Alert, LoadingState } from '../styles';

function MiFormulario() {
  return (
    <FormLayout title="Mi Formulario">
      {error && <Alert type="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        {/* campos */}
        {loading && <LoadingState />}
      </form>
    </FormLayout>
  );
}`,

    'StyledList': `
// ❌ ANTES:
import { StyledList } from '../styles/styledComponents';

// ✅ DESPUÉS:
import { UniversalList, ListLayout } from '../styles';

function MiLista() {
  return (
    <ListLayout title="Mi Lista">
      <UniversalList
        data={items}
        renderItem={(item) => <div>{item.name}</div>}
        loading={loading}
      />
    </ListLayout>
  );
}`
  };
  
  return ejemplos[componenteDeprecado] || '// Ver documentación para ejemplos específicos';
}

function crearReporteMigracion(resultados, stats) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportePath = path.join(BACKUP_DIR, `migration-report-${timestamp}.md`);
  
  let reporte = `# 📊 Reporte de Migración - StyledComponents\n\n`;
  reporte += `**Fecha:** ${new Date().toLocaleString()}\n`;
  reporte += `**Archivos afectados:** ${stats.totalArchivos}\n`;
  reporte += `**Componentes deprecados encontrados:** ${stats.totalComponentes}\n\n`;
  
  reporte += `## 📋 Archivos que Requieren Migración\n\n`;
  
  resultados.forEach(resultado => {
    reporte += `### ${resultado.archivo}\n\n`;
    
    resultado.usos.forEach(uso => {
      reporte += `- **Línea ${uso.linea}:** \`${uso.componente}\`\n`;
      reporte += `  - Migrar a: \`${uso.migracion.replacement}\`\n`;
      reporte += `  - Import: \`${uso.migracion.import}\`\n`;
      reporte += `  - Nota: ${uso.migracion.note}\n\n`;
    });
  });
  
  reporte += `\n## 🛠️ Próximos Pasos\n\n`;
  reporte += `1. Revisar cada archivo listado\n`;
  reporte += `2. Aplicar las migraciones sugeridas\n`;
  reporte += `3. Probar funcionalidad después de cada cambio\n`;
  reporte += `4. Eliminar imports no utilizados\n`;
  reporte += `5. Consultar [Guía de Migración](../docs/MIGRATION_STYLED_COMPONENTS.md)\n\n`;
  
  fs.writeFileSync(reportePath, reporte);
  console.log(`📄 Reporte de migración guardado: ${reportePath}`);
  
  return reportePath;
}

function main() {
  console.log('🔄 SCRIPT DE MIGRACIÓN: StyledComponents → Sistema Modular');
  console.log('='.repeat(65));
  
  // Crear directorio de backup
  crearBackupDir();
  
  // Escanear archivos
  console.log('🔍 Escaneando archivos...');
  const resultados = escanearDirectorio(CLIENT_SRC);
  
  if (resultados.length === 0) {
    console.log('✅ ¡Excelente! No se encontraron componentes deprecados.');
    console.log('   Tu aplicación ya está usando el sistema modular.');
    return;
  }
  
  // Generar sugerencias
  const stats = generarSugerenciasMigracion(resultados);
  
  // Crear reporte
  const reportePath = crearReporteMigracion(resultados, stats);
  
  console.log('='.repeat(65));
  console.log('📊 RESUMEN:');
  console.log(`   📁 Archivos afectados: ${stats.totalArchivos}`);
  console.log(`   🔧 Componentes a migrar: ${stats.totalComponentes}`);
  console.log(`   📄 Reporte generado: ${path.basename(reportePath)}`);
  
  console.log('\n🚀 PRÓXIMOS PASOS:');
  console.log('   1. Revisar el reporte generado');
  console.log('   2. Consultar la guía: docs/MIGRATION_STYLED_COMPONENTS.md');
  console.log('   3. Migrar archivos uno por uno');
  console.log('   4. Probar funcionalidad después de cada cambio');
  console.log('   5. Ejecutar este script nuevamente para verificar');
  
  console.log('\n💡 AYUDA:');
  console.log('   - Ejemplos en: src/pages/examples/');
  console.log('   - Playground: src/pages/StyleExamples.jsx');
  console.log('   - Documentación: docs/DESIGN_SYSTEM.md');
}

if (require.main === module) {
  main();
}

module.exports = {
  analizarArchivo,
  escanearDirectorio,
  MIGRATION_MAP,
  DEPRECATED_PATTERNS
};
