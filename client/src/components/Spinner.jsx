import { Loader } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Spinner({ size = 20, color = 'text-white' }) {
  return (
    <motion.div
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      className={`flex items-center justify-center ${color}`}
    >
      <Loader size={size} />
    </motion.div>
  );
}
