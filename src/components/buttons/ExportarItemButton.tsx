// src/components/ExportarContratoIndividualButton.tsx
"use client";

import React from 'react';
import { Button } from 'primereact/button';
// 💡 Importamos o tipo EXATO de dado do seu hook
import { ContratoComItens } from '@/hooks/GET/useItens'; 

// === FUNÇÕES DE UTILIDADE INLINE (Para manter a modularidade) ===

/**
 * Dispara o download de uma string CSV.
 * (Função reutilizada da solução anterior, pode estar em '@/utils/exportToCsv')
 */
const downloadCsv = (csvContent: string, filename: string) => {
    // Adiciona o BOM para garantir caracteres especiais no Excel
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};

/**
 * Converte o objeto ContratoComItens em uma string CSV.
 */
const convertContratoToCsv = (contrato: ContratoComItens): string => {
    
    const secretariaNome = contrato.secretaria?.nome || "Secretaria Desconhecida";

    const headers = [
        "Secretaria", "Contrato ID", "Contrato Nome", "Contrato Data", "Contrato Status", 
        "Item ID", "Item Nome", "Descrição", "Quantidade", "Preço Unitário", "Unidade", "Aprovado"
    ];
    let csv = headers.join(";") + "\n";

    const formatPrice = (price: number | string) => {
        const num = typeof price === 'string' ? parseFloat(price.replace(',', '.')) : price;
        // Formato brasileiro: 1.234,56
        return isNaN(num) ? '0,00' : num.toFixed(2).replace('.', ',');
    }

    const baseRow = [
        secretariaNome, 
        contrato.id, 
        contrato.nome, 
        contrato.data, 
        contrato.status
    ];

    if (contrato.itens && contrato.itens.length > 0) {
        contrato.itens.forEach(item => {
            const itemRow = [
                item.id,
                item.nome,
                // Limpeza básica para evitar problemas no CSV
                item.descricao.replace(/[\n;]/g, ' ').trim(), 
                item.quantidadeItem,
                formatPrice(item.precoUnitario),
                item.unidadeDeMedida,
                item.aprovado ? "SIM" : "NÃO"
            ];
            // Mapeia para string e junta com o delimitador
            csv += [...baseRow, ...itemRow].map(col => String(col)).join(";") + "\n";
        });
    } else {
        // Linha para contrato sem itens
        const emptyItemRow = ["-", "N/A", "N/A", "0", "0,00", "N/A", "NÃO"];
        csv += [...baseRow, ...emptyItemRow].map(col => String(col)).join(";") + "\n";
    }

    return csv;
};


// === COMPONENTE PRINCIPAL ===

interface ExportarButtonProps {
    contrato: ContratoComItens;
    loading: boolean;
}

export const ExportarContratoIndividualButton: React.FC<ExportarButtonProps> = ({ 
    contrato,
    loading 
}) => {
    
    const handleExport = () => {
        if (!contrato || contrato.itens.length === 0) {
            alert("Não há itens para exportar neste contrato.");
            return;
        }

        try {
            const csvContent = convertContratoToCsv(contrato);

            const filename = `${contrato.nome}_Itens_Export.csv`
                .replace(/\s/g, '_')
                .replace(/[/:*?"<>|]/g, ''); // Limpa nome do arquivo
            
            downloadCsv(csvContent, filename);

        } catch (error) {
            console.error("Erro ao exportar itens do contrato:", error);
            alert("Erro ao gerar o arquivo CSV. Verifique o console.");
        }
    };

    const isDataReady = !loading && !!contrato;

    return (
        <Button
            onClick={handleExport}
            label="Exportar Contrato (CSV)"
            icon="pi pi-file-excel"
            severity="info"
            className="p-button-sm"
            disabled={!isDataReady}
            loading={loading}
        />
    );
};