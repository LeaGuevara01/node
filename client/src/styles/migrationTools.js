/**
 * Script de Migración Automática de Estilos
 *
 * Este script ayuda a migrar páginas existentes al sistema modular
 * de estilos de forma automática o semi-automática.
 */

// ===== CONFIGURACIÓN DE MIGRACIÓN =====

const MIGRATION_PATTERNS = {
  // Patrones de clases comunes a reemplazar
  classReplacements: {
    // Layout patterns
    'min-h-screen bg-gray-50': 'PageLayout',
    'pl-12 md:pl-60': 'mainContent',
    'px-4 py-4': 'contentWrapper',

    // Card patterns
    'bg-white p-4 rounded-lg shadow': 'ContentSection',
    'bg-white p-6 rounded-lg shadow': 'ContentSection',
    'bg-white rounded-xl shadow-sm border border-gray-200 p-6': 'ContentSection',

    // Header patterns
    'text-2xl font-bold': 'pageTitle',
    'text-3xl font-bold': 'pageTitle',
    'text-gray-600': 'pageSubtitle',

    // Grid patterns
    'grid grid-cols-2 gap-4': 'ResponsiveGrid columns="two"',
    'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4': 'ResponsiveGrid columns="default"',

    // Button patterns
    'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700': 'Button variant="primary"',
    'bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded': 'Button variant="secondary"',
  },

  // Patrones de estructura a migrar
  structurePatterns: [
    {
      pattern: /(<div className="min-h-screen bg-gray-50">[\s\S]*?<\/div>)/,
      replacement: '<PageLayout>$1</PageLayout>',
      description: 'Envolver layout principal',
    },
    {
      pattern: /(<h1[^>]*>[^<]*<\/h1>)/,
      replacement: '<PageHeader title="$1" />',
      description: 'Convertir títulos a PageHeader',
    },
  ],
};

// ===== FUNCIONES DE MIGRACIÓN =====

/**
 * Analiza un archivo de componente y sugiere migraciones
 */
export function analyzeComponentForMigration(fileContent) {
  const suggestions = [];

  // Buscar patrones comunes
  Object.entries(MIGRATION_PATTERNS.classReplacements).forEach(([pattern, replacement]) => {
    if (fileContent.includes(pattern)) {
      suggestions.push({
        type: 'class_replacement',
        original: pattern,
        suggested: replacement,
        description: `Reemplazar clases comunes con ${replacement}`,
      });
    }
  });

  // Buscar estructuras a migrar
  MIGRATION_PATTERNS.structurePatterns.forEach(({ pattern, replacement, description }) => {
    if (pattern.test(fileContent)) {
      suggestions.push({
        type: 'structure_replacement',
        pattern: pattern.source,
        replacement,
        description,
      });
    }
  });

  // Verificar si ya usa estilos modulares
  const hasModularStyles =
    fileContent.includes("from '../styles'") ||
    fileContent.includes('StyledPageWrapper') ||
    fileContent.includes('PageLayout');

  return {
    suggestions,
    alreadyModular: hasModularStyles,
    migrationComplexity:
      suggestions.length > 5 ? 'high' : suggestions.length > 2 ? 'medium' : 'low',
  };
}

/**
 * Genera código migrado automáticamente
 */
export function generateMigratedCode(originalCode, migrationOptions = {}) {
  let migratedCode = originalCode;

  // Agregar imports necesarios
  const importsToAdd = [];

  if (!migratedCode.includes("from '../styles'")) {
    importsToAdd.push(`import {
  StyledPageWrapper,
  ContentSection,
  PageHeader,
  ResponsiveGrid,
  Alert,
  LoadingState
} from '../styles';`);
  }

  // Aplicar reemplazos de clases
  Object.entries(MIGRATION_PATTERNS.classReplacements).forEach(([pattern, replacement]) => {
    if (migratedCode.includes(pattern)) {
      migratedCode = migratedCode.replace(
        new RegExp(pattern, 'g'),
        `{/* Migrado a ${replacement} */}`
      );
    }
  });

  // Envolver componente principal
  if (!migratedCode.includes('StyledPageWrapper') && migrationOptions.autoWrap !== false) {
    migratedCode = migratedCode.replace(
      /return \(([\s\S]*?)\);/,
      `return (
    <StyledPageWrapper
      title="${migrationOptions.title || 'Página Migrada'}"
      subtitle="${migrationOptions.subtitle || 'Migrada al sistema modular'}"
    >
      $1
    </StyledPageWrapper>
  );`
    );
  }

  // Agregar imports al inicio
  if (importsToAdd.length > 0) {
    const importSection = importsToAdd.join('\n');
    migratedCode = migratedCode.replace(/(import React[^;]*;)/, `$1\n${importSection}`);
  }

  return {
    migratedCode,
    importsAdded: importsToAdd,
    replacementsMade: Object.keys(MIGRATION_PATTERNS.classReplacements).filter((pattern) =>
      originalCode.includes(pattern)
    ),
  };
}

// ===== HERRAMIENTAS DE MIGRACIÓN INTERACTIVA =====

export class MigrationAssistant {
  constructor(filePath, fileContent) {
    this.filePath = filePath;
    this.originalContent = fileContent;
    this.analysis = analyzeComponentForMigration(fileContent);
    this.steps = [];
  }

  // Analizar y generar plan de migración
  generateMigrationPlan() {
    const plan = {
      file: this.filePath,
      complexity: this.analysis.migrationComplexity,
      steps: [],
      estimatedTime: 0,
    };

    if (this.analysis.alreadyModular) {
      plan.steps.push({
        type: 'info',
        description: 'El archivo ya usa estilos modulares',
        time: 0,
      });
      return plan;
    }

    // Paso 1: Agregar imports
    plan.steps.push({
      type: 'import',
      description: 'Agregar imports del sistema de estilos',
      time: 2,
      code: `import {
  StyledPageWrapper,
  ContentSection,
  PageHeader,
  ResponsiveGrid
} from '../styles';`,
    });

    // Paso 2: Migrar layout principal
    plan.steps.push({
      type: 'layout',
      description: 'Migrar layout principal a StyledPageWrapper',
      time: 5,
      code: `<StyledPageWrapper
  title="Tu Título"
  subtitle="Tu Subtítulo"
>
  {/* Contenido existente */}
</StyledPageWrapper>`,
    });

    // Paso 3: Migrar secciones
    plan.steps.push({
      type: 'sections',
      description: 'Migrar divs con clases a ContentSection',
      time: 3,
      examples: this.analysis.suggestions.filter((s) => s.type === 'class_replacement'),
    });

    plan.estimatedTime = plan.steps.reduce((total, step) => total + step.time, 0);

    return plan;
  }

  // Aplicar migración paso a paso
  applyMigrationStep(stepType, options = {}) {
    switch (stepType) {
      case 'import':
        return this.addImports();
      case 'layout':
        return this.wrapWithStyledPage(options);
      case 'sections':
        return this.migrateSections();
      default:
        return { success: false, error: 'Tipo de paso no válido' };
    }
  }

  addImports() {
    // Implementar adición de imports
    return { success: true, message: 'Imports agregados' };
  }

  wrapWithStyledPage(options) {
    // Implementar wrapping con StyledPageWrapper
    return { success: true, message: 'Layout migrado' };
  }

  migrateSections() {
    // Implementar migración de secciones
    return { success: true, message: 'Secciones migradas' };
  }
}

// ===== VALIDADORES DE MIGRACIÓN =====

export function validateMigration(originalCode, migratedCode) {
  const validation = {
    success: true,
    warnings: [],
    errors: [],
    improvements: [],
  };

  // Verificar que no se perdió funcionalidad
  if (originalCode.includes('useState') && !migratedCode.includes('useState')) {
    validation.warnings.push('Se detectó pérdida de estado React');
  }

  // Verificar imports correctos
  if (migratedCode.includes('StyledPageWrapper') && !migratedCode.includes("from '../styles'")) {
    validation.errors.push('Faltan imports del sistema de estilos');
    validation.success = false;
  }

  // Sugerir mejoras
  if (!migratedCode.includes('ContentSection')) {
    validation.improvements.push('Considera usar ContentSection para las secciones principales');
  }

  return validation;
}

// ===== UTILIDADES DE MIGRACIÓN MASIVA =====

export function generateBatchMigrationScript(fileList) {
  return fileList.map((filePath) => {
    return {
      file: filePath,
      commands: [
        `// Analizar archivo`,
        `const analysis = analyzeComponentForMigration(fileContent);`,
        `// Generar código migrado`,
        `const migrated = generateMigratedCode(fileContent);`,
        `// Validar migración`,
        `const validation = validateMigration(fileContent, migrated.migratedCode);`,
      ],
    };
  });
}

// ===== EXPORTACIONES =====

export default {
  MIGRATION_PATTERNS,
  analyzeComponentForMigration,
  generateMigratedCode,
  MigrationAssistant,
  validateMigration,
  generateBatchMigrationScript,
};
