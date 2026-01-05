import { motion, AnimatePresence } from 'framer-motion';
import { Users, Gift, Phone, Clock, Sparkles } from 'lucide-react';
import { Guest } from '@/types/guest';

interface GuestTableProps {
  guests: Guest[];
}

const GuestTable = ({ guests }: GuestTableProps) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const totalGifts = guests.reduce((sum, g) => sum + g.giftCount, 0);
  const totalPeople = guests.reduce((sum, g) => sum + g.partySize, 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-8 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-gold flex items-center justify-center glow-gold">
              <Users className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-display text-3xl text-foreground tracking-tight">Guest Registry</h2>
              <p className="text-sm text-muted-foreground mt-1">Guests who have checked in</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center px-4">
              <p className="text-4xl font-display text-gradient-gold">{totalPeople}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Present</p>
            </div>
            <div className="w-px h-12 bg-border/50" />
            <div className="text-center px-4">
              <p className="text-4xl font-display text-gradient-gold">{totalGifts}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Gifts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {guests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-4">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, delay: 0.2 }}
            className="w-24 h-24 rounded-3xl bg-gradient-gold-subtle flex items-center justify-center mb-6 glow-gold"
          >
            <Sparkles className="w-12 h-12 text-primary animate-glow" />
          </motion.div>
          <p className="text-2xl font-display text-foreground mb-2">Awaiting Guests</p>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            Click "Start Scanning" to begin checking in your distinguished guests
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="elegant-table">
            <thead>
              <tr>
                <th className="w-12">#</th>
                <th>Guest Name</th>
                <th>Contact</th>
                <th className="text-center">Party</th>
                <th className="text-center">Gifts</th>
                <th>Arrival</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {guests.map((guest, index) => (
                  <motion.tr
                    key={guest.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, delay: index === 0 ? 0 : 0.03 }}
                    className={index === 0 && guests.length > 1 ? 'bg-gradient-gold-subtle' : ''}
                  >
                    <td className="text-muted-foreground font-mono text-xs">
                      {String(guests.length - index).padStart(2, '0')}
                    </td>
                    <td>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-foreground">
                            {guest.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-foreground">{guest.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4 text-primary/60" />
                        <span className="font-mono text-sm">{guest.phone}</span>
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground text-xs font-medium">
                        <Users className="w-3.5 h-3.5" />
                        {guest.partySize}
                      </span>
                    </td>
                    <td className="text-center">
                      {guest.giftCount > 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-gold text-primary-foreground text-xs font-medium">
                          <Gift className="w-3.5 h-3.5" />
                          {guest.giftCount}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground text-xs">
                          0
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4 text-primary/60" />
                        <span className="font-mono text-sm">{formatTime(guest.checkedInAt)}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default GuestTable;
