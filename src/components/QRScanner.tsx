import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CameraOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QRScannerProps {
  onScan: (data: string) => void;
  isProcessing?: boolean;
}

const QRScanner = ({ onScan, isProcessing }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startScanner = async () => {
    setError(null);
    
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode('qr-reader');
      }

      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        (decodedText) => {
          if (!isProcessing) {
            onScan(decodedText);
          }
        },
        () => {}
      );
      
      setIsScanning(true);
    } catch (err) {
      console.error('Scanner error:', err);
      setError('Unable to access camera. Please ensure camera permissions are granted.');
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [isScanning]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div 
        ref={containerRef}
        className="relative w-full max-w-sm aspect-square rounded-lg overflow-hidden bg-secondary/50 border border-border"
      >
        <div id="qr-reader" className="w-full h-full" />
        
        {!isScanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-secondary/80 backdrop-blur-sm">
            <Camera className="w-16 h-16 text-muted-foreground" />
            <p className="text-muted-foreground text-center px-4">
              Click the button below to start scanning
            </p>
          </div>
        )}

        {isScanning && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-primary rounded-lg animate-pulse-glow" />
            </div>
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-primary/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs text-primary font-medium">Scanning...</span>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}
      </div>

      {error && (
        <div className="text-destructive text-sm text-center bg-destructive/10 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      <Button
        onClick={isScanning ? stopScanner : startScanner}
        variant={isScanning ? "secondary" : "default"}
        size="lg"
        className="gap-2"
      >
        {isScanning ? (
          <>
            <CameraOff className="w-5 h-5" />
            Stop Scanner
          </>
        ) : (
          <>
            <Camera className="w-5 h-5" />
            Start Scanner
          </>
        )}
      </Button>
    </div>
  );
};

export default QRScanner;
