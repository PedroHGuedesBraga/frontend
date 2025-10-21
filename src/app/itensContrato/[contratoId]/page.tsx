"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";

import useItens, { Item } from "@/hooks/GET/useItens";
import ItensDataTable from "@/components/cards/ItemCard";
import useAddItem from "@/hooks/POST/useAddItem";
import { useUpdateContrato } from "@/hooks/PATCH/useUpdateContrato";

export default function ItensContratoPage() {
  const params = useParams();
  const router = useRouter();
  const contratoId = params.contratoId as string;

  const { contrato, itens, loading, error } = useItens(contratoId);
  const { addItem, loading: addLoading, error: addError } = useAddItem();
  const { updateContrato } = useUpdateContrato();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Estados do modal seguindo o Entity ---
  const [novoNome, setNovoNome] = useState("");
  const [novoDescricao, setNovoDescricao] = useState("");
  const [novoQuantidade, setNovoQuantidade] = useState("1"); // string para aceitar decimais
  const [novoPrecoUnitario, setNovoPrecoUnitario] = useState("0"); // string
  const [novoData, setNovoData] = useState(
    new Date().toISOString().substring(0, 10)
  ); // YYYY-MM-DD
  const [novoUnidade, setNovoUnidade] = useState("un");

  // --- Função salvar item ---
  const handleSaveItem = async () => {
    if (!novoNome.trim()) {
      alert("Preencha o nome do item.");
      return;
    }

    try {
      // converte string para number, aceitando vírgula ou ponto
      const quantidadeNum = Number(novoQuantidade.replace(",", "."));
      const precoNum = Number(novoPrecoUnitario.replace(",", "."));

      const payload = {
        nome: novoNome,
        descricao: novoDescricao,
        quantidadeItem: quantidadeNum,
        precoUnitario: precoNum,
        data: novoData,
        unidadeDeMedida: novoUnidade,
        contratoId,
        aprovado:false
      };

      await addItem(payload);

      // Atualiza o contrato com +1 no itensQuantidade
      const novaQtd = (contrato?.itensQuantidade || 0) + 1;
      await updateContrato(contratoId, { itensQuantidade: novaQtd });

      alert("Item adicionado com sucesso!");
      setIsModalOpen(false);

      // reload da página
      router.refresh();

      // Limpa os campos do modal
      setNovoNome("");
      setNovoDescricao("");
      setNovoQuantidade("1");
      setNovoPrecoUnitario("0");
      setNovoData(new Date().toISOString().substring(0, 10));
      setNovoUnidade("un");
    } catch (err) {
      console.error("Erro ao adicionar item:", err);
      alert("Erro ao adicionar item. Veja o console.");
    }
  };

  // --- Funções de ação ---
  const handleToggleAprovado = (id: string) => {
    console.log(`[AÇÃO] Toggle Aprovação do Item: ${id}`);
  };

  const handleEdit = (item: Item) => {
    console.log("[AÇÃO] Editar Item:", item.id);
  };

  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja deletar o item ${id}?`
    );
    if (confirmDelete) {
      console.log("[AÇÃO] Deletar Item:", id);
    }
  };

  const handleBack = () => {
    if (contrato?.secretaria?.id) {
      router.push(`/mesesSecretaria/${contrato.secretaria.id}`);
    } else {
      router.back();
    }
  };

  // --- UI Condicional ---
  if (loading)
    return (
      <div className="flex justify-content-center align-items-center min-h-screen">
        <ProgressSpinner />
      </div>
    );
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
          <h1 className="text-3xl text-black font-bold text-center flex-1">
            Itens do Contrato: {contrato.nome}
          </h1>
          <Button
            label="Adicionar Item"
            icon="pi pi-plus"
            severity="success"
            className="p-button-sm"
            onClick={() => setIsModalOpen(true)}
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
        <div className="flex flex-column gap-3 p-3">
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
            label={addLoading ? "Salvando..." : "Salvar Item"}
            icon="pi pi-check"
            className="p-button-success mt-3"
            onClick={handleSaveItem}
            disabled={addLoading}
          />

          {addError && <p className="text-red-500 mt-2">{addError}</p>}
        </div>
      </Dialog>
    </div>
  );
}
