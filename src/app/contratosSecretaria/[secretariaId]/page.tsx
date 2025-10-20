"use client";

import React, { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import ContratoCard from "@/components/cards/ContratoCard"; 
import useContratos from "@/hooks/useContratos"; 

const MONTH_NAMES: { [key: string]: string } = {
  '01': "Janeiro", '02': "Fevereiro", '03': "Março", '04': "Abril", 
  '05': "Maio", '06': "Junho", '07': "Julho", '08': "Agosto", 
  '09': "Setembro", '10': "Outubro", '11': "Novembro", '12': "Dezembro",
};


export default function ContratosSecretariaPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  // CORREÇÃO: Removemos o 'as string'. O hook agora recebe o tipo real do Next.js 
  // (string | string[] | undefined), que é o que causa o log inicial "undefined".
  const secretariaId = params.secretariaId; 
  const requiredMonthNumber = searchParams.get('month') || ""; 

  // O hook useContratos agora tem a chance de se re-executar quando secretariaId for definido.
  const { contratosFiltrados, secretariaNome, loading, error } = useContratos(secretariaId, requiredMonthNumber); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Log 3: Dados recebidos pela página
  console.log(`[Page LOG] Status: Loading=${loading}, Error=${error}`);
  console.log(`[Page LOG] Secretaria: ${secretariaNome}, Contratos para exibir: ${contratosFiltrados.length}`);
  
  // UI e Loading
  const monthTitle = requiredMonthNumber ? MONTH_NAMES[requiredMonthNumber] || 'Mês Desconhecido' : 'Mês Desconhecido';
  const pageTitle = `${monthTitle} - Contratos`;

  if (loading) return <div className="flex justify-content-center align-items-center min-h-screen"><ProgressSpinner /></div>;
  if (error) return <p className="text-red-500 p-5">Erro: {error}</p>;
  if (!secretariaNome && contratosFiltrados.length === 0 && !loading) return <p className="p-5">Secretaria não encontrada</p>;

  // Função para abrir o modal de criação (se necessário)
  const handleSaveContrato = (novoContrato: any) => {
    console.log("Contrato criado:", novoContrato);
    alert("Contrato criado com sucesso!");
    setIsModalOpen(false);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-5">
      <div className="w-full max-w-6xl mx-auto">
        
        {/* CABEÇALHO */}
        <div className="flex justify-content-between items-center mb-6">
          <Button 
              icon="pi pi-arrow-left" 
              label="Voltar" 
              className="p-button-text p-button-sm text-blue-800"
              onClick={() => router.push(`/mesesSecretaria/${secretariaId}`)}
          />
          <h1 className="text-3xl text-black font-bold text-center flex-1">{secretariaNome} - {pageTitle}</h1> 
          <Button
            onClick={() => setIsModalOpen(true)}
            label="Criar Contrato"
            icon="pi pi-plus"
            severity="success"
            className="p-button-sm"
          />
        </div>

        {/* MENSAGEM DE VAZIO */}
        {contratosFiltrados.length === 0 && (
          <div className="text-center p-5 bg-white rounded-lg shadow-md">
            <p className="text-lg text-gray-700">Não há contratos para **{monthTitle}**.</p>
          </div>
        )}

        {/* GRID DOS CONTRATOS */}
        <div className="grid">
          {contratosFiltrados.map((contrato) => (
            <div key={contrato.id} className="col-12 sm:col-6 lg:col-4 mb-4">
              <ContratoCard
                contratoId={contrato.id}
                contratoNome={contrato.nome} 
                itemCount={contrato.itensQuantidade} 
                // Mapeamento de status atualizado: Aprovado > 'aprovado'. Outros > 'urgente' ou 'andamento'
                status={
                  contrato.aprovado 
                    ? 'aprovado' 
                    : (contrato.status === 'urgente' ? 'urgente' : 'andamento')
                }
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Modal de criar contrato */}
      {/* {isModalOpen && (...) } */}
    </div>
  );
}