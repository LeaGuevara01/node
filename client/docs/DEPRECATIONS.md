# Deprecations manifest (frontend)

Este archivo documenta archivos legacy/demos que no se usan en runtime y que fueron excluidos del build mediante tsconfig.json.

Motivo: reducir ruido, evitar duplicados y acelerar chequeo de tipos/build.

Excluidos:

- src/backup/\*\*
- src/examples/\*\*
- src/scripts/\*\*
- src/components/examples/\*\*
- src/pages/_Old_.jsx
- src/pages/_WithFilters_.jsx
- src/pages/Dashboard.jsx (sustituido por DashboardRefactored)
- src/pages/DashboardModern.jsx (demo)
- src/pages/RepuestosModular.jsx (demo)
- src/pages/MaquinariasPage.jsx (antigua)
- src/pages/MaquinariaForm.jsx (antigua)
- src/pages/MaquinariaFormModular.jsx (demo)
- src/pages/ProveedorDetails_new.jsx (duplicado experimental)
- src/pages/ReparacionDetails_new.jsx (duplicado experimental)
- src/pages/StatsCardDemo.jsx (demo)
- src/pages/StyleExamples.jsx (demo)
- src/main.jsx y src/App.jsx (duplicados; se usa main.tsx + App.tsx)

Si en el futuro se necesita reactivar alguno, remuévelo del exclude y añade pruebas de uso real.
