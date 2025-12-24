import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Scan, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import GuestTable from '@/components/GuestTable';
import ScannerModal from '@/components/ScannerModal';
import GiftPromptModal from '@/components/GiftPromptModal';
import { Guest, QRGuestData } from '@/types/guest';

const Index = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isGiftPromptOpen, setIsGiftPromptOpen] = useState(false);
  const [scannedGuest, setScannedGuest] = useState<QRGuestData | null>(null);

  const handleScan = useCallback((data: string) => {
    try {
      // Parse CSV format: name,phone
      const parts = data.split(',').map(s => s.trim());
      
      if (parts.length < 2) {
        toast.error('Invalid QR Code', {
          description: 'Expected format: name,phone',
        });
        return;
      }

      const [name, phone] = parts;

      // Check if already checked in
      const alreadyCheckedIn = guests.find(
        g => g.name.toLowerCase() === name.toLowerCase() && g.phone === phone
      );

      if (alreadyCheckedIn) {
        toast.error(`${name} has already checked in!`, {
          description: 'This guest was already registered.',
        });
        return;
      }

      // Close scanner and open gift prompt
      setScannedGuest({ name, phone });
      setIsScannerOpen(false);
      setIsGiftPromptOpen(true);
    } catch {
      toast.error('Invalid QR Code', {
        description: 'Could not read guest data from QR code.',
      });
    }
  }, [guests]);

  const handleGiftConfirm = (hasGift: boolean) => {
    if (!scannedGuest) return;

    const newGuest: Guest = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: scannedGuest.name,
      phone: scannedGuest.phone,
      gift: hasGift,
      checkedInAt: new Date(),
    };

    setGuests(prev => [newGuest, ...prev]);
    setIsGiftPromptOpen(false);
    setScannedGuest(null);

    toast.success(`Welcome, ${newGuest.name}!`, {
      description: hasGift ? 'Thank you for your generous gift!' : 'Enjoy the event!',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center glow-gold">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="font-serif text-2xl text-foreground">Event Check-In</h1>
                <p className="text-sm text-muted-foreground">Welcome your guests with elegance</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link to="/generate">
                <Button variant="outline" className="gap-2 border-border hover:bg-secondary">
                  <QrCode className="w-4 h-4" />
                  <span className="hidden sm:inline">Generate QR Codes</span>
                </Button>
              </Link>
              <Button 
                onClick={() => setIsScannerOpen(true)}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Scan className="w-4 h-4" />
                Start Scanning
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative container py-8">
        <GuestTable guests={guests} />
      </main>

      {/* Scanner Modal */}
      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleScan}
      />

      {/* Gift Prompt Modal */}
      <GiftPromptModal
        isOpen={isGiftPromptOpen}
        guestData={scannedGuest}
        onConfirm={handleGiftConfirm}
        onClose={() => {
          setIsGiftPromptOpen(false);
          setScannedGuest(null);
        }}
      />
    </div>
  );
};

export default Index;
