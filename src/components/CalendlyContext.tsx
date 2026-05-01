"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CalendlyContextType {
  open: boolean;
  openCalendly: () => void;
  closeCalendly: () => void;
}

const CalendlyContext = createContext<CalendlyContextType>({
  open: false,
  openCalendly: () => {},
  closeCalendly: () => {},
});

export function CalendlyProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <CalendlyContext.Provider
      value={{
        open,
        openCalendly: () => setOpen(true),
        closeCalendly: () => setOpen(false),
      }}
    >
      {children}
    </CalendlyContext.Provider>
  );
}

export function useCalendly() {
  return useContext(CalendlyContext);
}
