import { motion, AnimatePresence } from 'framer-motion';
import { Users, Gift, Phone, Clock, User } from 'lucide-react';
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

  const giftCount = guests.filter(g => g.gift).length;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-serif text-2xl text-foreground">Guest Registry</h2>
              <p className="text-sm text-muted-foreground">Guests who have checked in</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-serif text-primary">{guests.length}</p>
              <p className="text-xs text-muted-foreground">Present</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-serif text-primary">{giftCount}</p>
              <p className="text-xs text-muted-foreground">Gifts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {guests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-muted-foreground" />
          </div>
          <p className="text-lg font-serif text-foreground mb-1">No guests yet</p>
          <p className="text-sm text-muted-foreground text-center">
            Click "Start Scanning" to begin checking in guests
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="elegant-table">
            <thead>
              <tr>
                <th className="w-12">#</th>
                <th>Name</th>
                <th>Phone</th>
                <th className="text-center">Gift</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {guests.map((guest, index) => (
                  <motion.tr
                    key={guest.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: index === 0 ? 0 : 0.02 }}
                    className={index === 0 && guests.length > 1 ? 'bg-primary/5' : ''}
                  >
                    <td className="text-muted-foreground font-mono text-xs">
                      {guests.length - index}
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {guest.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-foreground">{guest.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{guest.phone}</span>
                      </div>
                    </td>
                    <td className="text-center">
                      {guest.gift ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          <Gift className="w-3 h-3" />
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-secondary text-muted-foreground text-xs">
                          No
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatTime(guest.checkedInAt)}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GuestTable;
