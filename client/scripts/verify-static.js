// Verifica que archivos críticos se hayan copiado al build
const fs = require('fs');
const path = require('path');

const dist = path.resolve(__dirname, '..', 'dist');
const pub = path.resolve(__dirname, '..', 'public');
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
  console.log('📂 Dist path:', dist);
  try {
    const distFiles = fs.readdirSync(dist);
    console.log('📄 Archivos en dist:', distFiles.join(', '));
  } catch (e) {
    console.error('No se pudo leer dist:', e.message);
  }

  // Intentar fallback copiando desde public si existen allá
  const recovered = [];
  for (const f of missing) {
    const src = path.join(pub, f);
    const dest = path.join(dist, f);
    if (fs.existsSync(src)) {
      try {
        fs.copyFileSync(src, dest);
        recovered.push(f);
      } catch (e) {
        console.warn('No se pudo copiar fallback para', f, e.message);
      }
    }
  }
  if (recovered.length) {
    console.log('🛠️  Recuperados vía fallback:', recovered.join(', '));
    missing = missing.filter(m => !recovered.includes(m));
  }
  if (missing.length) {
    console.error('❌ Archivos críticos aún faltan tras fallback:', missing.join(', '));
    process.exit(1);
  }
}

// Validar manifest JSON básico
try {
  const manifestRaw = fs.readFileSync(path.join(dist, 'site.webmanifest'), 'utf8');
  JSON.parse(manifestRaw);
} catch (e) {
  console.warn('⚠️ site.webmanifest no es JSON válido:', e.message);
}

console.log('✅ Verificación estática OK.');
