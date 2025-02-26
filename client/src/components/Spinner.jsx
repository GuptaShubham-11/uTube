import { Loader } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Spinner({ size = 20, className = '', color = 'currentColor', ...props }) {
  return (
    <motion.div
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      className={`flex items-center justify-center ${className}`}
      aria-label="Loading..."
      {...props}
    >
      <Loader size={size} color={color} />
    </motion.div>
  );
}
