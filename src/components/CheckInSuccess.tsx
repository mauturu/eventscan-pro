import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Guest } from '@/types/guest';

interface CheckInSuccessProps {
  guest: Guest | null;
  show: boolean;
}

const CheckInSuccess = ({ guest, show }: CheckInSuccessProps) => {
  return (
    <AnimatePresence>
      {show && guest && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="bg-card border border-border rounded-2xl p-8 text-center max-w-sm mx-4 shadow-2xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', damping: 10 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center glow-primary"
            >
              <CheckCircle className="w-12 h-12 text-success" />
            </motion.div>
            
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-foreground mb-2"
            >
              Welcome!
            </motion.h2>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-primary font-semibold mb-1"
            >
              {guest.name}
            </motion.p>
            
            {guest.ticketType && (
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-muted-foreground"
              >
                {guest.ticketType}
              </motion.p>
            )}
            
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 1.5 }}
              className="mt-6 h-1 bg-success/20 rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ delay: 0.5, duration: 1.5 }}
                className="h-full w-full bg-success rounded-full"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CheckInSuccess;
