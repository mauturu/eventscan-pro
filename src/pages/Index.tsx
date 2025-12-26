import { useState, useCallback, Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import { Scan, Sparkles, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import GuestTable from '@/components/GuestTable';
import ScannerModal from '@/components/ScannerModal';
import GiftPromptModal from '@/components/GiftPromptModal';
import { Guest, QRGuestData } from '@/types/guest';

interface IndexProps {
  eventName: string;
  guests: Guest[];
  setGuests: Dispatch<SetStateAction<Guest[]>>;
}

const Index = ({ eventName, guests, setGuests }: IndexProps) => {
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/2 rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <header className="relative border-b border-border/50 glass sticky top-0 z-40">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-gold flex items-center justify-center glow-gold-intense">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-3xl text-foreground tracking-tight">{eventName}</h1>
                <p className="text-sm text-muted-foreground mt-0.5">Welcome your guests with elegance</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => setIsScannerOpen(true)}
                className="gap-2 bg-gradient-gold text-primary-foreground hover:opacity-90 glow-gold transition-all duration-300"
              >
                <Scan className="w-4 h-4" />
                Start Scanning
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative container py-10">
        <GuestTable guests={guests} />
      </main>

      {/* Subtle Admin Button */}
      <Link 
        to="/admin" 
        className="fixed bottom-3 right-3 z-50 w-6 h-6 rounded bg-border/30 hover:bg-border/60 flex items-center justify-center opacity-30 hover:opacity-80 transition-all duration-300"
      >
        <Settings className="w-3 h-3 text-muted-foreground" />
      </Link>

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
