import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DesktopIconProps {
  name: string;
  icon: LucideIcon;
  onClick: () => void;
}

export function DesktopIcon({ name, icon: Icon, onClick }: DesktopIconProps) {
  return (
    <motion.button
      onClick={onClick}
      className="group flex flex-col items-center w-24 p-2 rounded hover:bg-white/10 active:bg-white/20 transition-all outline-none focus:ring-1 focus:ring-white/20"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        opacity: { duration: 0.3 },
        y: { duration: 0.3 }
      }}
    >
      <div className="relative">
        <motion.div 
          className="absolute inset-0 bg-black/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <Icon className="w-12 h-12 text-white drop-shadow-lg relative z-10" strokeWidth={1.5} />
        </motion.div>
      </div>
      <motion.span 
        className="desktop-icon-text font-sans tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        {name}
      </motion.span>
    </motion.button>
  );
}
