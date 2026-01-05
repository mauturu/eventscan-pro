import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { QRGuestData } from '@/types/guest';

interface PartySizeModalProps {
  isOpen: boolean;
  guestData: QRGuestData | null;
  onConfirm: (partySize: number) => void;
  onClose: () => void;
}

const PartySizeModal = ({ isOpen, guestData, onConfirm, onClose }: PartySizeModalProps) => {
  const [partySize, setPartySize] = useState(1);

  if (!guestData) return null;

  const handleConfirm = () => {
    onConfirm(partySize);
    setPartySize(1); // Reset for next use
  };

  const increment = () => setPartySize(prev => Math.min(prev + 1, 20));
  const decrement = () => setPartySize(prev => Math.max(prev - 1, 1));

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
            <Users className="w-10 h-10 text-primary-foreground" />
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
              How many people in your party?
            </p>
            <p className="text-sm text-muted-foreground">
              including yourself
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Button
              variant="outline"
              size="icon"
              className="w-14 h-14 rounded-xl border-border/60 hover:border-muted-foreground/40 hover:bg-muted/30"
              onClick={decrement}
              disabled={partySize <= 1}
            >
              <Minus className="w-6 h-6" />
            </Button>
            
            <motion.div
              key={partySize}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-20 h-20 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-center"
            >
              <span className="font-display text-4xl text-foreground">{partySize}</span>
            </motion.div>
            
            <Button
              variant="outline"
              size="icon"
              className="w-14 h-14 rounded-xl border-border/60 hover:border-muted-foreground/40 hover:bg-muted/30"
              onClick={increment}
              disabled={partySize >= 20}
            >
              <Plus className="w-6 h-6" />
            </Button>
          </div>

          <Button
            size="lg"
            className="w-full h-14 bg-gradient-gold text-primary-foreground hover:opacity-90 glow-gold rounded-xl transition-all duration-300"
            onClick={handleConfirm}
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PartySizeModal;
