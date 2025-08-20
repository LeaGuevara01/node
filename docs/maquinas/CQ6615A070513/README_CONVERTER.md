# Conversor de Componentes ST*.md a Formato Listado.md

## Descripción

Esta herramienta convierte archivos `.md` en formato crudo (estilo ST*) al formato estructurado de `listado.md` para facilitar la importación masiva de componentes.

## Formatos

### Formato Fuente (ST*.md)

```markdown
1 -
Aislante
Número de parteAL81949
Cant. necesaria4
Modelos compatibles6615
Seleccione el concesionario para ver precios y disponibilidad
Cantidad
4
Agregar al carro
```

### Formato Destino (listado.md)

```markdown
| Nº | Descripción | Código |
|---|---|---|
| 1 | Aislante | AL81949 |
```

## Archivos Incluidos

1. **convertirComponente.js** - Conversor completo con categorización
2. **converter_standalone.js** - Versión independiente con más detalles
3. **usar_convertirComponente.js** - Script simple de uso directo

## Uso

### Método 1: Conversión Simple

```bash
node usar_convertirComponente.js
```

### Método 2: Conversión Completa

```bash
node convertirComponente.js
```

### Método 3: Uso como Módulo

```javascript
const { convertirComponente } = require('./usar_convertirComponente');

const resultado = convertirComponente(
    './docs/maquinas/CQ6615A070513',
    './docs/maquinas/CQ6615A070513'
);

console.log(`Procesados: ${resultado.archivosProcesados} archivos`);
console.log(`Total items: ${resultado.totalItems}`);
```

## Salida

Los archivos generados incluyen:

- `componentes_convertidos.md` - Tabla consolidada
- `listado_convertido.md` - Versión con categorías

## Estructura de Datos Extraída

Para cada componente se extrae:

- **Nº**: Número secuencial
- **Descripción**: Nombre del componente
- **Código**: Número de parte
- **Cantidad**: Cantidad necesaria
- **Modelos**: Modelos compatibles

## Ejemplo de Uso Práctico

```javascript
// Importar la función
const { convertirComponente } = require('./usar_convertirComponente');

// Procesar directorio completo
const resultado = convertirComponente(
    'ruta/al/directorio/ST',
    'ruta/al/directorio/salida'
);

// Resultado incluye:
// {
//   archivosProcesados: 32,
//   totalItems: 156,
//   archivoSalida: '.../componentes_convertidos.md',
//   detalles: [...]
// }
```

## Notas Importantes

- Los códigos de repuesto comienzan con "ST" seguido de números únicos
- Verificar compatibilidad según número de serie del tractor
- Esta lista corresponde a la configuración estándar del modelo 6615J
- Para piezas específicas, consultar con el concesionario John Deere

## Solución de Problemas

Si encuentra errores:

1. Verificar que los archivos ST*.md existan
2. Comprobar el formato del archivo (debe tener "Número de parte")
3. Ejecutar con permisos de escritura en el directorio
