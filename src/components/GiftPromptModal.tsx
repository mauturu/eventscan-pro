import { motion } from 'framer-motion';
import { Gift, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { QRGuestData } from '@/types/guest';

interface GiftPromptModalProps {
  isOpen: boolean;
  guestData: QRGuestData | null;
  onConfirm: (hasGift: boolean) => void;
  onClose: () => void;
}

const GiftPromptModal = ({ isOpen, guestData, onConfirm, onClose }: GiftPromptModalProps) => {
  if (!guestData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-foreground text-center">
            Welcome, {guestData.name}!
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            We're delighted to have you here
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-6 py-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
            className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center glow-gold"
          >
            <Gift className="w-10 h-10 text-primary" />
          </motion.div>
          
          <p className="text-lg text-center text-foreground">
            Did you bring a gift for the occasion?
          </p>

          <div className="flex gap-4 w-full">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 border-border hover:bg-secondary"
              onClick={() => onConfirm(false)}
            >
              <X className="w-5 h-5 mr-2" />
              No Gift
            </Button>
            <Button
              size="lg"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => onConfirm(true)}
            >
              <Gift className="w-5 h-5 mr-2" />
              Yes, I Did!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GiftPromptModal;
