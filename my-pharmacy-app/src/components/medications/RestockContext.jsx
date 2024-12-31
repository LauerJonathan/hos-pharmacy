import React, { createContext, useContext, useState } from 'react';

const RestockContext = createContext();

export const RestockProvider = ({ children }) => {
  const [openMedicationId, setOpenMedicationId] = useState(null);

  return (
    <RestockContext.Provider value={{ openMedicationId, setOpenMedicationId }}>
      {children}
    </RestockContext.Provider>
  );
};

export const useRestock = () => {
  const context = useContext(RestockContext);
  if (!context) {
    throw new Error('useRestock must be used within a RestockProvider');
  }
  return context;
};