import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LoyaltyBanner } from './components/LoyaltyBanner';
import { ServicesCatalog } from './components/ServicesCatalog';
import { CareGuide } from './components/CareGuide';
import { Gallery } from './components/Gallery';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ServiceItem, ServiceOption, Appointment } from './types';
import { SERVICES_CATALOG } from './data/services';
import { MessageCircle, CheckCircle2, Calendar, ShieldCheck, LogOut } from 'lucide-react';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';

function AppContent() {
  const { isAuthenticated, adminUser, logout } = useAdminAuth();

  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [preSelectedService, setPreSelectedService] = useState<ServiceItem | null>(null);
  const [preSelectedOption, setPreSelectedOption] = useState<ServiceOption | null>(null);
  
  // Stored appointments in local state & localStorage
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem('dija_appointments');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('dija_appointments', JSON.stringify(appointments));
    } catch {
      // storage unavailable
    }
  }, [appointments]);

  const handleOpenBooking = () => {
    setPreSelectedService(SERVICES_CATALOG[0]);
    setPreSelectedOption(SERVICES_CATALOG[0].options ? SERVICES_CATALOG[0].options[0] : null);
    setIsBookingOpen(true);
  };

  const handleSelectService = (service: ServiceItem, selectedOption?: ServiceOption) => {
    setPreSelectedService(service);
    setPreSelectedOption(selectedOption || (service.options ? service.options[0] : null));
    setIsBookingOpen(true);
  };

  const handleScheduleStyle = (styleName: string) => {
    const matched = SERVICES_CATALOG.find((s) =>
      s.name.toLowerCase().includes(styleName.toLowerCase()) ||
      styleName.toLowerCase().includes(s.name.toLowerCase())
    );
    setPreSelectedService(matched || SERVICES_CATALOG[0]);
    setPreSelectedOption(matched?.options ? matched.options[0] : null);
    setIsBookingOpen(true);
  };

  const handleAppointmentBooked = (appointment: Appointment) => {
    setAppointments((prev) => [appointment, ...prev]);
    setToastMessage(`Reserva de ${appointment.serviceName} registrada! WhatsApp aberto para envio.`);
    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  };

  const scrollToCatalog = () => {
    const elem = document.getElementById('servicos');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToGallery = () => {
    const elem = document.getElementById('galeria');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-[#FFDF78]">
      
      {/* Persistent Admin Status Bar for Authenticated Owner */}
      {isAuthenticated && (
        <div className="sticky top-0 z-50 bg-[#1E1A0F] border-b border-[#D4AF37] px-4 py-2 text-xs flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-[#F3D079]">Painel da Proprietária Ativo:</span>
            <span className="text-zinc-300 hidden sm:inline">{adminUser?.name} ({adminUser?.email})</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={scrollToGallery}
              className="text-[#F3D079] hover:underline font-medium cursor-pointer"
            >
              Ir para Gerenciar Galeria ↓
            </button>
            <span className="text-zinc-600">|</span>
            <button
              onClick={logout}
              className="text-zinc-400 hover:text-red-400 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 max-w-sm bg-[#18181D] border-2 border-[#D4AF37] rounded-xl p-4 shadow-2xl flex items-start gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
          <div className="text-xs text-white">
            <p className="font-semibold">{toastMessage}</p>
            <p className="text-zinc-400 mt-0.5">Lembre-se de enviar o comprovante do sinal de R$ 50,00.</p>
          </div>
        </div>
      )}

      {/* Top Header */}
      <Navbar onOpenBooking={handleOpenBooking} />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero
          onOpenBooking={handleOpenBooking}
          onExploreCatalog={scrollToCatalog}
        />

        <LoyaltyBanner />

        <ServicesCatalog
          onSelectService={handleSelectService}
        />

        <CareGuide />

        <Gallery
          onScheduleStyle={handleScheduleStyle}
        />

        <ReviewsSection />
      </main>

      {/* Footer with Discreet Admin Entry */}
      <Footer 
        onOpenBooking={handleOpenBooking} 
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
      />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {/* Quick appointments counter pill if client booked */}
        {appointments.length > 0 && (
          <button
            onClick={() => setIsBookingOpen(true)}
            className="bg-[#18181F] border border-[#D4AF37]/60 text-white text-xs px-3.5 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-[#22222A] cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Minhas Reservas ({appointments.length})</span>
          </button>
        )}

        {/* WhatsApp Direct Floating Bubble */}
        <a
          href="https://wa.me/558591002233"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Fale conosco no WhatsApp"
          className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_4px_25px_rgba(37,211,102,0.45)] hover:scale-110 active:scale-95 transition-all"
        >
          <MessageCircle className="w-7 h-7 fill-white stroke-none" />
        </a>
      </div>

      {/* Didactic Step-by-Step Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preSelectedService={preSelectedService}
        preSelectedOption={preSelectedOption}
        onAppointmentBooked={handleAppointmentBooked}
        existingAppointments={appointments}
      />

      {/* Owner Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
          scrollToGallery();
        }}
      />

    </div>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <AppContent />
    </AdminAuthProvider>
  );
}
