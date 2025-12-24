import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Upload, 
  Download, 
  QrCode, 
  FileText, 
  Trash2, 
  User,
  Phone,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CSVGuest } from '@/types/guest';

const GenerateQR = () => {
  const [csvInput, setCsvInput] = useState('');
  const [guests, setGuests] = useState<CSVGuest[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQRs, setGeneratedQRs] = useState<{ guest: CSVGuest; dataUrl: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (text: string): CSVGuest[] => {
    const lines = text.trim().split('\n');
    const parsed: CSVGuest[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const parts = trimmed.split(',').map(s => s.trim());
      if (parts.length >= 2) {
        parsed.push({
          name: parts[0],
          phone: parts[1],
        });
      }
    }

    return parsed;
  };

  const handleParse = () => {
    if (!csvInput.trim()) {
      toast.error('Please enter CSV data');
      return;
    }

    const parsed = parseCSV(csvInput);
    
    if (parsed.length === 0) {
      toast.error('No valid data found', {
        description: 'Expected format: name,phone (one per line)',
      });
      return;
    }

    setGuests(parsed);
    setGeneratedQRs([]);
    toast.success(`Found ${parsed.length} guests`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvInput(text);
      
      const parsed = parseCSV(text);
      if (parsed.length > 0) {
        setGuests(parsed);
        setGeneratedQRs([]);
        toast.success(`Loaded ${parsed.length} guests from file`);
      }
    };
    reader.readAsText(file);
  };

  const generateQRCodes = async () => {
    if (guests.length === 0) {
      toast.error('No guests to generate QR codes for');
      return;
    }

    setIsGenerating(true);
    setGeneratedQRs([]);

    try {
      const qrs: { guest: CSVGuest; dataUrl: string }[] = [];

      for (const guest of guests) {
        // Format: name,phone
        const qrData = `${guest.name},${guest.phone}`;
        
        const dataUrl = await QRCode.toDataURL(qrData, {
          width: 400,
          margin: 2,
          color: {
            dark: '#1a1a1a',
            light: '#ffffff',
          },
        });

        qrs.push({ guest, dataUrl });
      }

      setGeneratedQRs(qrs);
      toast.success(`Generated ${qrs.length} QR codes`);
    } catch (error) {
      console.error('Error generating QR codes:', error);
      toast.error('Failed to generate QR codes');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAll = async () => {
    if (generatedQRs.length === 0) {
      toast.error('No QR codes to download');
      return;
    }

    const zip = new JSZip();

    for (const { guest, dataUrl } of generatedQRs) {
      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      // Sanitize filename
      const safeName = guest.name.replace(/[^a-zA-Z0-9]/g, '_');
      zip.file(`${safeName}_${guest.phone}.png`, blob);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'guest-qr-codes.zip');
    toast.success('Downloaded QR codes as ZIP');
  };

  const clearAll = () => {
    setCsvInput('');
    setGuests([]);
    setGeneratedQRs([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon" className="hover:bg-secondary">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="font-serif text-2xl text-foreground">Generate QR Codes</h1>
                <p className="text-sm text-muted-foreground">Create QR codes for your guest list</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative container py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* CSV Format Info */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-xl text-foreground">CSV Format</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Enter guest data with one guest per line:
              </p>
              <div className="bg-secondary/50 rounded-lg p-4 font-mono text-sm">
                <p className="text-muted-foreground">name,phone</p>
                <p className="text-foreground">John Doe,+1234567890</p>
                <p className="text-foreground">Jane Smith,+0987654321</p>
              </div>
            </div>

            {/* CSV Input */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl text-foreground">Guest Data</h2>
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".csv,.txt"
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-1"
                  >
                    <Upload className="w-4 h-4" />
                    Upload
                  </Button>
                  {(csvInput || guests.length > 0) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAll}
                      className="gap-1 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              <Textarea
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                placeholder="John Doe,+1234567890&#10;Jane Smith,+0987654321"
                className="min-h-[200px] font-mono text-sm bg-secondary/30 border-border"
              />

              <div className="flex gap-3 mt-4">
                <Button
                  onClick={handleParse}
                  variant="outline"
                  className="flex-1"
                >
                  Parse Data
                </Button>
                <Button
                  onClick={generateQRCodes}
                  disabled={guests.length === 0 || isGenerating}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <QrCode className="w-4 h-4 mr-2" />
                      Generate QR Codes
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Parsed Guests Preview */}
            {guests.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-xl text-foreground">Parsed Guests</h2>
                  <span className="text-sm text-muted-foreground">{guests.length} guests</span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {guests.map((guest, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="flex items-center justify-between bg-secondary/30 rounded-lg px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">{guest.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{guest.phone}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Generated QR Codes */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 min-h-[400px]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-primary" />
                  <h2 className="font-serif text-xl text-foreground">Generated QR Codes</h2>
                </div>
                {generatedQRs.length > 0 && (
                  <Button
                    onClick={downloadAll}
                    className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Download className="w-4 h-4" />
                    Download All (ZIP)
                  </Button>
                )}
              </div>

              {generatedQRs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
                    <QrCode className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-serif text-foreground mb-1">No QR codes yet</p>
                  <p className="text-sm text-muted-foreground text-center">
                    Enter guest data and click "Generate QR Codes"
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
                  <AnimatePresence mode="popLayout">
                    {generatedQRs.map(({ guest, dataUrl }, index) => (
                      <motion.div
                        key={`${guest.name}-${guest.phone}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-lg p-3 text-center"
                      >
                        <img
                          src={dataUrl}
                          alt={`QR code for ${guest.name}`}
                          className="w-full aspect-square mb-2"
                        />
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {guest.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {guest.phone}
                        </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GenerateQR;
