"use client";

import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DroppableAreaProps {
  id: string;
  children: React.ReactNode;
}

export function DroppableArea({ id, children }: DroppableAreaProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const style: React.CSSProperties = {
    // 1. Removemos a borda tracejada
    // border: '2px dashed #000000ff',
    
    // Cor de fundo padrão (um cinza muito claro)
    backgroundColor: '#f5f5f5', 
    
    // Cor de fundo quando um item está sendo arrastado sobre ele (isOver)
    // Um tom ligeiramente mais escuro para indicar que pode soltar
    backgroundColor: isOver ? '#838383ff' : '#f5f5f5', 
    
    padding: '20px',
    width: '300px',
    height: '300px',
    maxHeight: '300px',
    borderRadius: '12px', // Borda mais arredondada

    // 2. Adicionamos uma sombra suave (boxShadow)
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Sombra padrão
    
    // Mantenha o display flex para organizar o conteúdo
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}