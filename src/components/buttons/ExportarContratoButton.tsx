// src/components/ExportarContratoButton.tsx
"use client";

import React, { useState } from 'react';
import { Button } from 'primereact/button';
import axios from 'axios';
import { convertSecretariaToCsv, downloadCsv } from '@/utils/exportToCsv'; // Ajuste o caminho

// Tipos para garantir a compatibilidade com a resposta da sua API
interface Item {
    id: string;
    nome: string;
    descricao: string;
    quantidadeItem: number | string;
    precoUnitario: number | string;
    data: string;
    unidadeDeMedida: string;
    aprovado: boolean;
}

interface Contrato {
    id: string;
    nome: string;
    data: string;
    status: string;
    aprovado: boolean;
    itensQuantidade: number;
    itens?: Item[];
}

interface Secretaria {
    id: string;
    nome: string;
    contratos: Contrato[];
}

const API_URL = 'http://localhost:3000/secretaria'; 

interface ExportarButtonProps {
    secretariaId: string;
    secretariaNome: string;
}

export const ExportarContratoButton: React.FC<ExportarButtonProps> = ({ 
    secretariaId, 
    secretariaNome 
}) => {
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        if (!secretariaId) {
            alert("ID da secretaria não encontrado.");
            return;
        }

        setLoading(true);
        try {
            // 1. Busca os dados da secretaria e seus contratos/itens
            const response = await axios.get<Secretaria>(`${API_URL}/${secretariaId}`);
            const secretariaData = response.data;
            
            // 2. Converte o JSON para CSV
            const csvContent = convertSecretariaToCsv(secretariaData);

            // 3. Dispara o download
            const filename = `${secretariaNome}_Contratos_e_Itens.csv`.replace(/\s/g, '_');
            downloadCsv(csvContent, filename);

            alert(`Exportação da ${secretariaNome} concluída!`);

        } catch (err) {
            console.error("Erro ao exportar dados:", err);
            alert("Erro ao buscar dados para exportação. Verifique o console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleExport}
            label={loading ? "Exportando..." : "Exportar Contratos (CSV)"}
            icon="pi pi-file-excel"
            severity="info"
            className="p-button-sm"
            disabled={loading}
        />
    );
};

// Como o seu código anterior está usando `useSecretariaById`, 
// você pode remover ou ignorar o arquivo useSecretariaById.ts.
// A lógica de fetch para exportação está dentro deste componente.