import { useState } from 'react';
import { QrCode, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const demoGuests = [
  { id: 'GUEST-001', name: 'Alex Johnson', email: 'alex@example.com', ticketType: 'VIP' },
  { id: 'GUEST-002', name: 'Sarah Williams', email: 'sarah@example.com', ticketType: 'General' },
  { id: 'GUEST-003', name: 'Michael Chen', email: 'michael@example.com', ticketType: 'VIP' },
  { id: 'GUEST-004', name: 'Emily Davis', email: 'emily@example.com', ticketType: 'General' },
  { id: 'GUEST-005', name: 'James Wilson', email: 'james@example.com', ticketType: 'Premium' },
];

const DemoQRCodes = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (guest: typeof demoGuests[0]) => {
    const qrData = JSON.stringify(guest);
    await navigator.clipboard.writeText(qrData);
    setCopiedId(guest.id);
    toast.success('QR data copied! Use a QR code generator to create the code.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-card/50 border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-card/80 transition-colors"
      >
        <div className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-primary" />
          <span className="font-medium">Demo QR Codes</span>
          <span className="text-xs text-muted-foreground">(for testing)</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 pt-0 space-y-3">
          <p className="text-sm text-muted-foreground mb-4">
            Copy the data below and generate QR codes using any online QR code generator. 
            Then scan them with the scanner above.
          </p>
          
          <div className="space-y-2">
            {demoGuests.map((guest) => (
              <div
                key={guest.id}
                className="flex items-center justify-between bg-secondary/50 rounded-lg p-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{guest.name}</p>
                  <p className="text-xs text-muted-foreground">{guest.ticketType}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(guest)}
                  className="gap-1"
                >
                  {copiedId === guest.id ? (
                    <>
                      <Check className="w-4 h-4 text-success" />
                      <span className="text-success">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Tip:</strong> Visit{' '}
              <a 
                href="https://www.qr-code-generator.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                qr-code-generator.com
              </a>
              {' '}or similar sites to generate QR codes from the copied data.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoQRCodes;
