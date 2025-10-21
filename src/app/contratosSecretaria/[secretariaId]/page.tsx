"use client";

import React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
import ContratoCard from "@/components/cards/ContratoCard";
import useContratos from "@/hooks/GET/useContratos";

const MONTH_NAMES: { [key: string]: string } = {
  "01": "Janeiro",
  "02": "Fevereiro",
  "03": "Março",
  "04": "Abril",
  "05": "Maio",
  "06": "Junho",
  "07": "Julho",
  "08": "Agosto",
  "09": "Setembro",
  "10": "Outubro",
  "11": "Novembro",
  "12": "Dezembro",
};

export default function ContratosSecretariaPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const secretariaId = params.secretariaId as string;
  const requiredMonthNumber = searchParams.get("month") || "";

  const { contratosFiltrados, secretariaNome, loading, error } = useContratos(
    secretariaId,
    requiredMonthNumber
  );

  const monthTitle = requiredMonthNumber
    ? MONTH_NAMES[requiredMonthNumber] || "Mês Desconhecido"
    : "Mês Desconhecido";
  const pageTitle = `${monthTitle} - Contratos`;

  // ----------------------------------------------------------
  // Estados de carregamento e erros
  // ----------------------------------------------------------
  if (loading)
    return (
      <div className="flex justify-content-center align-items-center min-h-screen">
        <ProgressSpinner />
      </div>
    );

  if (error)
    return <p className="text-red-500 p-5">Erro: {error}</p>;

  if (!secretariaNome && contratosFiltrados.length === 0 && !loading)
    return <p className="p-5">Secretaria não encontrada</p>;

  // ----------------------------------------------------------
  // Renderização
  // ----------------------------------------------------------
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
          <h1 className="text-3xl text-black font-bold text-center flex-1">
            {secretariaNome} - {pageTitle}
          </h1>
          <div></div>
        </div>

        {/* LISTA DE CONTRATOS */}
        {contratosFiltrados.length === 0 ? (
          <div className="text-center p-5 bg-white rounded-lg shadow-md">
            <p className="text-lg text-gray-700">
              Não há contratos para <strong>{monthTitle}</strong>.
            </p>
          </div>
        ) : (
          <div className="grid">
            {contratosFiltrados.map((contrato) => (
              <div key={contrato.id} className="col-12 sm:col-6 lg:col-4 mb-4">
                <ContratoCard
                  contratoId={contrato.id}
                  contratoNome={contrato.nome}
                  itemCount={contrato.itensQuantidade}
                  // Lógica de exibição: se aprovado, ignora status
                  status={
                    contrato.aprovado
                      ? "aprovado"
                      : contrato.status === "urgente"
                      ? "urgente"
                      : "andamento"
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
