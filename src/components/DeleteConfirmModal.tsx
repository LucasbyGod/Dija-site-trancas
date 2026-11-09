import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { GalleryPhoto } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  photo: GalleryPhoto | null;
  onConfirmDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  photo,
  onConfirmDelete,
  isDeleting,
}) => {
  if (!isOpen || !photo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#121216] border-2 border-red-500/50 rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.9)] overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#1C1315] px-6 py-4 border-b border-red-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="font-display font-bold text-white text-base">
              Excluir Foto da Galeria
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs sm:text-sm text-zinc-300">
            Tem certeza de que deseja remover esta foto do portfólio oficial do Estúdio Dija Tranças?
          </p>

          {/* Photo Summary Card */}
          <div className="flex items-center gap-3.5 p-3 bg-[#18181D] border border-zinc-800 rounded-xl">
            <div className="w-14 h-18 rounded-lg overflow-hidden bg-black shrink-0 border border-zinc-700">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                {photo.category}
              </span>
              <h4 className="text-sm font-semibold text-white truncate">
                {photo.title}
              </h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                ID: {photo.id}
              </p>
            </div>
          </div>

          <p className="text-[11px] text-red-300/90 leading-relaxed bg-red-950/40 p-2.5 rounded-lg border border-red-900/30">
            ⚠️ Esta ação é irreversível e atualizará a galeria em tempo real para todas as clientes.
          </p>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-[#18181D] hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => onConfirmDelete(photo.id)}
              disabled={isDeleting}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-red-600 hover:bg-red-500 text-white flex items-center gap-2 cursor-pointer shadow-lg transition-all disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
