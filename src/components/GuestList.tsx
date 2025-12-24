import { motion, AnimatePresence } from 'framer-motion';
import { User, Clock, Ticket, Users } from 'lucide-react';
import { Guest } from '@/types/guest';
import { ScrollArea } from '@/components/ui/scroll-area';

interface GuestListProps {
  guests: Guest[];
}

const GuestList = ({ guests }: GuestListProps) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Checked-In Guests</h2>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
          <span className="text-2xl font-bold text-primary">{guests.length}</span>
          <span className="text-sm text-muted-foreground">guests</span>
        </div>
      </div>

      {guests.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No guests checked in yet</p>
          <p className="text-sm text-muted-foreground/70">Scan a QR code to check in guests</p>
        </div>
      ) : (
        <ScrollArea className="flex-1 -mx-2 px-2">
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {guests.map((guest, index) => (
                <motion.div
                  key={guest.id}
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index === 0 ? 0 : 0.05 }}
                  className="group relative bg-card/50 hover:bg-card border border-border rounded-lg p-4 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{guest.name}</h3>
                      {guest.email && (
                        <p className="text-sm text-muted-foreground truncate">{guest.email}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        {guest.ticketType && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Ticket className="w-3 h-3" />
                            <span>{guest.ticketType}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(guest.checkedInAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success/10">
                      <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  
                  {index === 0 && guests.length > 1 && (
                    <motion.div
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      transition={{ delay: 2, duration: 0.5 }}
                      className="absolute -left-1 top-0 bottom-0 w-1 bg-primary rounded-full"
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default GuestList;
