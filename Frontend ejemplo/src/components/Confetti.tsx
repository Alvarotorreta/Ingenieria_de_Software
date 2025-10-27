import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export default function Confetti() {
  const colors = ['#10b981', '#ef4444', '#fbbf24', '#a855f7', '#3b82f6', '#ec4899'];
  const [pieces, setPieces] = useState<Array<{ id: number; x: number; y: number; rotation: number; color: string }>>([]);

  useEffect(() => {
    const newPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    
    setPieces(newPieces);

    const timeout = setTimeout(() => {
      setPieces([]);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  if (pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map(piece => (
        <motion.div
          key={piece.id}
          initial={{ 
            x: `${piece.x}vw`, 
            y: `${piece.y}vh`,
            rotate: piece.rotation,
            opacity: 1
          }}
          animate={{ 
            y: '110vh',
            rotate: piece.rotation + 720,
            opacity: 0
          }}
          transition={{ 
            duration: 2 + Math.random(),
            ease: 'easeIn'
          }}
          className="absolute w-3 h-3 rounded-sm"
          style={{ backgroundColor: piece.color }}
        />
      ))}
    </div>
  );
}
