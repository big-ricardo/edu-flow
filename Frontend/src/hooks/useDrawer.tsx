import React from "react";
import { DrawerContext } from "@contexts/DrawerContext";

export default function useDrawer(): {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
} {
  const context = React.useContext(DrawerContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return {
    isOpen: context.isOpen,
    onOpen: context.onOpen,
    onClose: context.onClose,
  };
}
