"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence } from "framer-motion";
import StartProjectModal from "@/components/ui/StartProjectModal";

type Ctx = { open: () => void; close: () => void; isOpen: boolean };

const StartProjectContext = createContext<Ctx | null>(null);

export function useStartProject(): Ctx {
  const ctx = useContext(StartProjectContext);
  if (!ctx) throw new Error("useStartProject must be used within StartProjectProvider");
  return ctx;
}

export default function StartProjectProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <StartProjectContext.Provider value={{ open, close, isOpen }}>
      {children}
      <AnimatePresence>{isOpen && <StartProjectModal onClose={close} />}</AnimatePresence>
    </StartProjectContext.Provider>
  );
}
