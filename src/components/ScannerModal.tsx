import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { motion } from 'framer-motion';
import { Camera, RefreshCw, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (data: string) => void;
}

const ScannerModal = ({ isOpen, onClose, onScan }: ScannerModalProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current && isScanningRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        // Ignore stop errors
      }
      isScanningRef.current = false;
      setIsScanning(false);
    }
  }, []);

  const startScanner = useCallback(async () => {
    setError(null);
    
    // Wait for container to be available
    if (!containerRef.current) {
      setError('Scanner container not ready. Please try again.');
      return;
    }

    try {
      // Clean up any existing scanner
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
        } catch {
          // Ignore
        }
        scannerRef.current = null;
      }

      scannerRef.current = new Html5Qrcode('qr-reader-modal');

      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        (decodedText) => {
          onScan(decodedText);
          stopScanner();
        },
        () => {}
      );
      
      isScanningRef.current = true;
      setIsScanning(true);
    } catch (err) {
      console.error('Scanner error:', err);
      setError('Unable to access camera. Please ensure camera permissions are granted.');
      isScanningRef.current = false;
      setIsScanning(false);
    }
  }, [onScan, stopScanner]);

  useEffect(() => {
    if (isOpen) {
      // Wait for dialog to render and DOM to be ready
      const timer = setTimeout(() => {
        startScanner();
      }, 300);
      return () => clearTimeout(timer);
    } else {
      // Cleanup when modal closes
      stopScanner();
    }
  }, [isOpen, startScanner, stopScanner]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (scannerRef.current && isScanningRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const handleClose = async () => {
    await stopScanner();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg glass border-border/50 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
              <Camera className="w-5 h-5 text-primary-foreground" />
            </div>
            Scan Guest QR Code
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-5 pt-2">
          <div 
            ref={containerRef}
            className="relative w-full aspect-square rounded-2xl overflow-hidden bg-onyx border border-border/50"
          >
            <div id="qr-reader-modal" className="w-full h-full" />
            
            {isScanning && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Scanning frame */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-60 h-60 relative"
                  >
                    {/* Corner brackets */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-primary rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-primary rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary rounded-br-lg" />
                    
                    {/* Scanning line */}
                    <motion.div 
                      className="absolute left-2 right-2 h-0.5 bg-gradient-gold rounded-full glow-gold"
                      initial={{ top: '10%' }}
                      animate={{ top: ['10%', '90%', '10%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </motion.div>
                </div>
                
                {/* Status indicator */}
                <div className="absolute top-4 left-4 flex items-center gap-2 glass-gold px-4 py-2 rounded-full">
                  <Scan className="w-4 h-4 text-primary animate-pulse" />
                  <span className="text-xs text-primary font-medium">Scanning...</span>
                </div>
              </div>
            )}
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full text-destructive text-sm text-center bg-destructive/10 px-4 py-3 rounded-xl border border-destructive/20"
            >
              {error}
              <Button
                variant="ghost"
                size="sm"
                onClick={startScanner}
                className="ml-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Retry
              </Button>
            </motion.div>
          )}

          <p className="text-sm text-muted-foreground text-center pb-2">
            Position the QR code within the frame to scan
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScannerModal;
