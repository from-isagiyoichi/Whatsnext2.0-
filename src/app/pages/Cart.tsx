import { ArrowLeft, Trash2, CreditCard } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { Event } from "../data/events";
import { addNotification } from "../data/notifications";

interface CartItem {
  event: Event;
  ticketType: "earlyBird" | "regular";
  quantity: number;
}

export function Cart() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Get existing cart from localStorage
    const savedCart = localStorage.getItem("cart");
    const existingCart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

    // Add new item from location state
    if (location.state?.event && location.state?.ticketType) {
      const { event, ticketType } = location.state;
      const existingItemIndex = existingCart.findIndex(
        (item) => item.event.id === event.id && item.ticketType === ticketType
      );

      if (existingItemIndex >= 0) {
        existingCart[existingItemIndex].quantity += 1;
      } else {
        existingCart.push({ event, ticketType, quantity: 1 });
      }

      setCartItems(existingCart);
      localStorage.setItem("cart", JSON.stringify(existingCart));
    } else {
      setCartItems(existingCart);
    }
  }, [location.state]);

  const removeItem = (index: number) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const updateQuantity = (index: number, delta: number) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity += delta;
    if (updatedCart[index].quantity <= 0) {
      updatedCart.splice(index, 1);
    }
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const getItemPrice = (item: CartItem) => {
    const price = typeof item.event.price === 'number' 
      ? item.event.price 
      : item.event.price[item.ticketType];
    return price * item.quantity;
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + getItemPrice(item), 0);
  };

  const handleCheckout = () => {
    // Save items to "My Tickets"
    const bookedTickets = localStorage.getItem("bookedTickets");
    const existingTickets = bookedTickets ? JSON.parse(bookedTickets) : [];
    const newTickets = cartItems.map(item => ({
      ...item,
      bookingDate: new Date().toISOString(),
      bookingId: `BK${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    }));
    localStorage.setItem("bookedTickets", JSON.stringify([...existingTickets, ...newTickets]));
    
    // Add Notification
    addNotification({
      title: "Booking Confirmed",
      message: `You have successfully booked ${cartItems.length} ticket(s). Check your tickets section.`,
      type: "success"
    });

    // Clear cart
    setCartItems([]);
    localStorage.setItem("cart", JSON.stringify([]));
    
    // Navigate to tickets
    navigate("/tickets");
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-red-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-yellow-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-md mx-auto pb-32 relative z-10">
        {/* Header */}
        <div className="sticky top-0 bg-black/80 backdrop-blur-md z-10 border-b border-white/10">
          <div className="flex items-center gap-4 p-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors active:scale-95 border border-white/10"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-white text-xl font-bold tracking-wide">Cart</h1>
          </div>
        </div>

        {/* Cart Items */}
        <div className="p-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                <CreditCard className="w-10 h-10 text-white/40" />
              </div>
              <p className="text-white/60 text-lg mb-6">Your cart is empty</p>
              <button
                onClick={() => navigate("/")}
                className="bg-yellow-500 text-black px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors active:scale-95 shadow-lg shadow-yellow-500/20"
              >
                Browse Events
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/5 rounded-2xl p-4 border border-white/10"
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.event.image}
                        alt={item.event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold mb-1 truncate">
                        {item.event.title}
                      </h3>
                      <p className="text-white/60 text-sm mb-2 capitalize">
                        {item.ticketType === "earlyBird" ? "Early Bird" : "Regular"} Ticket
                      </p>
                      <p className="text-white font-bold">
                        ₹{typeof item.event.price === 'number' ? item.event.price : item.event.price[item.ticketType]}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(index)}
                      className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center hover:bg-red-600/30 transition-colors active:scale-95 border border-red-600/30"
                    >
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <span className="text-white/60 text-sm">Quantity</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(index, -1)}
                        className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors active:scale-95"
                      >
                        <span className="text-white text-lg">−</span>
                      </button>
                      <span className="text-white font-semibold w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(index, 1)}
                        className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors active:scale-95"
                      >
                        <span className="text-white text-lg">+</span>
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
                    <span className="text-white/60 text-sm">Subtotal</span>
                    <span className="text-white font-bold text-lg">
                      ₹{getItemPrice(item)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fixed Bottom Checkout */}
        {cartItems.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/10">
            <div className="max-w-md mx-auto px-4 py-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/60">Total Amount</span>
                <span className="text-white text-2xl font-bold">
                  ₹{getTotalPrice()}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-red-600 text-white py-4 rounded-full flex items-center justify-center gap-3 font-bold text-lg hover:bg-red-700 transition-colors active:scale-95 shadow-lg shadow-red-600/20"
              >
                <CreditCard className="w-5 h-5" />
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}