# Guía de Documentación y Comentariado

Estilo: profesional, cercano, sintético. Prioriza la claridad sobre la exhaustividad.

## Principios

- Escribe para quien mantiene el código dentro de 6 meses.
- Comenta el "por qué" y las decisiones; evita narrar lo obvio.
- Sé consistente: mismo tono, mismas secciones, mismos nombres.

## Convenciones de comentarios

- Encabezado de archivo (opcional cuando el propósito no sea obvio):
  // Módulo: Proveedor Controller
  // Rol: endpoints CRUD y utilidades de búsqueda
  // Contrato: entradas/salidas, errores relevantes, efectos colaterales

- Bloques de función: usa JSDoc breve cuando la firma no es evidente o hay edge cases.
  /\*\*

  - Crea un proveedor.
  - @param {Request} req body: { nombre, cuit?, ... }
  - @param {Response} res 201 proveedor | 400 error validación
  - Casos límite: nombre obligatorio, productos opcional []
    \*/

- Comentarios en línea: máximo 1 línea; explica intención, no el código.
  // Normalizamos string/coma en array para OR flexible

## Estructura en READMEs

- Qué es (1-2 líneas)
- Cómo correr (copiable)
- Config mínima (.env)
- Endpoints/URLs claves
- Troubleshooting frecuente
- Enlaces a docs extendidas

## Nombres y tono

- Evita jerga innecesaria. Usa verbos claros: obtener, crear, actualizar, eliminar.
- Mensajes de error consistentes y útiles.

## Ejemplos

- Client: componentes compartidos incluyen ejemplo de uso mínimo.
- Server: rutas documentan método, path y auth requerida.

## Checklist antes de merge

- [ ] README actualizado si cambió el uso
- [ ] Comentarios de intención en funciones complejas
- [ ] Errores y respuestas documentadas en controladores
- [ ] Variables de entorno listadas en docs
