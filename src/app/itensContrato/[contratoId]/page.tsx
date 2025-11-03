"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import ItensDataTable from "@/components/cards/ItemCard"; // corrigi o import
import useItensContrato from "@/hooks/useItensContrato";
import { useItemActions } from "@/hooks/useItemActions";
import { contratoService } from "@/services/contrato/contratoService";
export default function ItensContratoPage() {
  const router = useRouter();
  const params = useParams();
  const contratoId = params.contratoId as string; // ✅ única fonte
  if (!contratoId) {
    return <p className="p-5 text-red-500">Contrato ID não fornecido.</p>;
  }

  const { contrato, itens, loading, error, fetchItens } = useItensContrato(contratoId);
  const [secretariaId, setSecretariaId] = useState<string | null>(null);
  const [contratoDate, setContratoDate] = useState<Date | null>(null);
  useEffect(() => {
  if (contrato) {
    setSecretariaId(contrato.secretariaId);
    setContratoDate(new Date(contrato.data));
  }
}, [contrato]);
  const {
    isModalOpen,
    setIsModalOpen,
    novoNome,
    setNovoNome,
    novoDescricao,
    setNovoDescricao,
    novoQuantidade,
    setNovoQuantidade,
    novoPrecoUnitario,
    setNovoPrecoUnitario,
    novoData,
    setNovoData,
    novoUnidade,
    setNovoUnidade,
    handleSaveItem,
    handleToggleAprovado,
    handleEdit,
    handleDelete,
  } = useItemActions(contratoId, fetchItens, contrato?.itensQuantidade);

  const handleBack = () => router.back();

  const handleDeleteContrato = async () => {
  if (!confirm("Tem certeza que deseja deletar este contrato?")) return;

  try {
    // 1️⃣ Buscar contrato pelo ID usando o service
    const contrato = await contratoService.getById(contratoId);

    if (!contrato || !contrato.secretariaId || !contrato.data) {
      alert("Não foi possível carregar os dados do contrato.");
      return;
    }

    // Extrair ano e mês da data do contrato
    const contratoDate = new Date(contrato.data);
    const year = contratoDate.getFullYear();
    const month = String(contratoDate.getMonth() + 1).padStart(2, "0");

    // 2️⃣ Deletar contrato usando o service
    await contratoService.delete(contratoId);
    alert("Contrato deletado com sucesso!");

    // 3️⃣ Redirecionar para a lista de contratos da secretaria com ano/mês
    router.push(
      `/contratosSecretaria/${contrato.secretariaId}?year=${year}&month=${month}`
    );
  } catch (err: any) {
    console.error(err);
    alert(err.message || "Erro ao deletar contrato");
  }
};


  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ProgressSpinner />
      </div>
    );

  if (error) return <p className="text-red-500 p-5">Erro: {error}</p>;
  if (!contrato) return <p className="p-5">Contrato não encontrado</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-5">
      <div className="w-full max-w-6xl mx-auto">
        {/* CABEÇALHO */}
        <div className="flex justify-between items-center mb-6">
          <Button
            icon="pi pi-arrow-left"
            label="Voltar"
            className="p-button-text p-button-sm text-blue-800"
            onClick={handleBack}
          />
          <h1 className="text-3xl font-bold text-center flex-1">
            Itens do Contrato: {contrato.nome}
          </h1>
          <Button
            label="Adicionar Item"
            icon="pi pi-plus"
            severity="success"
            className="p-button-sm"
            onClick={() => setIsModalOpen(true)}
          />
          <Button
            label="Deletar Contrato"
            icon="pi pi-trash"
            severity="danger"
            className="p-button-sm"
            onClick={handleDeleteContrato}
          />
        </div>

        {/* TABELA DE ITENS */}
        <ItensDataTable
          itens={itens}
          onToggleAprovado={handleToggleAprovado}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* MODAL DE ADIÇÃO DE ITEM */}
      <Dialog
        header="Novo Item"
        visible={isModalOpen}
        style={{ width: "40vw" }}
        modal
        onHide={() => setIsModalOpen(false)}
      >
        <div className="flex flex-col gap-3 p-3">
          <label>Nome do Item</label>
          <InputText
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            placeholder="Ex: Fornecimento de materiais"
            className="w-full"
          />

          <label>Descrição</label>
          <InputTextarea
            rows={3}
            value={novoDescricao}
            onChange={(e) => setNovoDescricao(e.target.value)}
            placeholder="Descreva o item brevemente"
            className="w-full"
          />

          <label>Quantidade</label>
          <InputText
            value={novoQuantidade}
            onChange={(e) => setNovoQuantidade(e.target.value)}
            className="w-full"
          />

          <label>Preço Unitário</label>
          <InputText
            value={novoPrecoUnitario}
            onChange={(e) => setNovoPrecoUnitario(e.target.value)}
            className="w-full"
          />

          <label>Data</label>
          <InputText
            type="date"
            value={novoData}
            onChange={(e) => setNovoData(e.target.value)}
            className="w-full"
          />

          <label>Unidade de Medida</label>
          <InputText
            value={novoUnidade}
            onChange={(e) => setNovoUnidade(e.target.value)}
            className="w-full"
          />

          <Button
            label="Salvar Item"
            icon="pi pi-check"
            className="p-button-success mt-3"
            onClick={handleSaveItem}
          />
        </div>
      </Dialog>
    </div>
  );
}
