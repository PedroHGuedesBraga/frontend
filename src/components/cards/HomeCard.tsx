"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button'; 

interface HomeCardProps {
  secretaryId: string;
  secretaryName: string;
}

const HomeCard: React.FC<HomeCardProps> = ({ secretaryId, secretaryName }) => {
  const router = useRouter();

  const handleViewClick = () => {
    router.push(`/mesesSecretaria/${secretaryId}`);
  };

  const footer = (
    <div className="flex justify-content-center pt-3"> 
        <Button 
            label="Visualizar"
            icon="pi pi-angle-right" 
            iconPos="right"
            onClick={handleViewClick}
            className="p-button-sm w-full" 
            // <<< REMOVIDO: severity="primary" >>>
            // Omitir 'severity' resulta no estilo azul padrão (primary)
        />
    </div>
  );

  const cardTitle = (
    <h3 className="font-bold text-lg text-center">{secretaryName}</h3>
  );

  return (
    <Card
      title={cardTitle} 
      footer={footer}
      className="shadow-4 h-full" 
    >
    </Card>
  );
};

export default HomeCard;