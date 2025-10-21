// src/components/cards/ItemCard.tsx
"use client";

import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Item } from "@/hooks/GET/useItens"; 

interface ItensDataTableProps {
  itens: Item[];
  // Funções de Ação: Recebem o objeto Item completo
  onToggleAprovado: (item: Item) => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void; 
  loading: boolean; // Para desabilitar botões durante as operações
}

export default function ItensDataTable({ itens, onToggleAprovado, onEdit, onDelete, loading }: ItensDataTableProps) {

  const precoBodyTemplate = (item: Item) => {
    const preco = Number(item.precoUnitario);
    return `R$ ${preco.toFixed(2).replace('.', ',')}`;
  };

  const aprovadoBodyTemplate = (item: Item) => {
    return (
      <Tag
        value={item.aprovado ? "Sim" : "Não"}
        severity={item.aprovado ? 'success' : 'warning'}
        // Passa o item completo e desabilita se estiver em loading
        onClick={() => !loading && onToggleAprovado(item)} 
        className={`cursor-pointer transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
    );
  };

  const actionBodyTemplate = (item: Item) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          onClick={() => onEdit(item)}
          className="p-button-sm p-button-text p-button-secondary"
          tooltip="Editar Item"
          disabled={loading} // Desabilita durante operações
        />
        <Button
          icon="pi pi-trash"
          onClick={() => onDelete(item)} // Passa o item completo
          className="p-button-sm p-button-text p-button-danger"
          tooltip="Excluir Item"
          disabled={loading} // Desabilita durante operações
        />
      </div>
    );
  };

  return (
    <Card title="Itens do Contrato" className="shadow-md relative">
      {/* Overlay de loading para a tabela */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-lg">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
        </div>
      )}
      <DataTable
        value={itens}
        dataKey="id"
        size="small" 
        paginator rows={10} 
        emptyMessage="Nenhum item encontrado neste contrato."
        className="p-datatable-gridlines"
      >
        <Column field="nome" header="Nome" sortable style={{ width: '15%' }} />
        <Column field="descricao" header="Descrição" style={{ width: '30%' }} />
        <Column field="quantidadeItem" header="Qtd" sortable style={{ width: '8%' }} />
        <Column field="unidadeDeMedida" header="Unidade" style={{ width: '10%' }} />

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
          frozen
        />
      </DataTable>
    </Card>
  );
}