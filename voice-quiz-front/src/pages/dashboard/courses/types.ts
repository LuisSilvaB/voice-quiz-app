import { Variants } from "framer-motion";

interface ModalProps {
    id: string;
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
    onToggle: () => void;
}


const variants: Variants = {
    enter: {
      opacity: 1,
      transition: {
        duration: 0.2,
      },
      display: "block",
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
      transitionEnd: {
        display: "none",
      },
    },
  };
  
type sessionTabs = "audio-file" | "real-time" | "record";

export { type sessionTabs, variants, type ModalProps }