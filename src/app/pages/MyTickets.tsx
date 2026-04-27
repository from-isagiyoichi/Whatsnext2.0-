import { ArrowLeft, QrCode, Calendar, MapPin, Ticket } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

interface BookedTicket {
  event: {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    date: string;
    venue: string;
  };
  ticketType: "earlyBird" | "regular";
  quantity: number;
  bookingDate: string;
  bookingId: string;
}

export function MyTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<BookedTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<BookedTicket | null>(null);

  useEffect(() => {
    const bookedTickets = localStorage.getItem("bookedTickets");
    if (bookedTickets) {
      setTickets(JSON.parse(bookedTickets));
    }
  }, []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-red-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-yellow-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-md mx-auto pb-8 relative z-10">
        {/* Header */}
        <div className="sticky top-0 bg-black/80 backdrop-blur-md z-10 border-b border-white/10">
          <div className="flex items-center gap-4 p-4">
            <button
              onClick={() => navigate("/profile")}
              className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors active:scale-95 border border-white/10"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-white text-xl font-bold tracking-wide">My Tickets</h1>
          </div>
        </div>

        {/* Tickets List */}
        <div className="p-4">
          {tickets.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                <Ticket className="w-10 h-10 text-white/40" />
              </div>
              <p className="text-white/60 text-lg mb-2">No tickets booked yet</p>
              <p className="text-white/40 text-sm mb-6">
                Book your first event to see tickets here
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-yellow-500 text-black px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors active:scale-95 shadow-lg shadow-yellow-500/20"
              >
                Browse Events
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedTicket(ticket)}
                  className="bg-gradient-to-br from-red-600/20 to-yellow-500/20 rounded-3xl p-5 border border-white/20 cursor-pointer hover:border-yellow-500/50 transition-all active:scale-98 shadow-lg shadow-red-600/10"
                >
                  <div className="flex gap-4 mb-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={ticket.event.image}
                        alt={ticket.event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-lg mb-1 truncate">
                        {ticket.event.title}
                      </h3>
                      <p className="text-white/60 text-sm mb-2 truncate">
                        {ticket.event.subtitle}
                      </p>
                      <div className="inline-block bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/30">
                        <p className="text-yellow-500 text-xs font-bold uppercase tracking-wide">
                          {ticket.ticketType === "earlyBird" ? "Early Bird" : "Regular"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-white/80">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{ticket.event.date}</span>
                    </div>
                    <div className="flex items-start gap-2 text-white/80">
                      <MapPin className="w-4 h-4 mt-0.5" />
                      <span className="text-sm">{ticket.event.venue}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/20">
                    <div>
                      <p className="text-white/60 text-xs mb-1">Booking ID</p>
                      <p className="text-white font-mono text-sm">{ticket.bookingId}</p>
                    </div>
                    <button className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center hover:bg-yellow-500/30 transition-colors border border-yellow-500/30">
                      <QrCode className="w-6 h-6 text-yellow-500" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <p className="text-white/60 text-xs">
                      Quantity: {ticket.quantity} ticket{ticket.quantity > 1 ? 's' : ''}
                    </p>
                    <p className="text-white/60 text-xs">
                      Booked: {new Date(ticket.bookingDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      {selectedTicket && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedTicket(null)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <h2 className="text-gray-900 text-2xl font-bold mb-2">
                {selectedTicket.event.title}
              </h2>
              <p className="text-gray-600 text-sm mb-1">
                {selectedTicket.ticketType === "earlyBird" ? "EARLY BIRD" : "REGULAR"} TICKET
              </p>
              <p className="text-gray-500 text-xs">
                Qty: {selectedTicket.quantity}
              </p>
            </div>

            {/* QR Code Placeholder */}
            <div className="bg-gray-100 aspect-square rounded-2xl flex items-center justify-center mb-6">
              <div className="text-center">
                <QrCode className="w-32 h-32 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">QR Code</p>
                <p className="text-gray-400 text-xs">Scan at venue entrance</p>
              </div>
            </div>

            <div className="bg-gray-100 rounded-2xl p-4 mb-6">
              <p className="text-gray-500 text-xs mb-2">Booking ID</p>
              <p className="text-gray-900 font-mono font-semibold">
                {selectedTicket.bookingId}
              </p>
            </div>

            <button
              onClick={() => setSelectedTicket(null)}
              className="w-full bg-black text-white py-4 rounded-full font-bold hover:bg-gray-900 transition-colors active:scale-95 shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}