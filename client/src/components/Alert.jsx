import { useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import clsx from 'clsx';

const iconMap = {
  success: { icon: CheckCircle, color: 'green-500' },
  error: { icon: XCircle, color: 'red-500' },
  warning: { icon: AlertTriangle, color: 'yellow-500' },
  info: { icon: Info, color: 'blue-500' },
};

export default function Alert({ type = 'info', message, onClose, duration = 3000 }) {
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(onClose, duration);
    return () => clearTimeout(timerRef.current);
  }, [onClose, duration]);

  const { icon: Icon, color } = useMemo(() => iconMap[type] || iconMap.info, [type]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        aria-live="polite"
        className={clsx(
          'relative flex items-start gap-3 p-4 rounded-lg shadow-lg max-w-sm w-full',
          'bg-white  border-l-4',
          `border-${color}`
        )}
      >
        <div className="flex items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-3">
            <Icon className={`text-${color}`} size={24} />
            <span className="text-gray-800 dark:text-gray-200 font-medium">{message}</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
            aria-label="Close alert"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-gray-300 dark:bg-gray-700 w-full overflow-hidden">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
            className={`h-full bg-${color}`}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
