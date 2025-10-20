// src/components/cards/ContratoCard.tsx

"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';

interface ContratoCardProps {
  status: 'aprovado' | 'andamento' | 'urgente';
  contratoNome: string; 
  itemCount: number; // Agora receberá o valor CORRIGIDO do hook
  contratoId: string;
}

const statusSeverity = {
  aprovado: 'success' as 'success',
  andamento: 'info' as 'info',
  urgente: 'danger' as 'danger',
};

const ContratoCard: React.FC<ContratoCardProps> = ({ status, contratoNome, itemCount, contratoId }) => {
  const router = useRouter();

  const handleViewItems = () => {
    // Rota correta para a nova página de itens
    router.push(`/itensContrato/${contratoId}`);
  };

  // --- FOOTER COM O BOTÃO ---
  const footerContent = (
    <Button
        label="Ver Itens"
        onClick={handleViewItems}
        icon="pi pi-search"
        iconPos="right"
        className="p-button-sm w-full" 
        severity="secondary" 
    />
  );

  return (
    <Card 
      // Título como o nome do contrato
      title={
        <h3 className="text-xl font-bold text-center text-900 line-clamp-2 h-4rem flex align-items-center justify-content-center">
            {contratoNome}
        </h3>
      } 
      footer={footerContent} 
      // h-full e flex-col para garantir alinhamento na grid
      className="shadow-5 surface-card hover:shadow-7 transition-shadow transition-duration-300 h-full flex flex-col"
    >
        {/* CORPO DO CARD: Centralizado vertical e horizontalmente */}
        <div className="flex-1 flex flex-col items-center justify-center w-full gap-3"> 
             
             {/* 1. BADGE DE STATUS */}
             <div className="text-center mb-3">
                 <Badge 
                     value={status.toUpperCase()} 
                     severity={statusSeverity[status]} 
                     className="p-badge-lg"
                 />
             </div>
             
             {/* 2. BADGE DE ITENS */}
             <div className="text-center">
                 <Badge 
                     value={itemCount} 
                     severity="info" 
                     className="p-badge-xl"
                 />
                 <p className="text-gray-500 text-sm mt-2">Total de Itens</p>
             </div>
        </div>
    </Card>
  );
};

export default ContratoCard;