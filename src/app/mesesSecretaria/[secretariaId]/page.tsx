// src/app/mesesSecretaria/[secretariaId]/page.tsx (Refatorado)

"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import MesesCard from "@/components/cards/MesesCard"; 
// Importamos o novo hook específico para esta página
import useMeses from "@/hooks/useMeses"; 


export default function MesesSecretariaPage() {
  const params = useParams();
  const secretariaId = params.secretariaId; 
  const router = useRouter();
  
  // Consome o hook que já faz o cálculo por mês
  const { meses, secretariaNome, loading, error } = useMeses(secretariaId); 

  const [isModalOpen, setIsModalOpen] = useState(false);

  // =================================================================
  // TELAS DE STATUS E LÓGICA
  // =================================================================

  if (loading) return <div className="flex justify-content-center align-items-center min-h-screen"><ProgressSpinner /></div>;
  if (error) return <p className="text-red-500 p-5">Erro: {error}</p>;
  if (!secretariaNome) return <p className="p-5">Secretaria não encontrada</p>;

  // A LÓGICA FOI MOVIDA PARA O useMeses.ts
  
  // Alteramos o handler para passar o NÚMERO do mês
  const handleMonthClick = (monthNumber: string) => {
    // A URL agora passa o número do mês
    router.push(`/contratosSecretaria/${secretariaId}?month=${monthNumber}`);
  };

  const handleSaveContrato = (novoContrato: any) => {
    console.log("Contrato criado:", novoContrato);
    alert("Contrato criado com sucesso!");
    setIsModalOpen(false);
  };

  // =================================================================
  // RENDERIZAÇÃO
  // =================================================================

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-5"> 
      
      <div className="w-full max-w-6xl mx-auto">

        {/* CABEÇALHO */}
        <div className="flex justify-content-between items-center mb-6">
          <Button 
              icon="pi pi-arrow-left" 
              label="Voltar" 
              className="p-button-text p-button-sm text-blue-800"
              onClick={() => router.push('/home')}
          />
          <h1 className="text-3xl text-black font-bold text-center flex-1">{secretariaNome}</h1> 
          <div></div> 
        </div>

        {/* Botão 'Adicionar Contrato' */}
        <div className="flex justify-content-end mb-4">
          <Button
            onClick={() => setIsModalOpen(true)}
            label="Adicionar Contrato"
            icon="pi pi-plus"
            severity="success"
            className="p-button-sm"
          />
        </div>

        {/* Cards por mês (usando o array 'meses' que veio do hook) */}
        <div className="grid">
          {meses.map((m) => (
            <div key={m.monthNumber} className="col-12 sm:col-6 md:col-4 lg:col-3 mb-4">
              <MesesCard
                monthName={m.monthName}
                totalCount={m.totalCount} 
                // Passamos o NÚMERO do mês para a função de clique
                onClick={() => handleMonthClick(m.monthNumber)}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Modal de criar contrato */}
      {/* {isModalOpen && ( ... )} */}
    </div>
  );
}