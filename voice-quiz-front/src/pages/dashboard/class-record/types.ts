import { Variants } from "framer-motion";

export interface ModalProps {
    id: string;
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
    onToggle: () => void;
}

export const variants: Variants = {
    enter: {
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: 0.2,
      },
      display: "block",
    },
    exit: {
      opacity: 0,
      rotateX: -15,
      transition: {
        duration: 0.2,
      },
      transitionEnd: {
        display: "none",
      },
    },
  };