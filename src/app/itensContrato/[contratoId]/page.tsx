// src/app/itensContrato/[contratoId]/page.tsx
"use client";

import React, { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";

// Hooks GET e POST existentes
import useItens, { Item } from "@/hooks/GET/useItens";
import useAddItem from "@/hooks/POST/useAddItem";
import { useUpdateContrato } from "@/hooks/PATCH/useUpdateContrato";
import { useUpdateItem } from "@/hooks/PATCH/useUpdateItem";
import { useDeleteItem } from "@/hooks/DELETE/useDeleteItem";
import { ExportarContratoIndividualButton } from "@/components/buttons/ExportarItemButton";

// 💡 NOVOS HOOKS E COMPONENTES
import { useItemModal } from "@/hooks/useItemModal"; 
import { ItemModal } from "@/components/cards/ItemModal";
import ItensDataTable from "@/components/cards/ItemCard";

export default function ItensContratoPage() {
    const params = useParams();
    const router = useRouter();
    const contratoId = params.contratoId as string;

    // 1. GERE A CHAVE DE RECARREGAMENTO (Para resolver o router.refresh)
    const [refreshKey, setRefreshKey] = useState(0);
    const forceRefresh = useCallback(() => {
        setRefreshKey(prev => prev + 1);
    }, []);

    // 2. HOOKS DE DADOS E CRUD
    const { contrato, itens, loading, error } = useItens(contratoId, refreshKey); // Passando a key
    const { addItem, loading: addLoading, error: addError } = useAddItem();
    const { updateContrato } = useUpdateContrato();
    const { updateItem, loading: updateLoading, error: updateError } = useUpdateItem();
    const { deleteItem, loading: deleteLoading } = useDeleteItem();

    // 3. HOOK DE MODAL (Toda a lógica de estado do formulário/modal está aqui)
    const {
        isModalOpen,
        itemEmEdicao,
        formState,
        setInputValue,
        openCreateModal,
        openEditModal,
        closeModal,
        getApiPayload,
    } = useItemModal();


    // --- Funções de Ação de CRUD (Orquestração) ---

    // ADICIONAR / EDITAR
    const handleSaveItem = async () => {
        if (!formState.nome.trim()) {
            alert("Preencha o nome do item.");
            return;
        }

        const isEditingMode = !!itemEmEdicao;
        const actionName = isEditingMode ? "atualizar" : "adicionar";

        try {
            const payload = getApiPayload(); // Converte string(código) para number(API)

            if (isEditingMode && itemEmEdicao) {
                // EDIÇÃO (PATCH)
                await updateItem(itemEmEdicao.id, payload);
                alert("Item atualizado com sucesso!");
            } else {
                // ADIÇÃO (POST)
                const addPayload = { ...payload, contratoId, aprovado: false };
                await addItem(addPayload);

                // Atualiza a contagem no contrato
                const novaQtd = (contrato?.itensQuantidade || 0) + 1;
                await updateContrato(contratoId, { itensQuantidade: novaQtd });
                alert("Item adicionado com sucesso!");
            }

            closeModal();
            forceRefresh(); // Força o recarregamento da tabela

        } catch (err) {
            console.error(`Erro ao ${actionName} item:`, err);
            // O erro será exibido pelo modal usando os erros dos hooks (addError/updateError)
        }
    };

    // PATCH: Toggle Aprovação
    const handleToggleAprovado = async (item: Item) => {
        const novoStatus = !item.aprovado;
        const confirmToggle = window.confirm(
            `Deseja ${novoStatus ? 'aprovar' : 'desaprovar'} o item: ${item.nome}?`
        );

        if (confirmToggle) {
            try {
                await updateItem(item.id, { aprovado: novoStatus });
                alert(`Item ${novoStatus ? 'aprovado' : 'desaprovado'} com sucesso!`);
                forceRefresh(); // Força o recarregamento da tabela
            } catch (err) {
                console.error("Erro ao alterar status de aprovação:", err);
                alert("Erro ao alterar status de aprovação. Veja o console.");
            }
        }
    };

    // DELETE: Deletar Item
    const handleDelete = async (item: Item) => {
        const confirmDelete = window.confirm(
            `Tem certeza que deseja deletar o item: ${item.nome}? Esta ação é irreversível.`
        );
        if (confirmDelete) {
            try {
                await deleteItem(item.id);

                // Atualiza a contagem no contrato
                const novaQtd = Math.max(0, (contrato?.itensQuantidade || 0) - 1);
                await updateContrato(contratoId, { itensQuantidade: novaQtd });

                alert("Item deletado com sucesso!");
                forceRefresh(); // Força o recarregamento da tabela
            } catch (err) {
                console.error("Erro ao deletar item:", err);
                alert("Erro ao deletar item. Veja o console.");
            }
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

    // Determina se está salvando
    const isSaving = itemEmEdicao ? updateLoading : addLoading;


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
                    <div className="flex gap-3">
                        {/* 💡 BOTÃO DE EXPORTAÇÃO (NOVO COMPONENTE) */}
                        <ExportarContratoIndividualButton
                            contrato={contrato}
                            loading={loading} // Passa o loading do useItens
                        />
                        </div>
                    <h1 className="text-3xl text-black font-bold text-center flex-1">
                        Itens do Contrato: {contrato.nome}
                    </h1>
                    {/* 💡 CONTAINER PARA OS BOTÕES */}
                    
                    <Button
                        label="Adicionar Item"
                        icon="pi pi-plus"
                        severity="success"
                        className="p-button-sm"
                        // 💡 Usando a função do hook de modal
                        onClick={openCreateModal} 
                    />
                </div>

                {/* TABELA DE ITENS */}
                <ItensDataTable
                    itens={itens}
                    onToggleAprovado={handleToggleAprovado}
                    // 💡 Usando a função do hook de modal
                    onEdit={openEditModal} 
                    onDelete={handleDelete}
                    loading={deleteLoading || updateLoading}
                />
            </div>

            {/* 💡 COMPONENTE MODAL SEPARADO */}
            <ItemModal
                isModalOpen={isModalOpen}
                itemEmEdicao={itemEmEdicao}
                formState={formState}
                setInputValue={setInputValue}
                closeModal={closeModal}
                onSave={handleSaveItem} // Chama a função que orquestra o save/update
                isSaving={isSaving}
                addError={addError}
                updateError={updateError}
            />
        </div>
    );
}