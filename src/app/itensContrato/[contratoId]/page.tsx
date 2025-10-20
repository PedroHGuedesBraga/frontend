"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

// Importa o hook e a interface Item
import useItens, { Item } from "@/hooks/useItens"; 
// Importa o novo componente de tabela
import ItensDataTable from "@/components/cards/ItemCard"; 


export default function ItensContratoPage() {
  const params = useParams();
  const router = useRouter();

  // O parâmetro de rota é 'contratoId'
  const contratoId = params.contratoId; 

  const { contrato, itens, loading, error } = useItens(contratoId); 

  // --- Funções de Ação (Ainda com console.log, prontas para API) ---
  const handleToggleAprovado = (id: string) => {
      console.log(`[AÇÃO] Toggle Aprovação do Item: ${id}`);
      alert(`Ação de Aprovação/Reprovação (PATCH) para o Item ${id} seria executada aqui.`);
      // TODO: Implementar a chamada de API PATCH para atualizar o item
  };
  
  const handleEdit = (item: Item) => {
      console.log(' [AÇÃO] Editar Item:', item.id);
      alert(`Ação de Editar (Modal) para o Item ${item.id} seria executada aqui.`);
      // TODO: Implementar abertura de Modal e chamada de API PATCH
  };
  
  const handleDelete = (id: string) => {
      console.log(' [AÇÃO] Deletar Item:', id);
      const confirmDelete = window.confirm(`Tem certeza que deseja deletar o Item ${id}?`);
      if (confirmDelete) {
          alert(`Ação de Deletar (DELETE) para o Item ${id} seria executada aqui.`);
          // TODO: Implementar chamada de API DELETE e recarregar a lista (fetchItensData)
      }
  };

  // --- Funções de Navegação ---
  const handleBack = () => {
    // Tenta voltar para a lista de meses da secretaria (melhor do que router.back)
    if (contrato?.secretaria?.id) {
        // Redireciona para a lista de meses da secretaria
        router.push(`/mesesSecretaria/${contrato.secretaria.id}`);
    } else {
        router.back(); 
    }
  };


  // --- UI Condicional ---
  if (loading) return <div className="flex justify-content-center align-items-center min-h-screen"><ProgressSpinner /></div>;
  if (error) return <p className="text-red-500 p-5">Erro: {error}</p>;
  if (!contrato) return <p className="p-5">Contrato não encontrado</p>;


  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-5"> 
      
      <div className="w-full max-w-6xl mx-auto">

        {/* CABEÇALHO */}
        <div className="flex justify-content-between items-center mb-6">
          <Button 
              icon="pi pi-arrow-left" 
              label="Voltar" 
              className="p-button-text p-button-sm text-blue-800"
              onClick={handleBack}
          />
          <h1 className="text-3xl text-black font-bold text-center flex-1">Itens do Contrato: {contrato.nome}</h1> 
          <Button
              label="Adicionar Item"
              icon="pi pi-plus"
              severity="success"
              className="p-button-sm"
              onClick={() => console.log('Abrir modal para adicionar item')}
          />
        </div>

        {/* TABELA DE ITENS COM DATATABLE */}
        <ItensDataTable 
            itens={itens} 
            onToggleAprovado={handleToggleAprovado}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
        
      </div>
    </div>
  );
}