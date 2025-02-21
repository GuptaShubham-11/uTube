import { Loader } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Spinner({ size = 20, className = 'dark:text-white text-black ' }) {
  return (
    <motion.div
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      className={`${className} flex items-center justify-center`}
    >
      <Loader size={size} />
    </motion.div>
  );
}
