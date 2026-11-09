import React, { useState } from 'react';
import { Star, MessageSquare, Plus, Share2, Instagram, CheckCircle2 } from 'lucide-react';
import { Review } from '../types';
import { INITIAL_REVIEWS } from '../data/reviews';

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  
  // New review form state
  const [authorName, setAuthorName] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [serviceName, setServiceName] = useState<string>('Box Braids');
  const [comment, setComment] = useState<string>('');
  const [submittedFeedback, setSubmittedFeedback] = useState<boolean>(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    const newRev: Review = {
      id: 'rev_' + Date.now(),
      author: authorName.trim(),
      rating,
      comment: comment.trim(),
      date: 'Hoje',
      serviceName,
    };

    setReviews([newRev, ...reviews]);
    setSubmittedFeedback(true);
    setTimeout(() => {
      setSubmittedFeedback(false);
      setShowAddForm(false);
      setAuthorName('');
      setComment('');
    }, 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      'Olha que lindo o trabalho do Estúdio Dija Tranças no Damas, Fortaleza! Dá para ver o catálogo com preços e agendar online pelo site: ' + window.location.href
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <section id="avaliacoes" className="py-16 sm:py-24 bg-[#0D0D10] border-t border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#D4AF37] uppercase bg-[#18181B] px-3.5 py-1.5 rounded-full border border-[#D4AF37]/30">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Opinião de Quem Confia</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Depoimentos & Experiências Reais
          </h2>

          <p className="text-sm sm:text-base text-zinc-400">
            A satisfação, o cuidado com a raiz e a autoestima elevada das nossas clientes são o coração do nosso trabalho.
          </p>

          {/* Social Share & Add Review CTA Strip */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="gold-gradient-btn px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddForm ? 'Fechar Formulário' : 'Deixar Minha Avaliação'}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-[#1F2937]/50 hover:bg-[#1F2937] text-zinc-200 border border-zinc-700/80 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-[#25D366]" />
              <span>Compartilhar no WhatsApp</span>
            </button>

            <a
              href="https://instagram.com/dijatrancas"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-medium bg-[#1F2937]/50 hover:bg-[#1F2937] text-zinc-200 border border-zinc-700/80 transition-colors flex items-center gap-2"
            >
              <Instagram className="w-4 h-4 text-[#E1306C]" />
              <span>Seguir @dijatrancas</span>
            </a>
          </div>
        </div>

        {/* Add Review Form Dropdown */}
        {showAddForm && (
          <div className="max-w-xl mx-auto mb-12 bg-[#141418] border-2 border-[#D4AF37]/40 rounded-2xl p-6 shadow-xl">
            {submittedFeedback ? (
              <div className="text-center py-6 text-[#F3D079] space-y-2">
                <CheckCircle2 className="w-10 h-10 mx-auto" />
                <p className="text-sm font-semibold">Obrigada pelo seu carinho! Sua avaliação foi adicionada.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <h3 className="font-display font-bold text-white text-base">
                  Conte como foi sua experiência no Estúdio Dija
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Seu Nome *</label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Ex: Beatriz Lima"
                      className="w-full bg-[#1A1A20] border border-zinc-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Procedimento Realizado</label>
                    <input
                      type="text"
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      placeholder="Ex: Gypsy Braids, Nagô..."
                      className="w-full bg-[#1A1A20] border border-zinc-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Sua Nota:</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= rating
                              ? 'text-[#F3D079] fill-[#F3D079]'
                              : 'text-zinc-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Seu Comentário *</label>
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Conte sobre o atendimento, o resultado, a durabilidade..."
                    className="w-full bg-[#1A1A20] border border-zinc-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#D4AF37] resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full gold-gradient-btn py-2.5 rounded-xl text-xs font-semibold cursor-pointer shadow"
                >
                  Publicar Depoimento
                </button>
              </form>
            )}
          </div>
        )}

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#121216] border border-zinc-800/90 rounded-2xl p-6 space-y-4 hover:border-[#D4AF37]/40 transition-colors shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-white text-sm">{rev.author}</h4>
                  <p className="text-xs text-[#D4AF37]">{rev.serviceName}</p>
                </div>

                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'text-[#F3D079] fill-[#F3D079]' : 'text-zinc-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                "{rev.comment}"
              </p>

              <div className="text-[11px] text-zinc-500 pt-2 border-t border-zinc-800/60 flex items-center justify-between">
                <span>Avaliação verificada</span>
                <span className="tabular-nums">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
