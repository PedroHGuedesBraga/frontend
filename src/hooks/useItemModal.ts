// src/hooks/useItemModal.ts
import { useState, useCallback } from "react";
import { Item } from "@/hooks/GET/useItens"; // Ajuste o caminho conforme necessário

// Define os estados iniciais de um novo item
const initialFormState = {
    nome: "",
    descricao: "",
    quantidade: "1",
    precoUnitario: "0",
    data: new Date().toISOString().substring(0, 10),
    unidade: "un",
};

export interface FormState {
    nome: string;
    descricao: string;
    quantidade: string; // Mantemos string para aceitar vírgula no input
    precoUnitario: string; // Mantemos string para aceitar vírgula no input
    data: string;
    unidade: string;
}

// Hook Customizado
export const useItemModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemEmEdicao, setItemEmEdicao] = useState<Item | null>(null);
    const [formState, setFormState] = useState<FormState>(initialFormState);

    const resetFormState = useCallback(() => {
        setFormState(initialFormState);
        setItemEmEdicao(null);
    }, []);

    const openCreateModal = useCallback(() => {
        resetFormState();
        setIsModalOpen(true);
    }, [resetFormState]);

    const openEditModal = useCallback((item: Item) => {
        setItemEmEdicao(item);
        setFormState({
            nome: item.nome,
            descricao: item.descricao || "",
            // Conversão de número para string com vírgula para display
            quantidade: String(item.quantidadeItem).replace('.', ','),
            precoUnitario: String(item.precoUnitario).replace('.', ','),
            data: item.data ? item.data.substring(0, 10) : initialFormState.data,
            unidade: item.unidadeDeMedida,
        });
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        resetFormState();
    }, [resetFormState]);

    const setInputValue = useCallback((field: keyof FormState, value: string) => {
        setFormState(prev => ({ ...prev, [field]: value }));
    }, []);

    // Função que converte o estado do formulário para o Payload da API (number, ponto)
    const getApiPayload = useCallback(() => {
        const quantidadeNum = Number(formState.quantidade.replace(",", "."));
        const precoNum = Number(formState.precoUnitario.replace(",", "."));

        return {
            nome: formState.nome,
            descricao: formState.descricao,
            quantidadeItem: quantidadeNum,
            precoUnitario: precoNum,
            data: formState.data,
            unidadeDeMedida: formState.unidade,
        };
    }, [formState]);


    return {
        isModalOpen,
        itemEmEdicao,
        formState,
        setInputValue,
        openCreateModal,
        openEditModal,
        closeModal,
        getApiPayload,
        resetFormState, // mantido caso precise de reset externo
    };
};