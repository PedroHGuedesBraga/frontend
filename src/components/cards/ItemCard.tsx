// src/components/tables/ItensDataTable.tsx

"use client";

import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { Item } from "@/hooks/useItens"; // Importe a interface Item do seu hook

interface ItensDataTableProps {
  itens: Item[];
  // Funções de Ação
  onToggleAprovado: (id: string) => void;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

export default function ItensDataTable({ itens, onToggleAprovado, onEdit, onDelete }: ItensDataTableProps) {

  // ------------------------------------
  // TEMPLATES PARA COLUNAS
  // ------------------------------------

  // Template para formatar o preço
  const precoBodyTemplate = (item: Item) => {
    return `R$ ${item.precoUnitario.toFixed(2).replace('.', ',')}`;
  };

  // Template para o status de Aprovação (botão/Tag)
  const aprovadoBodyTemplate = (item: Item) => {
    return (
      <Tag
        value={item.aprovado ? "Sim" : "Não"}
        severity={item.aprovado ? 'success' : 'warning'}
        onClick={() => onToggleAprovado(item.id)}
        className="cursor-pointer transition-colors duration-200"
      />
    );
  };

  // Template para as Ações (Editar, Deletar)
  const actionBodyTemplate = (item: Item) => {
    return (
      <div className="flex gap-2">
        <Button 
          icon="pi pi-pencil" 
          onClick={() => onEdit(item)}
          className="p-button-sm p-button-text p-button-secondary"
          tooltip="Editar Item"
        />
        <Button 
          icon="pi pi-trash" 
          onClick={() => onDelete(item.id)}
          className="p-button-sm p-button-text p-button-danger"
          tooltip="Excluir Item"
        />
      </div>
    );
  };
  
  // ------------------------------------

  return (
    <Card title="Itens do Contrato" className="shadow-md">
      <DataTable 
        value={itens} 
        dataKey="id" 
        size="small" // Tabela compacta
        paginator rows={10} // Adiciona Paginação
        emptyMessage="Nenhum item encontrado neste contrato."
        className="p-datatable-gridlines" // Estilo com gridlines (opcional)
      >
        <Column field="nome" header="Nome" sortable style={{ width: '15%' }} />
        <Column field="descricao" header="Descrição" style={{ width: '30%' }} />
        <Column field="quantidadeItem" header="Qtd" sortable style={{ width: '8%' }} />
        <Column field="unidadeDeMedida" header="Unidade" style={{ width: '10%' }} />
        
        {/* Colunas com Templates */}
        <Column 
          header="Preço Unitário" 
          body={precoBodyTemplate} 
          sortable 
          style={{ width: '12%' }} 
        />
        <Column 
          header="Aprovado" 
          body={aprovadoBodyTemplate} 
          align="center"
          style={{ width: '10%' }} 
        />
        <Column 
          header="Ações" 
          body={actionBodyTemplate} 
          style={{ width: '15%' }} 
          alignFrozen="right"
          frozen // Mantém as ações visíveis no scroll horizontal
        />
      </DataTable>
    </Card>
  );
}