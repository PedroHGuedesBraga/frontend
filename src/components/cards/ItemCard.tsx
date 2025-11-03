"use client";

import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Card } from "primereact/card";
import { Item } from "@/types/item";

interface ItensDataTableProps {
  itens: Item[];
  onToggleAprovado: (item: Item) => void; // agora recebe o item completo
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void; // também recebe o item completo
}

export default function ItensDataTable({
  itens,
  onToggleAprovado,
  onEdit,
  onDelete,
}: ItensDataTableProps) {
  // Template para formatar preço
  const precoBodyTemplate = (item: Item) => {
    const preco = Number(item.precoUnitario);
    return `R$ ${preco.toFixed(2).replace(".", ",")}`;
  };

  // Template para status de aprovação (clicável)
  const aprovadoBodyTemplate = (item: Item) => {
    return (
      <Tag
        value={item.aprovado ? "Sim" : "Não"}
        severity={item.aprovado ? "success" : "warning"}
        onClick={() => onToggleAprovado(item)}
        className="cursor-pointer transition-colors duration-200"
      />
    );
  };

  // Template para ações (editar, deletar)
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
          onClick={() => onDelete(item)}
          className="p-button-sm p-button-text p-button-danger"
          tooltip="Excluir Item"
        />
      </div>
    );
  };

  return (
    <Card title="Itens do Contrato" className="shadow-md">
      <DataTable
        value={itens}
        dataKey="id"
        size="small"
        paginator
        rows={10}
        emptyMessage="Nenhum item encontrado neste contrato."
        className="p-datatable-gridlines"
      >
        <Column field="nome" header="Nome" sortable style={{ width: "15%" }} />
        <Column field="descricao" header="Descrição" style={{ width: "30%" }} />
        <Column field="quantidadeItem" header="Qtd" sortable style={{ width: "8%" }} />
        <Column field="unidadeDeMedida" header="Unidade" style={{ width: "10%" }} />
        <Column header="Preço Unitário" body={precoBodyTemplate} sortable style={{ width: "12%" }} />
        <Column header="Aprovado" body={aprovadoBodyTemplate} align="center" style={{ width: "10%" }} />
        <Column
          header="Ações"
          body={actionBodyTemplate}
          style={{ width: "15%" }}
          alignFrozen="right"
          frozen
        />
      </DataTable>
    </Card>
  );
}
