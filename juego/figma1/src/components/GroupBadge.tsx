import { motion } from 'motion/react';

interface GroupBadgeProps {
  name: string;
  color: string;
  size?: 'small' | 'medium' | 'large';
}

export default function GroupBadge({ name, color, size = 'medium' }: GroupBadgeProps) {
  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-xl'
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="inline-flex items-center justify-center"
    >
      <div 
        className={`
          ${sizeClasses[size]}
          rounded-full border-4 border-white shadow-2xl text-white
        `}
        style={{ backgroundColor: color }}
      >
        {name}
      </div>
    </motion.div>
  );
}
