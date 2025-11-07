import { motion } from 'motion/react';
import { Coins } from 'lucide-react';

export default function TokenAnimation() {
  return (
    <motion.div
      initial={{ scale: 0, y: 0, opacity: 0 }}
      animate={{ 
        scale: [0, 1.5, 1],
        y: -100,
        opacity: [0, 1, 1, 0]
      }}
      transition={{ 
        duration: 2,
        times: [0, 0.3, 0.7, 1]
      }}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
    >
      <div 
        className="flex items-center gap-3 px-8 py-4 rounded-2xl shadow-2xl border-4 bg-[#fbc95c] border-white"
      >
        <Coins className="w-12 h-12 text-white" />
        <span className="text-white text-5xl">
          +50
        </span>
      </div>
    </motion.div>
  );
}
