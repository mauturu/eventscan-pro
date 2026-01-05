import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { toast } from "sonner";
import Index from "./pages/Index";
import GenerateQR from "./pages/GenerateQR";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { Guest } from "./types/guest";

const queryClient = new QueryClient();

const STORAGE_KEY_GUESTS = "event-checkin-guests";
const STORAGE_KEY_EVENT = "event-checkin-name";

const App = () => {
  const [eventName, setEventName] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_EVENT);
    return saved || "Event Check-In";
  });
  
  const [guests, setGuests] = useState<Guest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_GUESTS);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return parsed.map((g: any) => ({
      ...g,
      checkedInAt: new Date(g.checkedInAt),
      partySize: g.partySize ?? 1,
      giftCount: g.giftCount ?? (g.gift ? 1 : 0),
    }));
  });

  // Persist guests to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_GUESTS, JSON.stringify(guests));
  }, [guests]);

  // Persist event name to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EVENT, eventName);
  }, [eventName]);

  const handleEventNameChange = (name: string) => {
    setEventName(name);
    toast.success("Event name updated");
  };

  const handleClearGuests = () => {
    setGuests([]);
    toast.success("Guest list cleared");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                <Index 
                  eventName={eventName} 
                  guests={guests} 
                  setGuests={setGuests} 
                />
              } 
            />
            <Route path="/generate" element={<GenerateQR />} />
            <Route 
              path="/admin" 
              element={
                <Admin 
                  eventName={eventName}
                  onEventNameChange={handleEventNameChange}
                  onClearGuests={handleClearGuests}
                  guestCount={guests.length}
                />
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
