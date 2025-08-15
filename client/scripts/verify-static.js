// Verifica que archivos críticos se hayan copiado al build
const fs = require('fs');
const path = require('path');

const dist = path.resolve(__dirname, '..', 'dist');
const requiredFiles = [
  'index.html',
  'site.webmanifest',
  'favicon.svg'
];

let missing = [];
for (const f of requiredFiles) {
  const p = path.join(dist, f);
  if (!fs.existsSync(p)) missing.push(f);
}

if (missing.length) {
  console.error('❌ Build incompleto. Faltan archivos:', missing.join(', '));
  process.exit(1);
}

// Validar manifest JSON básico
try {
  const manifestRaw = fs.readFileSync(path.join(dist, 'site.webmanifest'), 'utf8');
  JSON.parse(manifestRaw);
} catch (e) {
  console.warn('⚠️ site.webmanifest no es JSON válido:', e.message);
}

console.log('✅ Verificación estática OK.');
