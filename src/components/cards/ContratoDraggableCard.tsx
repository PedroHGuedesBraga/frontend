// src/components/droppable/ContratoDraggableCard.tsx

import React, { useState } from 'react';
import { DraggableCard } from "@/components/droppable/DraggableCard"; // Importe o seu DraggableCard

interface ContratoDraggableCardProps {
    id: string;
    name: string;
}

export const ContratoDraggableCard: React.FC<ContratoDraggableCardProps> = ({ id, name }) => {
  
  // Use state para controlar o hover e dar um feedback visual elegante
  const [isHovered, setIsHovered] = useState(false);

  // Estilos base para o card
  const baseCardStyle: React.CSSProperties = {
    // Fundo muito claro ou branco
    backgroundColor: '#ffffff', 
    // Borda muito sutil (usaremos mais a sombra para profundidade)
    border: '1px solid #e0e0e0', 
    // Sombra suave, apenas para levantar o card sutilmente
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', 
    borderRadius: '8px', // Borda um pouco mais arredondada
    padding: '12px 16px', // Padding ligeiramente maior para respirar
    margin: '6px 0', // Espaçamento entre os cards um pouco menor
    width: '100%',
    textAlign: 'left', // Alinhar o texto à esquerda é geralmente mais profissional
    cursor: 'grab', // Mantém a indicação de que é arrastável
    transition: 'all 0.2s ease-in-out', // Transição suave para o hover
  };

  // Estilos de HOVER (feedback de interatividade)
  const hoverStyle: React.CSSProperties = {
    // Aumenta ligeiramente a sombra ao passar o mouse
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
    // Cor de fundo sutilmente alterada ou um leve degrade (opcional)
    backgroundColor: '#f9f9f9', 
    // Adiciona uma borda esquerda colorida para destaque
    borderLeft: '4px solid #4A90E2', // Cor primária da sua aplicação (ajuste conforme necessário)
    // Reduz a borda normal para compensar a borda esquerda
    border: '1px solid #4A90E2', 
  };
  
  // Estilo final combinado
  const cardStyle = {
    ...baseCardStyle,
    ...(isHovered ? hoverStyle : {}),
  };


  return (
    <DraggableCard key={id} id={id}>
      <div 
        style={cardStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Apenas o nome do contrato, estilizado */}
        <span style={{ 
            fontWeight: '500', // Um pouco menos negrito para um visual mais clean
            color: '#1a1a1a', // Cor do texto mais escura para contraste
            fontSize: '15px', // Tamanho ligeiramente maior para melhor leitura
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            display: 'block' 
        }}>
          {name}
        </span>
        {/* Você pode adicionar um identificador sutil ou um ícone aqui */}
        {/* <small style={{ color: '#999', fontSize: '12px' }}>#{id.substring(0, 8)}</small> */}
      </div>
    </DraggableCard>
  );
};