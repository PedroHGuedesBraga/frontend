import { useState } from "react";
import { itemService } from "@/services/item/itemService";
import { contratoService } from "@/services/contrato/contratoService";
import { Item } from "@/types/item";

export function useItemActions(contratoId: string, fetchItens: () => void, itensQuantidade?: number) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [novoNome, setNovoNome] = useState("");
  const [novoDescricao, setNovoDescricao] = useState("");
  const [novoQuantidade, setNovoQuantidade] = useState("1");
  const [novoPrecoUnitario, setNovoPrecoUnitario] = useState("0");
  const [novoData, setNovoData] = useState(new Date().toISOString().substring(0, 10));
  const [novoUnidade, setNovoUnidade] = useState("un");
  const [loading, setLoading] = useState(false);

  // --- ABRIR MODAL DE EDIÇÃO ---
  const handleEdit = (item: Item) => {
    setEditingItemId(item.id);
    setNovoNome(item.nome);
    setNovoDescricao(item.descricao || "");
    setNovoQuantidade(String(item.quantidadeItem));
    setNovoPrecoUnitario(String(item.precoUnitario));
    setNovoData(item.data ? item.data.substring(0, 10) : new Date().toISOString().substring(0, 10));
    setNovoUnidade(item.unidadeDeMedida || "un");
    setIsModalOpen(true);
  };

  // --- SALVAR ITEM (CRIAR OU EDITAR) ---
  const handleSaveItem = async () => {
    if (!novoNome.trim()) return alert("Preencha o nome do item.");
    setLoading(true);

    try {
      const quantidadeNum = Number(novoQuantidade.replace(",", "."));
      const precoNum = Number(novoPrecoUnitario.replace(",", "."));

      const payload: Partial<Item> = {
        nome: novoNome,
        descricao: novoDescricao,
        quantidadeItem: quantidadeNum,
        precoUnitario: precoNum,
        data: novoData,
        unidadeDeMedida: novoUnidade,
      };

      if (editingItemId) {
        // edição
        await itemService.update(editingItemId, payload);
      } else {
        // criação
        await itemService.create({ ...payload, contratoId, aprovado: false, id: "" });
        await contratoService.update(contratoId, { itensQuantidade: (itensQuantidade || 0) + 1 });
      }

      setIsModalOpen(false);
      fetchItens();

      // reset
      setNovoNome("");
      setNovoDescricao("");
      setNovoQuantidade("1");
      setNovoPrecoUnitario("0");
      setNovoData(new Date().toISOString().substring(0, 10));
      setNovoUnidade("un");
      setEditingItemId(null);

    } catch (err) {
      console.error(err);
      alert("Erro ao salvar item.");
    } finally {
      setLoading(false);
    }
  };

  // --- TOGGLE APROVADO ---
  const handleToggleAprovado = async (item: Item) => {
    try {
      await itemService.update(item.id, { aprovado: !item.aprovado });
      fetchItens();
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar aprovação do item.");
    }
  };

  // --- DELETE ITEM ---
  const handleDelete = async (item: Item) => {
    if (!window.confirm(`Deseja deletar o item ${item.nome}?`)) return;

    try {
      await itemService.delete(item.id);
      await contratoService.update(contratoId, { itensQuantidade: (itensQuantidade || 1) - 1 });
      fetchItens();
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar item.");
    }
  };

  return {
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
    loading,
    handleSaveItem,
    handleToggleAprovado,
    handleEdit,
    handleDelete,
  };
}
