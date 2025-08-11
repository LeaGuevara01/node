/**
 * FormHeaderActions - Acciones para páginas de formulario/listado con estilo del TopNavBar
 * Responsive:
 * - lg+: Buscar, Exportar, Importar, Nueva + Notifs + Usuario (opcional vía TopNavBar)
 * - md: Buscar, Exportar, Importar, Nueva (sin notifs/usuario; lo controla AppLayout/TopNavBar)
 * - sm: solo iconos de Buscar, Exportar, Importar, Nueva
 */
import React from 'react';
import { Search, FileDown, FileUp, Plus } from 'lucide-react';

const iconBtn = "p-2 sm:px-2 sm:py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors";
const textBtn = "inline-flex items-center px-2 py-2 sm:px-3 sm:py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors";

export default function FormHeaderActions({
  onSearchClick,
  onExport,
  onImport,
  onNew,
  importInputId = 'csv-import-input'
}) {
  return (
    <div className="flex items-center space-x-1 sm:space-x-2">
      {/* Buscar */}
      <button
        onClick={onSearchClick}
        className={`${iconBtn} md:hidden`}
        title="Buscar"
      >
        <Search size={18} className="mr-0 sm:mr-2" />
        <span className="hidden sm:inline">Buscar</span>
      </button>

      {/* Exportar */}
      <button
        onClick={onExport}
        className={`${textBtn}`}
        title="Exportar"
      >
        <FileDown size={18} className="mr-0 sm:mr-2" />
        <span className="hidden sm:inline">Exportar</span>
      </button>

      {/* Importar */}
      <label htmlFor={importInputId} className={`${textBtn} cursor-pointer`} title="Importar">
        <FileUp size={18} className="mr-0 sm:mr-2" />
        <span className="hidden sm:inline">Importar</span>
        <input id={importInputId} type="file" accept=".csv" className="hidden" onChange={onImport} />
      </label>

      {/* Nuevo */}
      <button
        onClick={onNew}
        className={`${textBtn} text-white bg-blue-600 hover:bg-blue-700`}
        title="Nuevo"
      >
        <Plus size={18} className="mr-0 sm:mr-2" />
        <span className="hidden sm:inline">Nuevo</span>
      </button>
    </div>
  );
}
