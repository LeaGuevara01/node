import React, { createContext, useContext, useState, useCallback, Suspense } from 'react';

// Lazy imports para reducir bundle inicial
const modalLoaders = {
  maquinarias: () => import('../components/MaquinariaEditModal'),
  repuestos: () => import('../components/RepuestoEditModal'),
  proveedores: () => import('../components/ProveedorEditModal'),
  reparaciones: () => import('../components/ReparacionEditModal')
};

const EntityModalContext = createContext(null);

export function EntityModalProvider({ children, token }) {
  const [modalState, setModalState] = useState({
    open: false,
    entity: null,
    mode: 'create',
    item: null,
    props: {}
  });
  const [LoadedComponent, setLoadedComponent] = useState(null);
  const [loading, setLoading] = useState(false);

  const openEntityModal = useCallback(async ({ entity, mode = 'create', item = null, props = {} }) => {
    if (!modalLoaders[entity]) return console.warn('Modal loader no definido para', entity);
    setLoading(true);
    try {
      const mod = await modalLoaders[entity]();
      const Comp = mod.default || Object.values(mod)[0];
      setLoadedComponent(() => Comp);
      setModalState({ open: true, entity, mode, item, props });
    } finally {
      setLoading(false);
    }
  }, []);

  const closeEntityModal = useCallback(() => {
    setModalState(s => ({ ...s, open: false }));
    setTimeout(() => {
      setLoadedComponent(null);
      setModalState({ open: false, entity: null, mode: 'create', item: null, props: {} });
    }, 250);
  }, []);

  const contextValue = {
    openEntityModal,
    closeEntityModal,
    modalState,
    isOpen: modalState.open
  };

  return (
    <EntityModalContext.Provider value={contextValue}>
      {children}
      {modalState.open && LoadedComponent && (
        <Suspense fallback={
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
            <div className="bg-white px-4 py-3 rounded shadow text-sm text-gray-600">Cargando…</div>
          </div>
        }>
          <LoadedComponent
            token={token}
            mode={modalState.mode}
            {...(modalState.entity === 'maquinarias' ? { maquinaria: modalState.item || {}, onCreate: modalState.props.onCreate, onUpdate: modalState.props.onUpdate, onDelete: modalState.props.onDelete } : {})}
            {...(modalState.entity === 'repuestos' ? { repuesto: modalState.item || {}, onCreate: modalState.props.onCreate, onUpdate: modalState.props.onUpdate, onDelete: modalState.props.onDelete } : {})}
            {...(modalState.entity === 'proveedores' ? { proveedor: modalState.item || {}, onCreate: modalState.props.onCreate, onUpdate: modalState.props.onUpdate, onDelete: modalState.props.onDelete } : {})}
            {...(modalState.entity === 'reparaciones' ? { item: modalState.item || {}, onSave: modalState.props.onSave, onDelete: modalState.props.onDelete, users: modalState.props.users, maquinarias: modalState.props.maquinarias, repuestos: modalState.props.repuestos } : {})}
            onClose={closeEntityModal}
          />
        </Suspense>
      )}
      {loading && !modalState.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-40">
          <div className="bg-white px-4 py-2 rounded shadow text-sm text-gray-600">Preparando formulario…</div>
        </div>
      )}
    </EntityModalContext.Provider>
  );
}

export function useEntityModal() {
  const ctx = useContext(EntityModalContext);
  if (!ctx) throw new Error('useEntityModal debe usarse dentro de EntityModalProvider');
  return ctx;
}

export default EntityModalContext;
