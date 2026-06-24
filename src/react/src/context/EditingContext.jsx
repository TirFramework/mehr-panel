import React, { createContext, useContext, useState } from "react";

// 1. Create Context
const EditingContext = createContext(null);

// 2. Create Provider
export const EditingProvider = ({ children }) => {
  const [editingId, setEditingId] = useState(null);

  // Start editing
  const startEditing = (id) => {
    setEditingId(id);
  };

  // Stop editing
  const cancelEditing = () => {
    setEditingId(null);
  };

  const value = {
    editingId,
    startEditing,
    cancelEditing,
  };

  return (
    <EditingContext.Provider value={value}>{children}</EditingContext.Provider>
  );
};

// 3. Custom hook for easier consumption
export const useEditing = () => {
  const context = useContext(EditingContext);
  if (context === undefined) {
    throw new Error("useEditing must be used within a EditingProvider");
  }
  return context;
};
