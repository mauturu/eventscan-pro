import { useState } from "react";
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

const App = () => {
  const [eventName, setEventName] = useState("Event Check-In");
  const [guests, setGuests] = useState<Guest[]>([]);

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
