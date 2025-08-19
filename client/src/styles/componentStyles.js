// componentStyles.js
// Estilos base reutilizables para páginas, formularios y detalles de componentes

export const PAGE_STYLES = {
  container: 'p-8 max-w-3xl mx-auto',
  title: 'text-2xl font-bold mb-6',
  error: 'text-red-600 mb-4',
};

export const BUTTON_STYLES = {
  primary: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700',
  secondary: 'bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400',
};

export const LIST_STYLES = {
  list: 'mt-6 space-y-2',
  item: 'flex justify-between items-center p-3 bg-white rounded shadow',
};

export const FORM_STYLES = {
  container: 'bg-white p-6 rounded shadow max-w-md mx-auto',
  title: 'text-xl font-semibold mb-4',
  label: 'block text-sm font-medium text-gray-700 mb-1',
  input: 'w-full p-2 border rounded mb-4',
  actions: 'flex gap-3 mt-4',
};

export const DETAILS_STYLES = {
  container: 'p-8 bg-white rounded shadow max-w-lg mx-auto',
  title: 'text-2xl font-bold mb-4',
  label: 'text-sm font-medium text-gray-500 mt-2',
  loading: 'text-gray-500',
  error: 'text-red-600',
  empty: 'text-gray-400',
};
