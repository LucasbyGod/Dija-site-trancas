import React, { useState, useEffect } from 'react';
import { 
  X, Check, Calendar as CalendarIcon, Clock, User, Phone, 
  AlertCircle, Copy, CheckCheck, Send, ArrowLeft, ArrowRight, Sparkles, CheckCircle2 
} from 'lucide-react';
import { ServiceItem, ServiceOption, Appointment } from '../types';
import { SERVICES_CATALOG } from '../data/services';
import { 
  validateBrazilianPhone, 
  formatPhoneLive, 
  formatToStandardPattern 
} from '../utils/phoneValidation';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedService?: ServiceItem | null;
  preSelectedOption?: ServiceOption | null;
  onAppointmentBooked: (appointment: Appointment) => void;
  existingAppointments?: Appointment[];
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preSelectedService,
  preSelectedOption,
  onAppointmentBooked,
  existingAppointments = [],
}) => {
  const [step, setStep] = useState<number>(1);

  // Step 1: Selected Service & Option
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(preSelectedService || SERVICES_CATALOG[0]);
  const [selectedOption, setSelectedOption] = useState<ServiceOption | undefined>(
    preSelectedOption || (selectedService?.options ? selectedService.options[0] : undefined)
  );

  // Step 2: Date & Time
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  // Step 3: Client Info & Validation
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientNotes, setClientNotes] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneConfirmed, setPhoneConfirmed] = useState<boolean>(false);

  // Step 4: PIX & Final Confirmation
  const [copiedPix, setCopiedPix] = useState<boolean>(false);
  const [bookingCompleted, setBookingCompleted] = useState<boolean>(false);

  // Sync state when preSelectedService changes
  useEffect(() => {
    if (preSelectedService) {
      setSelectedService(preSelectedService);
      setSelectedOption(preSelectedOption || (preSelectedService.options ? preSelectedService.options[0] : undefined));
    }
  }, [preSelectedService, preSelectedOption]);

  // Set default minimum date (tomorrow)
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    setSelectedDate(dateString);
    setSelectedTimeSlot('09:30');
  }, []);

  if (!isOpen) return null;

  const currentPrice = selectedOption ? selectedOption.price : (selectedService ? selectedService.basePrice : 0);
  const depositAmount = 50.00;
  const remainingAmount = Math.max(0, currentPrice - depositAmount);

  // Available slots for Segunda a Domingo (08:00 às 22:00)
  const timeSlots = [
    { time: '08:00', period: 'Manhã' },
    { time: '09:30', period: 'Manhã' },
    { time: '11:00', period: 'Manhã' },
    { time: '13:00', period: 'Tarde' },
    { time: '14:30', period: 'Tarde' },
    { time: '16:00', period: 'Tarde' },
    { time: '17:30', period: 'Tarde' },
    { time: '19:00', period: 'Noite' },
    { time: '20:30', period: 'Noite' },
  ];

  // Helper to check if a slot is already booked on the selected date
  const isSlotBooked = (date: string, time: string) => {
    if (!existingAppointments || existingAppointments.length === 0) return false;
    return existingAppointments.some((apt) => apt.date === date && apt.timeSlot === time);
  };

  const pixKey = '8591002233';

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleFinishBooking = () => {
    if (!selectedService || !selectedDate || !selectedTimeSlot || !clientName.trim() || !clientPhone.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const phoneResult = validateBrazilianPhone(clientPhone);
    const validPhone = phoneResult.isValid ? phoneResult.formatted : clientPhone.trim();

    const newAppointment: Appointment = {
      id: 'apt_' + Date.now(),
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      selectedOption: selectedOption ? selectedOption.label : undefined,
      totalPrice: currentPrice,
      depositAmount: depositAmount,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      clientName: clientName.trim(),
      clientPhone: validPhone,
      notes: clientNotes.trim() || undefined,
      createdAt: new Date().toISOString(),
      pixVerified: false,
    };

    onAppointmentBooked(newAppointment);
    setBookingCompleted(true);

    // Format WhatsApp message to owner (85 9100-2233)
    const formattedDate = new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const messageLines = [
      `👑 *NOVO AGENDAMENTO - ESTÚDIO DIJA TRANÇAS*`,
      ``,
      `Olá, Dija! Acabei de fazer minha reserva pelo site:`,
      `👤 *Cliente:* ${clientName.trim()}`,
      `📱 *WhatsApp:* ${validPhone}`,
      `✨ *Procedimento:* ${selectedService.name}${selectedOption ? ` (${selectedOption.label})` : ''}`,
      `📅 *Data Escolhida:* ${formattedDate}`,
      `⏰ *Horário:* ${selectedTimeSlot}`,
      `💰 *Valor Total:* R$ ${currentPrice.toFixed(2).replace('.', ',')}`,
      `🔒 *Sinal de Reserva:* R$ 50,00 (pago via PIX 8591002233)`,
      `💵 *Saldo Restante no Salão:* R$ ${remainingAmount.toFixed(2).replace('.', ',')}`,
      clientNotes.trim() ? `📝 *Observação:* ${clientNotes.trim()}` : null,
      ``,
      `Estou enviando o comprovante do sinal de R$ 50,00 para confirmação definitiva da minha vaga!`,
    ].filter(Boolean).join('\n');

    const whatsappUrl = `https://wa.me/558591002233?text=${encodeURIComponent(messageLines)}`;
    
    // Open WhatsApp in new tab / application
    window.open(whatsappUrl, '_blank');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const formatted = formatPhoneLive(rawVal);
    setClientPhone(formatted);

    // Clear error while typing
    if (phoneError) setPhoneError(null);

    // Live validation check for visual feedback
    const result = validateBrazilianPhone(formatted);
    setPhoneConfirmed(result.isValid);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientName(e.target.value);
    if (nameError) setNameError(null);
  };

  const nextStep = () => {
    if (step === 1 && !selectedService) return;
    if (step === 2) {
      if (!selectedDate || !selectedTimeSlot) {
        alert('Por favor, selecione uma data e um horário disponível.');
        return;
      }
      if (isSlotBooked(selectedDate, selectedTimeSlot)) {
        alert('Este horário já foi reservado por outra cliente nesta data. Por favor, escolha outro horário disponível.');
        return;
      }
    }
    if (step === 3) {
      const trimmedName = clientName.trim();
      if (!trimmedName || trimmedName.length < 3) {
        setNameError('Por favor, informe seu nome completo para a identificação do agendamento.');
        return;
      }
      setNameError(null);

      // Validate phone number according to mandatory rules:
      // 1. DDD (2 digits) + 8 or 9 digits (total 10 or 11 digits).
      // 2. Spaces, parens, dashes, '+' ignored.
      // 3. If invalid (letters, <10 digits, fake or incomplete), DO NOT ADVANCE! Politely explain and ask again.
      // 4. Once valid, format in standard pattern (XX) 9XXXX-XXXX and confirm receipt.
      const phoneResult = validateBrazilianPhone(clientPhone);
      if (!phoneResult.isValid) {
        setPhoneError(phoneResult.error);
        setPhoneConfirmed(false);
        return; // DO NOT ADVANCE!
      }

      // Format strictly as standard (XX) 9XXXX-XXXX / (XX) XXXX-XXXX
      setClientPhone(phoneResult.formatted);
      setPhoneError(null);
      setPhoneConfirmed(true);
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#121215] border-2 border-[#D4AF37]/40 rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.8)] overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-[#18181D] px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="font-display font-bold text-white text-base sm:text-lg">
              Agendamento Online Didático · Estúdio Dija
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        {!bookingCompleted && (
          <div className="px-6 py-3 bg-[#15151A] border-b border-zinc-800/80">
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {[
                { s: 1, label: '1. Serviço' },
                { s: 2, label: '2. Data & Hora' },
                { s: 3, label: '3. Seus Dados' },
                { s: 4, label: '4. Sinal & PIX' },
              ].map(({ s, label }) => (
                <div
                  key={s}
                  className={`py-1.5 px-1 rounded-lg border text-[11px] font-semibold transition-all ${
                    step === s
                      ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-sm'
                      : step > s
                      ? 'bg-[#1F1D16] text-[#F3D079] border-[#D4AF37]/40'
                      : 'bg-[#18181B] text-zinc-500 border-zinc-800'
                  }`}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          {bookingCompleted ? (
            /* Success Screen */
            <div className="text-center py-8 space-y-5">
              <div className="w-16 h-16 bg-[#D4AF37]/20 border-2 border-[#D4AF37] rounded-full mx-auto flex items-center justify-center text-[#F3D079]">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div className="space-y-2">
                <h4 className="font-display text-2xl font-bold text-white">Reserva Registrada com Sucesso!</h4>
                <p className="text-sm text-zinc-300 max-w-md mx-auto">
                  A janela do WhatsApp foi aberta para você enviar o comprovante do sinal de R$ 50,00 diretamente para a Dija.
                </p>
              </div>

              <div className="bg-[#18181F] border border-[#D4AF37]/30 rounded-xl p-4 text-xs text-left max-w-md mx-auto space-y-2">
                <div className="flex justify-between border-b border-zinc-800 pb-1.5">
                  <span className="text-zinc-400">Cliente:</span>
                  <span className="text-white font-medium">{clientName}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-1.5">
                  <span className="text-zinc-400">Serviço:</span>
                  <span className="text-white font-medium">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-1.5">
                  <span className="text-zinc-400">Data e Horário:</span>
                  <span className="text-white font-medium">
                    {new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR')} às {selectedTimeSlot}
                  </span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-1.5">
                  <span className="text-zinc-400">Sinal Obrigatório:</span>
                  <span className="text-[#F3D079] font-bold">R$ 50,00</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-zinc-400">Localização:</span>
                  <span className="text-zinc-300">Rua Desembargador Praxedes 171, Damas</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={onClose}
                  className="gold-gradient-btn px-6 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Concluir e Fechar
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* STEP 1: Service Selection & Options */}
              {step === 1 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    Passo 1: Selecione ou confirme o procedimento desejado
                  </h4>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {SERVICES_CATALOG.map((serv) => {
                      const isSelected = selectedService?.id === serv.id;
                      return (
                        <div
                          key={serv.id}
                          onClick={() => {
                            setSelectedService(serv);
                            setSelectedOption(serv.options ? serv.options[0] : undefined);
                          }}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-white shadow-sm'
                              : 'bg-[#16161A] border-zinc-800 text-zinc-300 hover:border-zinc-700'
                          }`}
                        >
                          <div>
                            <p className="font-semibold text-xs sm:text-sm">{serv.name}</p>
                            <p className="text-[11px] text-zinc-400 line-clamp-1">{serv.description}</p>
                          </div>
                          <span className="text-[#F3D079] font-bold text-xs sm:text-sm tabular-nums shrink-0 ml-2">
                            R$ {serv.basePrice.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Variation Options for selected service */}
                  {selectedService?.options && selectedService.options.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-zinc-800 space-y-2">
                      <label className="text-xs font-semibold text-[#F3D079] uppercase tracking-wider block">
                        Escolha a opção / pacote do procedimento:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedService.options.map((opt) => {
                          const isOptSelected = selectedOption?.id === opt.id;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => setSelectedOption(opt)}
                              className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                                isOptSelected
                                  ? 'bg-[#D4AF37]/25 border-[#D4AF37] text-white font-medium'
                                  : 'bg-[#18181D] border-zinc-800 text-zinc-400 hover:text-white'
                              }`}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-zinc-200">{opt.label}</span>
                                <span className="text-[#F3D079] font-bold tabular-nums">
                                  R$ {opt.price.toFixed(2).replace('.', ',')}
                                </span>
                              </div>
                              {opt.description && (
                                <p className="text-[10px] text-zinc-400">{opt.description}</p>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Price Banner */}
                  <div className="mt-4 p-3 bg-[#18181E] border border-zinc-800 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Valor Estimado do Procedimento:</span>
                    <span className="text-base font-bold text-[#F3D079] tabular-nums font-display">
                      R$ {currentPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 2: Date & Available Slots */}
              {step === 2 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    Passo 2: Escolha a data e o horário disponível
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-zinc-300 block mb-1.5 flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                        Selecione a Data Desejada:
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full bg-[#18181D] border border-zinc-700 rounded-xl p-3 text-sm text-white focus:border-[#D4AF37] outline-none"
                      />
                      <p className="text-[11px] text-zinc-400 mt-1">
                        * Atendimento de <strong>Segunda a Domingo, das 08:00 às 22:00</strong> no Bairro Damas.
                      </p>
                    </div>

                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                          Horários Disponíveis (08:00 às 22:00):
                        </label>
                        <span className="text-[11px] text-[#F3D079] font-medium">
                          Segunda a Domingo
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2.5">
                        {timeSlots.map((slot) => {
                          const isBooked = isSlotBooked(selectedDate, slot.time);
                          const isSlotSelected = selectedTimeSlot === slot.time && !isBooked;

                          return (
                            <button
                              key={slot.time}
                              type="button"
                              disabled={isBooked}
                              onClick={() => {
                                if (!isBooked) {
                                  setSelectedTimeSlot(slot.time);
                                }
                              }}
                              className={`p-2.5 rounded-xl border text-center transition-all ${
                                isBooked
                                  ? 'bg-zinc-900/60 border-zinc-800/80 text-zinc-600 cursor-not-allowed opacity-60'
                                  : isSlotSelected
                                  ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-bold shadow-md cursor-pointer'
                                  : 'bg-[#18181D] border-zinc-800 text-zinc-300 hover:border-zinc-600 cursor-pointer'
                              }`}
                              title={isBooked ? 'Este horário já foi reservado nesta data' : `Disponível às ${slot.time}`}
                            >
                              <span className={`text-xs sm:text-sm block tabular-nums ${isBooked ? 'line-through text-zinc-500' : ''}`}>
                                {slot.time}
                              </span>
                              <span className={`text-[10px] uppercase tracking-wider block font-semibold ${
                                isBooked
                                  ? 'text-red-400/90'
                                  : isSlotSelected
                                  ? 'text-black/85'
                                  : 'text-zinc-500'
                              }`}>
                                {isBooked ? 'Ocupado' : slot.period}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Status Legend */}
                      <div className="mt-3 pt-2.5 border-t border-zinc-800/70 flex items-center justify-between text-[11px] text-zinc-400">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                          <span>Selecionado</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#18181D] border border-zinc-600" />
                          <span>Disponível</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-red-500/60" />
                          <span className="text-red-400/80 font-medium">Ocupado (Bloqueado)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Client Information & Telephone Validation */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      Passo 3: Dados de Identificação do Cliente
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Informe seus dados para contato e emissão do comprovante de reserva.
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    {/* Client Name */}
                    <div>
                      <label className="text-xs font-semibold text-zinc-300 block mb-1 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={handleNameChange}
                        placeholder="Ex: Ana Clara Silva"
                        className={`w-full bg-[#18181D] border rounded-xl p-3 text-sm text-white outline-none transition-colors ${
                          nameError ? 'border-red-500 focus:border-red-400' : 'border-zinc-700 focus:border-[#D4AF37]'
                        }`}
                        required
                      />
                      {nameError && (
                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{nameError}</span>
                        </p>
                      )}
                    </div>

                    {/* Client Phone / WhatsApp with DDD */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                          Telefone / WhatsApp com DDD *
                        </label>
                        <span className="text-[11px] text-[#D4AF37] font-medium">
                          10 ou 11 dígitos com DDD
                        </span>
                      </div>

                      <div className="relative">
                        <input
                          type="tel"
                          value={clientPhone}
                          onChange={handlePhoneChange}
                          placeholder="Ex: (85) 99876-5432 ou 85998765432"
                          className={`w-full bg-[#18181D] border rounded-xl p-3 text-sm text-white font-mono tracking-wide outline-none transition-all ${
                            phoneError
                              ? 'border-red-500/80 bg-red-950/10 focus:border-red-400'
                              : phoneConfirmed
                              ? 'border-emerald-500/80 bg-emerald-950/10 focus:border-emerald-400'
                              : 'border-zinc-700 focus:border-[#D4AF37]'
                          }`}
                          required
                        />
                        {phoneConfirmed && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          </div>
                        )}
                      </div>

                      {/* Rule Explanation */}
                      <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                        Insira o DDD (2 dígitos) seguido de 8 ou 9 dígitos (ex: <span className="text-zinc-200">85998765432</span>). Espaços, traços, parênteses e o caractere '+' são aceitos e formatados automaticamente.
                      </p>

                      {/* Error Banner when invalid */}
                      {phoneError && (
                        <div className="mt-2 p-3 bg-red-950/60 border border-red-500/60 rounded-xl text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <p className="font-semibold text-white">Número de telefone inválido:</p>
                            <p className="leading-relaxed text-red-300">{phoneError}</p>
                            <p className="text-[11px] text-red-400/90 pt-0.5">
                              Por favor, digite novamente informando o DDD válido de 2 dígitos e seu número de telefone.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Positive Confirmation Banner when valid */}
                      {phoneConfirmed && !phoneError && (
                        <div className="mt-2 p-3 bg-emerald-950/50 border border-emerald-500/60 rounded-xl text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div>
                            <span className="font-semibold text-emerald-300">Número válido recebido e confirmado: </span>
                            <strong className="text-white font-mono bg-emerald-900/60 px-1.5 py-0.5 rounded border border-emerald-500/40">
                              {validateBrazilianPhone(clientPhone).formatted}
                            </strong>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Client Notes */}
                    <div>
                      <label className="text-xs font-semibold text-zinc-300 block mb-1">
                        Observações sobre o cabelo ou cor desejada (opcional)
                      </label>
                      <textarea
                        rows={2}
                        value={clientNotes}
                        onChange={(e) => setClientNotes(e.target.value)}
                        placeholder="Ex: Cabelo curto, prefiro tom mel ou castanho iluminado..."
                        className="w-full bg-[#18181D] border border-zinc-700 rounded-xl p-3 text-sm text-white focus:border-[#D4AF37] outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Rule of Deposit (Sinal R$ 50) & PIX Instructions */}
              {step === 4 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    Passo 4: Confirmação da Reserva & Regra do Sinal
                  </h4>

                  {/* Mandatory Transparent Warning Box */}
                  <div className="bg-[#241A0B] border-2 border-[#D4AF37] rounded-xl p-4 space-y-2 text-zinc-100">
                    <div className="flex items-center gap-2 text-[#F3D079] font-bold text-xs uppercase tracking-wide">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Termo de Reserva e Garantia de Vaga</span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium leading-relaxed">
                      "Para garantir a sua vaga, é necessário o pagamento de um sinal de <strong className="text-white underline">R$ 50,00</strong>. O valor do adiantamento não será devolvido sob nenhuma justificativa, pois é destinado à reserva exclusiva do seu horário."
                    </p>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="bg-[#16161A] border border-zinc-800 rounded-xl p-4 text-xs space-y-2">
                    <div className="flex justify-between text-zinc-300">
                      <span>Procedimento Escolhido:</span>
                      <span className="font-semibold text-white">{selectedService?.name}</span>
                    </div>
                    {selectedOption && (
                      <div className="flex justify-between text-zinc-400">
                        <span>Variação/Pacote:</span>
                        <span>{selectedOption.label}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-zinc-300">
                      <span>Data & Horário:</span>
                      <span className="font-semibold text-white">
                        {new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR')} às {selectedTimeSlot}
                      </span>
                    </div>
                    <div className="flex justify-between text-zinc-300 border-t border-zinc-800 pt-2">
                      <span>Valor Total do Serviço:</span>
                      <span className="font-bold text-white tabular-nums">
                        R$ {currentPrice.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#F3D079] font-semibold">
                      <span>Sinal PIX para Garantir Vaga (Agora):</span>
                      <span className="tabular-nums font-bold">R$ 50,00</span>
                    </div>
                    <div className="flex justify-between text-zinc-400 text-[11px] pt-1">
                      <span>Restante a pagar no dia no salão:</span>
                      <span className="tabular-nums">R$ {remainingAmount.toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>

                  {/* PIX Copy & Paste Box */}
                  <div className="bg-[#121216] border border-[#D4AF37]/50 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#F3D079] uppercase tracking-wide">
                        Chave PIX Oficial (Telefone):
                      </span>
                      <span className="text-[10px] text-zinc-400">Titular: Dija Tranças</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-[#09090B] border border-zinc-700 rounded-lg px-3 py-2 text-sm font-mono font-semibold text-zinc-200 flex-1 tracking-wider">
                        {pixKey}
                      </div>
                      <button
                        onClick={handleCopyPix}
                        className="gold-gradient-btn px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        {copiedPix ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedPix ? 'Copiado!' : 'Copiar PIX'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step Navigation Controls */}
              <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between gap-3">
                {step > 1 ? (
                  <button
                    onClick={prevStep}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-[#18181D] hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Voltar</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    onClick={nextStep}
                    className="gold-gradient-btn px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <span>Continuar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinishBooking}
                    className="gold-gradient-btn px-6 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-lg hover:scale-[1.02] transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Finalizar e Enviar via WhatsApp</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
