import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock } from 'lucide-react';

interface TimerProps {
  initialMinutes?: number;
  initialSeconds?: number;
  onComplete?: () => void;
  paused?: boolean;
}

export default function Timer({ initialMinutes = 5, initialSeconds = 0, onComplete, paused = false }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60 + initialSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.();
      return;
    }

    // No iniciar el timer si está pausado
    if (paused) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete, paused]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isDanger = timeLeft <= 30;
  const isWarning = timeLeft <= 60 && timeLeft > 30;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="inline-flex items-center gap-3"
    >
      <div 
        className={`
          flex items-center gap-2 px-6 py-3 rounded-full border-4 border-white shadow-lg
          ${isDanger ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-blue-500'}
          transition-colors duration-300
        `}
      >
        <Clock className="w-6 h-6 text-white" />
        <motion.span 
          className="text-white text-2xl tabular-nums min-w-[80px] text-center"
          animate={isDanger ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </motion.span>
      </div>
    </motion.div>
  );
}
