import React, { createContext, useContext, useState } from "react";

// 1. ایجاد Context
const EditingContext = createContext(null);

// 2. ایجاد Provider
export const EditingProvider = ({ children }) => {
  const [editingId, setEditingId] = useState(null);

  // تابعی برای شروع ویرایش
  const startEditing = (id) => {
    setEditingId(id);
  };

  // تابعی برای پایان ویرایش
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

// 3. ایجاد هوک سفارشی برای استفاده راحت‌تر
export const useEditing = () => {
  const context = useContext(EditingContext);
  if (context === undefined) {
    throw new Error("useEditing must be used within a EditingProvider");
  }
  return context;
};
