"use client";

import React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
import ContratoCard from "@/components/cards/ContratoCard";
import { secretariaService } from "@/services/secretaria/secretariaService";

// Mapeamento de número -> nome do mês
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
  const yearParam = searchParams.get("year") || "";
  const monthParam = searchParams.get("month") || "";

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [secretariaNome, setSecretariaNome] = React.useState<string>("");
  const [contratosFiltrados, setContratosFiltrados] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchContratos = async () => {
      try {
        setLoading(true);
        // Buscar todos os contratos organizados por ano/mês
        const res = await secretariaService.getContratosOrganizados(secretariaId);

        // Buscar nome da secretaria
        const secretaria = await secretariaService.getById(secretariaId);
        setSecretariaNome(secretaria?.nome || "Secretaria");

        // Filtrar contratos do ano e mês selecionado
        const contratosDoAno = res[yearParam] || {};
        const contratosDoMes = contratosDoAno[monthParam] || [];
        setContratosFiltrados(contratosDoMes);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Erro ao buscar contratos");
      } finally {
        setLoading(false);
      }
    };

    if (yearParam && monthParam) {
      fetchContratos();
    } else {
      setContratosFiltrados([]);
      setLoading(false);
    }
  }, [secretariaId, yearParam, monthParam]);

  const monthTitle = monthParam ? MONTH_NAMES[monthParam] || "Mês Desconhecido" : "Mês Desconhecido";
  const pageTitle = `${monthTitle} - Contratos`;

  if (loading)
    return (
      <div className="flex justify-content-center align-items-center min-h-screen">
        <ProgressSpinner />
      </div>
    );

  if (error) return <p className="text-red-500 p-5">Erro: {error}</p>;

  if (!secretariaNome && contratosFiltrados.length === 0)
    return <p className="p-5">Secretaria não encontrada ou não há contratos neste período</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-5">
      <div className="w-full max-w-6xl mx-auto">
        {/* CABEÇALHO */}
        <div className="flex justify-between items-center mb-6">
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
              Não há contratos para <strong>{monthTitle}</strong> de <strong>{yearParam}</strong>.
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
