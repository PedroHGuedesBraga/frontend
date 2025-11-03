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
import { useMesesSecretaria } from "@/hooks/useMesesSecretaria";
import { contratoService } from "@/services/contrato/contratoService";
import { secretariaService } from "@/services/secretaria/secretariaService";

// Mapeamento de número -> nome do mês
const mesesNomes: Record<string, string> = {
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

export default function MesesSecretariaPage() {
  const params = useParams();
  const secretariaId = params.secretariaId as string;
  const router = useRouter();

  const { loading, error, secretariaNome, contratosOrganizados, anoSelecionado, setAnoSelecionado } =
    useMesesSecretaria(secretariaId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [data, setData] = useState<Date | null>(null);
  const [status, setStatus] = useState("andamento");



  const handleMonthClick = (ano: string, mes: string) => {
    router.push(`/contratosSecretaria/${secretariaId}?year=${ano}&month=${mes}`);
  };

const handleDeleteSecretaria = async (secretariaId: string) => {
  // Confirmação antes de deletar
  if (!window.confirm("Deseja realmente deletar esta secretaria?")) return;

  try {
    // Chama o serviço para deletar
    await secretariaService.delete(secretariaId);

    // Sucesso
    alert("Secretaria deletada com sucesso!");
    router.push("/home"); // Redireciona para a lista de secretarias
  } catch (error) {
    console.error("Erro ao deletar secretaria:", error);
    alert("Erro ao deletar secretaria. Verifique o console.");
  }
};
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
        aprovado: false,
        secretariaId,
        itensQuantidade: 0,
      };

      await contratoService.create(payload);
      alert("Contrato criado com sucesso!");
      setIsModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      console.error("Erro ao criar contrato:", err);
      alert("Erro ao criar contrato. Verifique o console.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-content-center align-items-center min-h-screen">
        <ProgressSpinner />
      </div>
    );

  if (error) return <p className="text-red-500 p-5">Erro: {error}</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-5">
      <div className="w-full max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6">
          <Button
            icon="pi pi-arrow-left"
            label="Voltar"
            className="p-button-text p-button-sm text-blue-800"
            onClick={() => router.push("/home")}
          />
          <h1 className="text-3xl text-black font-bold text-center flex-1">{secretariaNome}</h1>
          <div></div>
        </div>

        {/* Filtro de ano + Botão Adicionar Contrato */}
        <div className="flex justify-between mb-4 items-center gap-3">
          <Dropdown
            value={anoSelecionado}
            options={Object.keys(contratosOrganizados)
              .sort((a, b) => parseInt(b) - parseInt(a))
              .map((ano) => ({ label: ano, value: ano }))}
            onChange={(e) => setAnoSelecionado(e.value)}
            placeholder="Selecione o ano"
            className="w-32"
          />
          <Button
            onClick={() => setIsModalOpen(true)}
            label="Adicionar Contrato"
            icon="pi pi-plus"
            severity="success"
            className="p-button-sm"
          />
          <Button
            onClick={() => handleDeleteSecretaria(secretariaId)}
            label="Deletar Secretaria"
            icon="pi pi-trash"
            severity="danger"
            className="p-button-sm"
          />
        </div>

        {/* Renderização dos meses do ano selecionado */}
        {anoSelecionado && contratosOrganizados[anoSelecionado] ? (
          <div className="grid">
            {Object.entries(contratosOrganizados[anoSelecionado])
              .sort(([mesA], [mesB]) => parseInt(mesA) - parseInt(mesB))
              .map(([mes, contratos]) => (
                <div key={mes} className="col-12 sm:col-6 md:col-4 lg:col-3 mb-4">
                  <MesesCard
                    monthName={mesesNomes[mes] || mes}
                    totalCount={contratos.length}
                    onClick={() => handleMonthClick(anoSelecionado, mes)}
                  />
                </div>
              ))}
          </div>
        ) : (
          <p className="p-3 text-gray-500">Selecione um ano para visualizar os meses</p>
        )}
      </div>

      {/* Modal Novo Contrato */}
      <Dialog
        header="Novo Contrato"
        visible={isModalOpen}
        style={{ width: "40vw" }}
        modal
        onHide={() => setIsModalOpen(false)}
      >
        <div className="flex flex-column gap-3 p-3">
          <label htmlFor="secretaria">Secretaria</label>
          <InputText id="secretaria" value={secretariaNome} disabled className="w-full" />

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
