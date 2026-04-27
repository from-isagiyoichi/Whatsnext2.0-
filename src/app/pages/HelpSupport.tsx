import { ArrowLeft, Phone, Mail, FileText } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";

export function HelpSupport() {
  const navigate = useNavigate();
  const [showTerms, setShowTerms] = useState(false);

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
            <h1 className="text-white text-xl font-bold tracking-wide">Help & Support</h1>
          </div>
        </div>

        {/* Contact Information */}
        <div className="px-4 pt-6 mb-6">
          <h2 className="text-white text-lg font-bold mb-4 tracking-wide">Contact Us</h2>
          <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden">
            {/* Phone */}
            <a
              href="tel:+914712591920"
              className="flex items-center gap-4 p-5 hover:bg-white/5 transition-colors active:scale-98"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                <Phone className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-white/60 text-xs mb-1">Support Helpline</p>
                <p className="text-white text-sm font-medium">+91 471 259 1920</p>
              </div>
            </a>

            <div className="h-px bg-white/10 mx-5" />

            {/* Email */}
            <a
              href="mailto:support@mbcet.ac.in"
              className="flex items-center gap-4 p-5 hover:bg-white/5 transition-colors active:scale-98"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-yellow-500/10 rounded-full flex items-center justify-center border border-yellow-500/20">
                <Mail className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="flex-1">
                <p className="text-white/60 text-xs mb-1">Email Support</p>
                <p className="text-white text-sm font-medium">support@mbcet.ac.in</p>
              </div>
            </a>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="px-4 mb-6">
          <button
            onClick={() => setShowTerms(!showTerms)}
            className="w-full bg-white/5 rounded-3xl border border-white/10 p-5 hover:bg-white/5 transition-colors active:scale-98"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600/20 to-red-600/10 rounded-full flex items-center justify-center border border-red-600/20">
                <FileText className="w-5 h-5 text-red-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-white font-medium">Terms & Conditions</p>
                <p className="text-white/60 text-xs">Tap to view full terms</p>
              </div>
              <div className="w-6 h-6 flex items-center justify-center">
                <span className={`text-white/40 transition-transform ${showTerms ? 'rotate-90' : ''}`}>›</span>
              </div>
            </div>
          </button>

          {showTerms && (
            <div className="mt-4 bg-white/5 rounded-3xl border border-white/10 p-5">
              <div className="text-white/80 text-xs leading-relaxed space-y-4">
                <p className="font-semibold text-white text-sm">Terms and Conditions for MBCET Events App</p>
                
                <p>
                  By accessing or using MBCET Events, the official platform for booking tickets to college events, you agree to these Terms and Conditions.
                </p>

                <div>
                  <p className="font-semibold text-white/90 mb-1">1. User Eligibility & Account</p>
                  <p>
                    You must be a registered student, staff member, or authorized guest and provide accurate information when creating an account or booking tickets.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-white/90 mb-1">2. Ticket Booking & Payment</p>
                  <p>
                    All bookings are subject to availability. Where applicable, payment must be completed successfully to confirm a reservation; confirmation will be sent via email or in-app notification.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-white/90 mb-1">3. Ticket Types & Pricing</p>
                  <p>
                    Early Bird tickets are available at a discounted rate until 3 days before the event date. Regular tickets are available at standard pricing.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-white/90 mb-1">4. Ticket Transfers & Event Rules</p>
                  <p>
                    Tickets are non-transferable unless stated otherwise and may be subject to specific event rules set by organizers.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-white/90 mb-1">5. Refunds & Cancellations</p>
                  <p>
                    Refunds and cancellations are governed by the individual event's policy, and some tickets may be non-refundable.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-white/90 mb-1">6. Event Changes & Liability</p>
                  <p>
                    The college or event organizers reserve the right to modify, reschedule, or cancel events, and the app is not liable for such changes, payment gateway failures, or any loss, injury, or damages arising from event participation.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-white/90 mb-1">7. Code of Conduct</p>
                  <p>
                    Users must comply with the college's code of conduct at all times, and violations may result in removal from events without refund and possible account suspension.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-white/90 mb-1">8. Intellectual Property</p>
                  <p>
                    All app content, branding, and materials are the property of the college or its licensors and may not be copied or distributed without permission.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-white/90 mb-1">9. Privacy & Data Usage</p>
                  <p>
                    By using the app, you consent to the collection and use of your information for booking and communication purposes in accordance with the Privacy Policy.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-white/90 mb-1">10. Changes to Terms</p>
                  <p>
                    These Terms may be updated at any time, and continued use of the app constitutes acceptance of any changes.
                  </p>
                </div>

                <p className="text-white/60 text-[10px] mt-4">
                  Last updated: February 28, 2026
                </p>
              </div>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="px-4 mb-6">
          <h2 className="text-white text-lg font-bold mb-4 tracking-wide">Frequently Asked Questions</h2>
          <div className="space-y-3">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
              <p className="text-white font-medium text-sm mb-2">What is Early Bird pricing?</p>
              <p className="text-white/70 text-xs leading-relaxed">
                Early Bird tickets are available at a discounted rate until 3 days before the event date. Once the deadline passes, only Regular tickets will be available.
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
              <p className="text-white font-medium text-sm mb-2">Can I transfer my ticket to someone else?</p>
              <p className="text-white/70 text-xs leading-relaxed">
                Tickets are generally non-transferable unless specified otherwise by the event organizer. Contact support for specific event policies.
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
              <p className="text-white font-medium text-sm mb-2">How do I contact program coordinators?</p>
              <p className="text-white/70 text-xs leading-relaxed">
                You can find coordinator contact information on each event details page. All coordinators use official @mbcet.ac.in email addresses.
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
              <p className="text-white font-medium text-sm mb-2">What if an event is cancelled?</p>
              <p className="text-white/70 text-xs leading-relaxed">
                If an event is cancelled or rescheduled, you will be notified via email or in-app notification. Refund policies vary by event.
              </p>
            </div>
          </div>
        </div>

        {/* Support Hours */}
        <div className="px-4">
          <div className="bg-gradient-to-br from-yellow-500/10 to-red-600/10 rounded-2xl border border-white/10 p-4">
            <p className="text-white font-medium text-sm mb-2">Support Hours</p>
            <p className="text-white/70 text-xs leading-relaxed">
              Monday - Friday: 9:00 AM - 6:00 PM<br />
              Saturday: 10:00 AM - 4:00 PM<br />
              Sunday & Holidays: Closed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}