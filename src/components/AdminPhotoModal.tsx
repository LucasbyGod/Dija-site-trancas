import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Upload, Sparkles, AlertCircle, CheckCircle2, Image as ImageIcon, 
  Trash2, RefreshCw, Scissors, Tag, FileText, ArrowRight
} from 'lucide-react';
import { GalleryPhoto, GalleryCategoryTag } from '../types';
import { compressImage, formatFileSize, OptimizedImageResult } from '../utils/imageOptimizer';
import { SERVICES_CATALOG } from '../data/services';

interface AdminPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  photoToEdit?: GalleryPhoto | null;
  onSavePhoto: (photo: GalleryPhoto) => Promise<void>;
}

const CATEGORY_OPTIONS: { value: GalleryCategoryTag; label: string }[] = [
  { value: 'Fulany Braids', label: 'Fulany Braids' },
  { value: 'Box Braids', label: 'Box Braids & Cachos' },
  { value: 'Nagô & Tiaras', label: 'Nagô & Tiaras' },
  { value: 'Crochet & Cachos', label: 'Crochet & Cachos' },
  { value: 'Linha Masculina', label: 'Linha Masculina' },
];

export const AdminPhotoModal: React.FC<AdminPhotoModalProps> = ({
  isOpen,
  onClose,
  photoToEdit,
  onSavePhoto,
}) => {
  const isEditing = !!photoToEdit;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('Fulany Braids');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [serviceTarget, setServiceTarget] = useState('Fulany braids com cachos');

  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionStats, setCompressionStats] = useState<OptimizedImageResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form when opening or changing photoToEdit
  useEffect(() => {
    if (photoToEdit) {
      setTitle(photoToEdit.title);
      setCategory(photoToEdit.category);
      setImageUrl(photoToEdit.imageUrl);
      setDescription(photoToEdit.description || '');
      setServiceTarget(photoToEdit.serviceTarget || SERVICES_CATALOG[0].name);
      setCompressionStats(null);
    } else {
      setTitle('');
      setCategory('Fulany Braids');
      setImageUrl('');
      setDescription('');
      setServiceTarget(SERVICES_CATALOG[0].name);
      setCompressionStats(null);
    }
    setError(null);
  }, [photoToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione um arquivo de imagem válido (PNG, JPG, WEBP).');
      return;
    }

    setError(null);
    setIsCompressing(true);

    try {
      // Compress to WebP, max 1080px width, quality 0.82
      const result = await compressImage(file, 1080, 0.82);
      setCompressionStats(result);
      setImageUrl(result.dataUrl);
    } catch (err: any) {
      setError(err?.message || 'Falha ao comprimir imagem.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor, forneça o nome ou título da trança.');
      return;
    }
    if (!imageUrl.trim()) {
      setError('Por favor, faça upload de uma foto ou forneça uma imagem.');
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      const photoData: GalleryPhoto = {
        id: photoToEdit ? photoToEdit.id : 'photo_' + Date.now(),
        title: title.trim(),
        category,
        imageUrl: imageUrl.trim(),
        description: description.trim() || undefined,
        serviceTarget: serviceTarget.trim() || undefined,
        createdAt: photoToEdit ? photoToEdit.createdAt : new Date().toISOString(),
      };

      await onSavePhoto(photoData);
      setIsSaving(false);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Erro ao salvar a foto na galeria.');
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#121216] border-2 border-[#D4AF37]/50 rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.85)] overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-[#18181D] px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#F3D079]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-base">
                {isEditing ? 'Editar Foto da Galeria' : 'Adicionar Nova Foto ao Portfólio'}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {isEditing ? 'Atualize os dados e a imagem desta trança' : 'Foto real otimizada para WebP'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-500/60 rounded-xl text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Image Upload & Preview Column */}
            <div className="md:col-span-5 space-y-3">
              <label className="text-xs font-semibold text-zinc-300 block flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                Foto da Trança *
              </label>

              {/* Upload Drop Zone / Preview Box */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative aspect-[3/4] w-full rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center text-center p-4 ${
                  imageUrl
                    ? 'border-[#D4AF37]/60 bg-black'
                    : 'border-zinc-700 hover:border-[#D4AF37]/70 bg-[#16161A]'
                }`}
              >
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2">
                      <Upload className="w-6 h-6 mb-1 text-[#F3D079]" />
                      <span className="text-xs font-semibold">Trocar Foto</span>
                      <span className="text-[10px] text-zinc-300">Clique para carregar outro arquivo</span>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2 text-zinc-400">
                    <div className="w-12 h-12 rounded-full bg-[#1F1E1A] border border-[#D4AF37]/40 flex items-center justify-center mx-auto text-[#D4AF37]">
                      {isCompressing ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-200">
                        {isCompressing ? 'Otimizando imagem...' : 'Clique para carregar a foto'}
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        PNG, JPG ou WEBP (comprime automaticamente para 1080px WebP)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Optimization Stats Box */}
              {compressionStats && (
                <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/40 rounded-lg text-[11px] text-emerald-300 space-y-1">
                  <div className="flex items-center gap-1 font-semibold text-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Otimizada com Sucesso (WebP)</span>
                  </div>
                  <div className="flex justify-between text-zinc-300">
                    <span>Dimensões:</span>
                    <span>{compressionStats.width} × {compressionStats.height}px</span>
                  </div>
                  <div className="flex justify-between text-zinc-300">
                    <span>Tamanho:</span>
                    <span>{formatFileSize(compressionStats.compressedSize)} (-{compressionStats.reductionPercentage}%)</span>
                  </div>
                </div>
              )}

              {/* URL fallback input */}
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400 block">Ou cole o link direto da imagem:</span>
                <input
                  type="text"
                  value={imageUrl.startsWith('data:') ? '' : imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setCompressionStats(null);
                  }}
                  placeholder="https://exemplo.com/foto.jpg"
                  className="w-full bg-[#18181D] border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:border-[#D4AF37] outline-none"
                />
              </div>
            </div>

            {/* Information Fields Column */}
            <div className="md:col-span-7 space-y-3.5">
              
              {/* Title / Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 block flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Nome da Trança / Título do Card *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Nagô Geométrica em V com Cachos"
                  className="w-full bg-[#18181D] border border-zinc-700 rounded-xl p-3 text-sm text-white focus:border-[#D4AF37] outline-none"
                  required
                />
              </div>

              {/* Category / Tag */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 block flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Categoria / Tag da Galeria *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#18181D] border border-zinc-700 rounded-xl p-3 text-sm text-white focus:border-[#D4AF37] outline-none"
                  required
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Related Catalog Service */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Procedimento do Agendamento Relacionado
                </label>
                <select
                  value={serviceTarget}
                  onChange={(e) => setServiceTarget(e.target.value)}
                  className="w-full bg-[#18181D] border border-zinc-700 rounded-xl p-3 text-xs text-white focus:border-[#D4AF37] outline-none"
                >
                  {SERVICES_CATALOG.map((serv) => (
                    <option key={serv.id} value={serv.name}>
                      {serv.name} (R$ {serv.basePrice.toFixed(2).replace('.', ',')})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-zinc-400">
                  Quando a cliente clicar em "Agendar Este Procedimento", abrirá o agendamento pré-selecionado neste serviço.
                </p>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 block flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Descrição dos Detalhes (Opcional)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Tranças rasteiras em ondas fluidas com fibra premium, pontas texturizadas e baby hair simétrico."
                  className="w-full bg-[#18181D] border border-zinc-700 rounded-xl p-3 text-xs text-white focus:border-[#D4AF37] outline-none resize-none"
                />
              </div>

            </div>

          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-[#18181D] hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving || isCompressing}
              className="gold-gradient-btn px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-lg hover:brightness-105 active:scale-98 transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Salvando Foto...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{isEditing ? 'Salvar Alterações' : 'Publicar na Galeria'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
