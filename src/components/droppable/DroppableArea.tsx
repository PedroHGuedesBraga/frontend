"use client";

import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DroppableAreaProps {
  id: string;
  children: React.ReactNode;
  title: string;
  // Nova prop opcional para controlar se a coluna deve iniciar aberta
  initiallyOpen?: boolean; 
}

// Valores de cores e estilos para fácil ajuste
const BASE_COLOR = '#ffffff'; // Fundo branco puro
const BORDER_COLOR = '#e0e0e0';
const HOVER_OVER_COLOR = '#e3f2fd'; // Azul muito suave para indicar "drop"
const PRIMARY_COLOR = '#4A90E2';

export function DroppableArea({ id, children, title, initiallyOpen = true }: DroppableAreaProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  // 1. ESTADO DE COLAPSO: Controla se o conteúdo (children) está visível
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  const toggleOpen = () => setIsOpen(!isOpen);

  // 2. ESTILOS CONDICIONAIS

  // Estilo Base do Container Principal
  const containerStyle: React.CSSProperties = {
    backgroundColor: BASE_COLOR,
    border: `1px solid ${BORDER_COLOR}`,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    borderRadius: '10px',
    padding: '0', // Removemos o padding do container para aplicar no cabeçalho e corpo
    width: '320px',
    // Altura controlada pela abertura/fechamento
    minHeight: isOpen ? '100px' : 'auto', 
    boxSizing: 'border-box',
    transition: 'all 0.3s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    // Se estiver aberta, permite o scroll
    overflowY: isOpen ? 'auto' : 'hidden', 
    // Estilo de isOver aplicado ao container
    ...(isOver ? {
        backgroundColor: HOVER_OVER_COLOR,
        border: `1px solid ${PRIMARY_COLOR}`,
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    } : {}),
  };
  
  // 3. ESTILO DO CABEÇALHO (Onde está o Título e a Seta)
  const headerStyle: React.CSSProperties = {
    padding: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: isOver ? HOVER_OVER_COLOR : BASE_COLOR,
    borderBottom: isOpen ? `1px solid ${BORDER_COLOR}` : 'none', // Linha divisória se estiver aberto
    borderRadius: isOpen ? '10px 10px 0 0' : '10px',
    transition: 'all 0.3s ease-in-out',
    userSelect: 'none', // Impede seleção de texto ao clicar
  };

  // 4. ESTILO DA SETA (Ícone)
  const arrowStyle: React.CSSProperties = {
    fontSize: '18px',
    color: PRIMARY_COLOR,
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', // Rotação da seta
    transition: 'transform 0.3s ease-in-out',
  };

  // 5. ESTILO DA ÁREA DO CONTEÚDO (Onde os cards ficam)
  const contentAreaStyle: React.CSSProperties = {
    // A altura é ajustada via um componente wrapper para a transição suave
    padding: '10px 15px', 
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    // O ref para o dnd-kit deve ir para o container principal
    <div ref={setNodeRef} style={containerStyle}>
        
      {/* CABEÇALHO (Sempre visível) */}
      <div style={headerStyle} onClick={toggleOpen}>
        <h3 style={{ 
            margin: 0, 
            fontSize: '16px', 
            color: '#333', 
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center'
        }}>
          {title}
          {isOver && ( // Indicador de Drop visível no cabeçalho
            <span style={{ fontSize: '12px', color: PRIMARY_COLOR, marginLeft: '8px', fontWeight: 'normal' }}>
              (Pronto para soltar)
            </span>
          )}
        </h3>
        
        {/* ÍCONE DE SETA */}
        <span style={arrowStyle}>
          ▼ {/* Use um ícone real (ex: de uma biblioteca) aqui para melhor estética */}
        </span>
      </div>
      
      {/* CORPO DO ACORDEÃO (Visível apenas se isOpen for true) */}
      {/* Se não estiver aberto, o conteúdo não é renderizado, ou é renderizado com altura 0 e overflow hidden */}
      {isOpen && (
        <div style={contentAreaStyle}>
          <div style={{ padding: '5px 0' }}> 
            {children}
          </div>
        </div>
      )}
    </div>
  );
}