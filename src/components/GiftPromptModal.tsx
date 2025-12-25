import { motion } from 'framer-motion';
import { Gift, X, Sparkles } from 'lucide-react';
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
      <DialogContent className="sm:max-w-md glass border-border/50 rounded-2xl">
        <DialogHeader className="text-center pb-2">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 12 }}
            className="w-20 h-20 mx-auto rounded-2xl bg-gradient-gold flex items-center justify-center glow-gold-intense mb-4"
          >
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          <DialogTitle className="font-display text-3xl text-foreground text-center tracking-tight">
            Welcome, {guestData.name}!
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground mt-2">
            We're delighted to have you here
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-8 py-6">
          <div className="text-center">
            <p className="text-lg text-foreground font-medium mb-1">
              Did you bring a gift?
            </p>
            <p className="text-sm text-muted-foreground">
              for this special occasion
            </p>
          </div>

          <div className="flex gap-4 w-full">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 h-14 border-border/60 hover:border-muted-foreground/40 hover:bg-muted/30 rounded-xl transition-all duration-300"
              onClick={() => onConfirm(false)}
            >
              <X className="w-5 h-5 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">No Gift</span>
            </Button>
            <Button
              size="lg"
              className="flex-1 h-14 bg-gradient-gold text-primary-foreground hover:opacity-90 glow-gold rounded-xl transition-all duration-300"
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
