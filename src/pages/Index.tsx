import { useState, useCallback } from 'react';
import { Calendar, MapPin, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import QRScanner from '@/components/QRScanner';
import GuestList from '@/components/GuestList';
import CheckInSuccess from '@/components/CheckInSuccess';
import DemoQRCodes from '@/components/DemoQRCodes';
import { Guest, QRData } from '@/types/guest';

const Index = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastCheckedIn, setLastCheckedIn] = useState<Guest | null>(null);

  const handleScan = useCallback((data: string) => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const qrData: QRData = JSON.parse(data);

      // Check if guest already checked in
      const alreadyCheckedIn = guests.find((g) => g.id === qrData.id);
      if (alreadyCheckedIn) {
        toast.error(`${qrData.name} has already checked in!`, {
          description: 'This guest was already registered.',
        });
        setIsProcessing(false);
        return;
      }

      // Add guest to list
      const newGuest: Guest = {
        id: qrData.id,
        name: qrData.name,
        email: qrData.email,
        ticketType: qrData.ticketType,
        checkedInAt: new Date(),
      };

      setGuests((prev) => [newGuest, ...prev]);
      setLastCheckedIn(newGuest);
      setShowSuccess(true);

      // Play success sound effect (optional)
      const audio = new Audio('/success.mp3');
      audio.play().catch(() => {}); // Ignore errors if sound fails

      // Hide success modal after delay
      setTimeout(() => {
        setShowSuccess(false);
        setIsProcessing(false);
      }, 2000);
    } catch {
      toast.error('Invalid QR Code', {
        description: 'The scanned code does not contain valid guest data.',
      });
      setIsProcessing(false);
    }
  }, [guests, isProcessing]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <QrCode className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Event Check-In</h1>
                <p className="text-sm text-muted-foreground">Scan QR codes to register guests</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>Main Venue</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Scanner Section */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <QrCode className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">QR Scanner</h2>
              </div>
              <QRScanner onScan={handleScan} isProcessing={isProcessing} />
            </div>

            {/* Demo QR Codes */}
            <DemoQRCodes />
          </div>

          {/* Guest List Section */}
          <div className="bg-card border border-border rounded-xl p-6 min-h-[500px] flex flex-col">
            <GuestList guests={guests} />
          </div>
        </div>
      </main>

      {/* Success Modal */}
      <CheckInSuccess guest={lastCheckedIn} show={showSuccess} />
    </div>
  );
};

export default Index;
