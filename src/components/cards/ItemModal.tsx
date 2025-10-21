// src/components/ItemModal.tsx
import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { FormState } from '@/hooks/useItemModal'; // Ajuste o caminho

interface ItemModalProps {
    isModalOpen: boolean;
    itemEmEdicao: any | null; // Pode ser Item ou null
    formState: FormState;
    setInputValue: (field: keyof FormState, value: string) => void;
    closeModal: () => void;
    onSave: () => void;
    isSaving: boolean;
    addError: string | null;
    updateError: string | null;
}

export const ItemModal: React.FC<ItemModalProps> = ({
    isModalOpen,
    itemEmEdicao,
    formState,
    setInputValue,
    closeModal,
    onSave,
    isSaving,
    addError,
    updateError,
}) => {
    const modalHeader = itemEmEdicao ? "Editar Item" : "Novo Item";
    const saveButtonLabel = itemEmEdicao
        ? (isSaving ? "Atualizando..." : "Salvar Edição")
        : (isSaving ? "Salvando..." : "Salvar Item");

    return (
        <Dialog
            header={modalHeader}
            visible={isModalOpen}
            style={{ width: "40vw" }}
            modal
            onHide={closeModal}
        >
            <div className="flex flex-column gap-3 p-3">
                <label>Nome do Item</label>
                <InputText
                    value={formState.nome}
                    onChange={(e) => setInputValue("nome", e.target.value)}
                    placeholder="Ex: Fornecimento de materiais"
                    className="w-full"
                />

                <label>Descrição</label>
                <InputTextarea
                    rows={3}
                    value={formState.descricao}
                    onChange={(e) => setInputValue("descricao", e.target.value)}
                    placeholder="Descreva o item brevemente"
                    className="w-full"
                />

                <label>Quantidade</label>
                <InputText
                    value={formState.quantidade}
                    onChange={(e) => setInputValue("quantidade", e.target.value)}
                    className="w-full"
                />

                <label>Preço Unitário</label>
                <InputText
                    value={formState.precoUnitario}
                    onChange={(e) => setInputValue("precoUnitario", e.target.value)}
                    className="w-full"
                />

                <label>Data</label>
                <InputText
                    type="date"
                    value={formState.data}
                    onChange={(e) => setInputValue("data", e.target.value)}
                    className="w-full"
                />

                <label>Unidade de Medida</label>
                <InputText
                    value={formState.unidade}
                    onChange={(e) => setInputValue("unidade", e.target.value)}
                    className="w-full"
                />

                <Button
                    label={saveButtonLabel}
                    icon="pi pi-check"
                    className="p-button-success mt-3"
                    onClick={onSave}
                    disabled={isSaving}
                />

                {/* Exibição de Erro */}
                {!itemEmEdicao && addError && <p className="text-red-500 mt-2">{addError}</p>}
                {itemEmEdicao && updateError && <p className="text-red-500 mt-2">{updateError}</p>}
            </div>
        </Dialog>
    );
};