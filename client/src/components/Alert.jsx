import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle className="text-green-500" size={24} />,
  error: <XCircle className="text-red-500" size={24} />,
  warning: <AlertTriangle className="text-yellow-500" size={24} />,
  info: <Info className="text-blue-500" size={24} />,
};

export default function Alert({ type = 'info', message, onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`flex items-center justify-between gap-3 p-4 rounded-lg shadow-lg w-80 
                bg-white dark:bg-gray-800 border-l-4 ${
                  type === 'success'
                    ? 'border-green-500'
                    : type === 'error'
                      ? 'border-red-500'
                      : type === 'warning'
                        ? 'border-yellow-500'
                        : 'border-blue-500'
                }`}
      >
        <div className="flex items-center gap-3">
          {icons[type]}
          <span className="text-gray-800 dark:text-gray-200 font-medium">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
        >
          <X size={20} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
