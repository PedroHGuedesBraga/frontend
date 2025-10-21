"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import MesesCard from "@/components/cards/MesesCard";
import useMeses from "@/hooks/GET/useMeses";
import { useAddContrato } from "@/hooks/POST/useAddContrato";

export default function MesesSecretariaPage() {
  const params = useParams();
  const secretariaId = params.secretariaId as string;
  const router = useRouter();

  const { meses, secretariaNome, loading, error } = useMeses(secretariaId);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados do formulário
  const [nome, setNome] = useState("");
  const [data, setData] = useState<Date | null>(null);
  const [status, setStatus] = useState("andamento");

  const { addContrato } = useAddContrato();

  // Navegar para a página de contratos do mês selecionado
  const handleMonthClick = (monthNumber: string) => {
    router.push(`/contratosSecretaria/${secretariaId}?month=${monthNumber}`);
  };

  // Salvar novo contrato
  const handleSaveContrato = async () => {
    if (!nome.trim() || !data) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const payload = {
        nome,
        data: data.toISOString().split("T")[0],
        status,
        aprovado: false, // sempre começa falso
        secretariaId,
        itensQuantidade:0
      };

      const novo = await addContrato(payload);
      alert("Contrato criado com sucesso!");
      console.log("Contrato criado:", novo);
      setIsModalOpen(false);

      window.location.reload();
    } catch (err) {
      console.error("Erro ao criar contrato:", err);
      alert("Erro ao criar contrato. Verifique o console.");
    }
  };

  // ======================================================
  // TELAS DE ESTADO
  // ======================================================
  if (loading)
    return (
      <div className="flex justify-content-center align-items-center min-h-screen">
        <ProgressSpinner />
      </div>
    );

  if (error) return <p className="text-red-500 p-5">Erro: {error}</p>;

  if (!secretariaNome)
    return <p className="p-5">Secretaria não encontrada</p>;

  // ======================================================
  // RENDERIZAÇÃO
  // ======================================================
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-5">
      <div className="w-full max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex justify-content-between items-center mb-6">
          <Button
            icon="pi pi-arrow-left"
            label="Voltar"
            className="p-button-text p-button-sm text-blue-800"
            onClick={() => router.push("/home")}
          />
          <h1 className="text-3xl text-black font-bold text-center flex-1">
            {secretariaNome}
          </h1>
          <div></div>
        </div>

        {/* Botão Adicionar Contrato */}
        <div className="flex justify-content-end mb-4">
          <Button
            onClick={() => setIsModalOpen(true)}
            label="Adicionar Contrato"
            icon="pi pi-plus"
            severity="success"
            className="p-button-sm"
          />
        </div>

        {/* Cards de meses */}
        <div className="grid">
          {meses.map((m) => (
            <div
              key={m.monthNumber}
              className="col-12 sm:col-6 md:col-4 lg:col-3 mb-4"
            >
              <MesesCard
                monthName={m.monthName}
                totalCount={m.totalCount}
                onClick={() => handleMonthClick(m.monthNumber)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Modal para criar contrato */}
      <Dialog
        header="Novo Contrato"
        visible={isModalOpen}
        style={{ width: "40vw" }}
        modal
        onHide={() => setIsModalOpen(false)}
      >
        <div className="flex flex-column gap-3 p-3">
          <label htmlFor="secretaria">Secretaria</label>
          <InputText
            id="secretaria"
            value={secretariaNome || ""}
            disabled
            className="w-full"
          />

          <label htmlFor="nome">Nome do Contrato</label>
          <InputText
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Contrato de fornecimento"
            className="w-full"
          />

          <label htmlFor="data">Data</label>
          <Calendar
            id="data"
            value={data}
            onChange={(e) => setData(e.value as Date)}
            dateFormat="dd/mm/yy"
            placeholder="Selecione a data"
            className="w-full"
          />

          <label htmlFor="status">Status</label>
          <Dropdown
            id="status"
            value={status}
            options={[
              { label: "Andamento", value: "andamento" },
              { label: "Urgente", value: "urgente" },
            ]}
            onChange={(e) => setStatus(e.value)}
            className="w-full"
          />

          <Button
            label="Salvar Contrato"
            icon="pi pi-check"
            className="p-button-success mt-3"
            onClick={handleSaveContrato}
          />
        </div>
      </Dialog>
    </div>
  );
}
