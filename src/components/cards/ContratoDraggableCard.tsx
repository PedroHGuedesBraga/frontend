// src/components/droppable/ContratoDraggableCard.tsx

import React from 'react';
import { DraggableCard } from "@/components/droppable/DraggableCard"; // Importe o seu DraggableCard

interface ContratoDraggableCardProps {
    id: string;
    name: string;
}

export const ContratoDraggableCard: React.FC<ContratoDraggableCardProps> = ({ id, name }) => {
  
  // Estilo visual para o card simples (parecido com o que você já usava, mas menor)
  const cardStyle: React.CSSProperties = {
    // Fundo mais neutro ou suave
    backgroundColor: '#ffffff', 
    // Borda sólida leve
    border: '1px solid #ddd', 
    // Sombra suave para destacar
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)', 
    borderRadius: '6px',
    padding: '10px 15px',
    margin: '8px 0', // Espaçamento entre os cards
    width: '100%', // Para ocupar a largura total da coluna
    textAlign: 'center',
    cursor: 'grab',
    // Altura controlada pelo padding, não fixada
  };

  return (
    <DraggableCard key={id} id={id}>
      <div style={cardStyle}>
        {/* Apenas o nome do contrato, estilizado */}
        <span style={{ 
            fontWeight: '600', 
            color: '#333',
            fontSize: '14px',
            // Oculta o estouro do texto se o nome for muito longo
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            display: 'block' 
        }}>
          {name}
        </span>
      </div>
    </DraggableCard>
  );
};