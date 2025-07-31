import React from 'react';

function RoleGuard({ role, allowed, children }) {
  if (!allowed.includes(role)) {
    return <div className="text-red-500 mb-4">No tienes permisos para realizar esta acción.</div>;
  }
  return children;
}

export default RoleGuard;
