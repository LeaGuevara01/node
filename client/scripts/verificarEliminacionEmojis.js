#!/usr/bin/env node

/**
 * Script de verificación: Eliminación de emojis en tags de listado
 *
 * Este script verifica que todos los emojis hayan sido reemplazados
 * por iconos apropiados de Lucide React en elementos de UI.
 */

const fs = require('fs');
const path = require('path');

const CLIENT_SRC = path.join(__dirname, '..', 'src');

// Lista de emojis que deberían ser reemplazados
const EMOJIS_A_VERIFICAR = [
  '📅',
  '📍',
  '🏷️',
  '💰',
  '🔧',
  '📦',
  '📊',
  '🚜',
  '⚙️',
  '🌾',
  '⚡',
  '🎯',
  '🔍',
  '💡',
  '✨',
  '🎨',
  '🎪',
  '🎭',
  '🎬',
  '📸',
  '📋',
  '📌',
  '🖐️',
  '🔄',
  '🖱️',
];

// Archivos modificados en esta sesión
const ARCHIVOS_MODIFICADOS = [
  'pages/MaquinariasPageRefactored.jsx',
  'components/BusquedaRapida.jsx',
  'components/Sidebar.jsx',
  'pages/StatsCardDemo.jsx',
  'pages/DashboardModern.jsx',
  'pages/Dashboard.jsx',
  'pages/MaquinariaFormModular.jsx',
  'components/SwipeDemo.jsx',
];

// Mapeo de emojis a iconos implementados
const MAPEO_REALIZADO = {
  '📅': 'Calendar',
  '📍': 'MapPin',
  '🏷️': 'Tag',
  '🌾': 'Wheat',
  '📊': 'BarChart3',
  '🔧': 'Wrench',
  '📦': 'Package',
  '💡': 'Lightbulb',
  '🎯': 'Target',
  '🎨': 'Palette',
  '🚜': 'Tractor',
  '🖐️': 'Hand',
  '🔄': 'RotateCcw',
  '🖱️': 'Monitor',
};

function buscarEmojisEnArchivo(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const emojisEncontrados = [];

    EMOJIS_A_VERIFICAR.forEach((emoji) => {
      if (content.includes(emoji)) {
        // Buscar líneas que contengan el emoji
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          if (line.includes(emoji)) {
            // Excluir comentarios de logs de consola
            if (!line.includes('console.log') && !line.includes('console.error')) {
              emojisEncontrados.push({
                emoji,
                linea: index + 1,
                contenido: line.trim(),
              });
            }
          }
        });
      }
    });

    return emojisEncontrados;
  } catch (error) {
    console.error(`❌ Error leyendo archivo ${filePath}:`, error.message);
    return [];
  }
}

function buscarTodosLosEmojis(dir) {
  const resultados = [];

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        resultados.push(...buscarTodosLosEmojis(fullPath));
      } else if (entry.name.endsWith('.jsx') || entry.name.endsWith('.js')) {
        const emojis = buscarEmojisEnArchivo(fullPath);
        if (emojis.length > 0) {
          resultados.push({
            archivo: path.relative(CLIENT_SRC, fullPath),
            emojis,
          });
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error escaneando directorio ${dir}:`, error.message);
  }

  return resultados;
}

function verificarArchivosModificados() {
  console.log('🔍 VERIFICANDO ARCHIVOS MODIFICADOS...\n');

  let cambiosCompletados = 0;

  ARCHIVOS_MODIFICADOS.forEach((archivo) => {
    const fullPath = path.join(CLIENT_SRC, archivo);

    if (fs.existsSync(fullPath)) {
      const emojis = buscarEmojisEnArchivo(fullPath);

      if (emojis.length === 0) {
        console.log(`✅ ${archivo} - Sin emojis en UI`);
        cambiosCompletados++;
      } else {
        console.log(`⚠️  ${archivo} - Emojis restantes:`);
        emojis.forEach((item) => {
          console.log(`   Línea ${item.linea}: ${item.contenido}`);
        });
      }
    } else {
      console.log(`❓ ${archivo} - Archivo no encontrado`);
    }
  });

  console.log(
    `\n📊 RESUMEN: ${cambiosCompletados}/${ARCHIVOS_MODIFICADOS.length} archivos completados`
  );
  return cambiosCompletados === ARCHIVOS_MODIFICADOS.length;
}

function mostrarMapeoImplementado() {
  console.log('\n🎨 MAPEO EMOJI → ICONO IMPLEMENTADO:\n');

  Object.entries(MAPEO_REALIZADO).forEach(([emoji, icono]) => {
    console.log(`${emoji} → <${icono}>`);
  });

  console.log(`\n✨ Total: ${Object.keys(MAPEO_REALIZADO).length} emojis reemplazados`);
}

function main() {
  console.log('🧹 VERIFICACIÓN: ELIMINACIÓN DE EMOJIS EN TAGS DE LISTADO');
  console.log('='.repeat(60));

  // Verificar archivos modificados específicamente
  const todosCompletados = verificarArchivosModificados();

  // Mostrar mapeo implementado
  mostrarMapeoImplementado();

  // Buscar emojis restantes en toda la aplicación
  console.log('\n🔎 ESCANEANDO APLICACIÓN COMPLETA...\n');
  const resultados = buscarTodosLosEmojis(CLIENT_SRC);

  if (resultados.length === 0) {
    console.log('✅ No se encontraron emojis de UI en la aplicación');
  } else {
    console.log('⚠️  EMOJIS RESTANTES EN UI:');
    resultados.forEach((resultado) => {
      console.log(`\n📁 ${resultado.archivo}:`);
      resultado.emojis.forEach((item) => {
        console.log(`   Línea ${item.linea}: ${item.contenido}`);
      });
    });
  }

  console.log('\n' + '='.repeat(60));

  if (todosCompletados && resultados.length === 0) {
    console.log('✅ TODAS LAS TAREAS COMPLETADAS EXITOSAMENTE');
    console.log('✅ Todos los emojis en tags de listado han sido reemplazados');
    console.log('✅ La aplicación ahora usa iconos consistentes de Lucide React');
  } else {
    console.log('⚠️  HAY TRABAJO PENDIENTE');
    console.log(`   - Archivos modificados: ${todosCompletados ? 'Completado' : 'Pendiente'}`);
    console.log(
      `   - Emojis restantes: ${resultados.length === 0 ? 'Ninguno' : resultados.length + ' archivos'}`
    );
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  buscarEmojisEnArchivo,
  buscarTodosLosEmojis,
  EMOJIS_A_VERIFICAR,
  MAPEO_REALIZADO,
};
