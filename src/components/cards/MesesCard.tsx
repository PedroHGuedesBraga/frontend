"use client";

import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button'; 
import { Badge } from 'primereact/badge'; 

interface MesesCardProps {
  monthName: string;
  totalCount: number; 
  onClick: () => void; 
}

const MesesCard: React.FC<MesesCardProps> = ({ 
  monthName, 
  totalCount, 
  onClick 
}) => {
    
  // --- FOOTER COM O BOTÃO (Botão já está w-full, mas vamos garantir o padding) ---
  const footerContent = (
    // Removido o p-card-footer mt-4 do div, já que o Card manipula o footer.
    // O w-full do Button garante que ele ocupe 100%.
    <Button
        label="Ver Contratos"
        onClick={onClick}
        icon="pi pi-search"
        iconPos="right"
        className="p-button-sm w-full" 
        severity="secondary" 
    />
  );

  return (
    <Card 
      title={<h3 className="text-2xl font-bold text-center text-900">{monthName}</h3>} 
      footer={footerContent} 
      // h-full para altura igual na grid, flex flex-col para forçar o footer para baixo
      className="shadow-5 surface-card hover:shadow-7 transition-shadow transition-duration-300 h-full flex flex-col"
    >
        {/* CORREÇÃO DO ALINHAMENTO DO CORPO:
            - flex-1: Ocupa todo o espaço vertical restante.
            - Novo método de centralização: flex flex-col items-center justify-center.
            - O h-full não é estritamente necessário se o flex-1 estiver no pai.
        */}
        <div className="flex-1 flex flex-col items-center justify-center w-full"> 
             
             {/* Badge do Contador Total */}
             <div className="text-center">
                 <Badge 
                     value={totalCount} 
                     severity="info" 
                     className="p-badge-xl"
                 />
                 <p className="text-gray-500 text-sm mt-2">Total de Contratos</p>
             </div>
        </div>
    </Card>
  );
};

export default MesesCard;