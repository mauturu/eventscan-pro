import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  QrCode, 
  Trash2, 
  Edit3, 
  AlertTriangle,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface AdminProps {
  eventName: string;
  onEventNameChange: (name: string) => void;
  onClearGuests: () => void;
  guestCount: number;
}

const Admin = ({ eventName, onEventNameChange, onClearGuests, guestCount }: AdminProps) => {
  const navigate = useNavigate();
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(eventName);

  const handleSaveName = () => {
    if (tempName.trim()) {
      onEventNameChange(tempName.trim());
      setEditingName(false);
    }
  };

  const handleCancelEdit = () => {
    setTempName(eventName);
    setEditingName(false);
  };

  const handleClearConfirm = () => {
    onClearGuests();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-border/50 glass sticky top-0 z-40">
        <div className="container py-6">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="hover:bg-secondary">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-display text-2xl text-foreground">Administrator</h1>
              <p className="text-sm text-muted-foreground">Manage your event settings</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative container py-10">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Event Name Setting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Edit3 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-foreground">Event Name</h2>
                <p className="text-sm text-muted-foreground">Customize your event title</p>
              </div>
            </div>

            {editingName ? (
              <div className="flex gap-3">
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Enter event name"
                  className="flex-1 bg-secondary/30"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                />
                <Button onClick={handleSaveName} size="icon" className="bg-success hover:bg-success/90">
                  <Check className="w-4 h-4" />
                </Button>
                <Button onClick={handleCancelEdit} size="icon" variant="outline">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-lg text-foreground font-medium">{eventName}</span>
                <Button 
                  onClick={() => setEditingName(true)} 
                  variant="outline" 
                  size="sm"
                  className="gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </Button>
              </div>
            )}
          </motion.div>

          {/* Generate QR Codes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <QrCode className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-foreground">QR Codes</h2>
                <p className="text-sm text-muted-foreground">Generate QR codes for your guests</p>
              </div>
            </div>
            <Link to="/generate">
              <Button className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90 gap-2">
                <QrCode className="w-4 h-4" />
                Open QR Code Generator
              </Button>
            </Link>
          </motion.div>

          {/* Clear Guest List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-destructive/20 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-foreground">Clear Guest List</h2>
                <p className="text-sm text-muted-foreground">
                  Remove all {guestCount} checked-in guests
                </p>
              </div>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="w-full gap-2"
                  disabled={guestCount === 0}
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All Guests
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border-border">
                <AlertDialogHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-destructive" />
                    </div>
                    <AlertDialogTitle className="font-serif text-xl">
                      Clear Guest List?
                    </AlertDialogTitle>
                  </div>
                  <AlertDialogDescription className="text-muted-foreground">
                    This will permanently remove all {guestCount} checked-in guests from the list. 
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleClearConfirm}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Yes, Clear All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
