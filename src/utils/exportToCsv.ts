// src/utils/exportToCsv.ts

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

// 💡 Função principal que transforma a hierarquia em linhas de CSV
export const convertSecretariaToCsv = (secretaria: Secretaria): string => {
    // Cabeçalho do CSV
    const headers = [
        "Secretaria", "Contrato ID", "Contrato Nome", "Contrato Data", "Contrato Status", 
        "Item ID", "Item Nome", "Descrição", "Quantidade", "Preço Unitário", "Unidade", "Aprovado"
    ];
    let csv = headers.join(";") + "\n";

    secretaria.contratos.forEach(contrato => {
        // Formata o preço unitário
        const formatPrice = (price: number | string) => 
            (typeof price === 'string' ? price : price.toFixed(2)).replace('.', ',');

        // Linha base do contrato
        const baseRow = [
            secretaria.nome, 
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
                    item.descricao.replace(/[\n;]/g, ' '), // Remove quebras de linha/ponto e vírgula da descrição
                    item.quantidadeItem,
                    formatPrice(item.precoUnitario),
                    item.unidadeDeMedida,
                    item.aprovado ? "SIM" : "NÃO"
                ];
                csv += [...baseRow, ...itemRow].join(";") + "\n";
            });
        } else {
            // Se o contrato não tiver itens, lista apenas o contrato
            const emptyItemRow = ["-", "N/A", "N/A", "0", "0,00", "N/A", "NÃO"];
            csv += [...baseRow, ...emptyItemRow].join(";") + "\n";
        }
    });

    return csv;
};

// 💡 Função para disparar o download
export const downloadCsv = (csvContent: string, filename: string) => {
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
    }
};
export const convertContratoToCsv = (contrato: Contrato, secretariaNome: string): string => {
    // Cabeçalho do CSV
    const headers = [
        "Secretaria", "Contrato ID", "Contrato Nome", "Contrato Data", "Contrato Status", 
        "Item ID", "Item Nome", "Descrição", "Quantidade", "Preço Unitário", "Unidade", "Aprovado"
    ];
    let csv = headers.join(";") + "\n";

    // Função auxiliar para formatação de preço
    const formatPrice = (price: number | string) => {
        const num = typeof price === 'string' ? parseFloat(price.replace(',', '.')) : price;
        return isNaN(num) ? '0,00' : num.toFixed(2).replace('.', ',');
    }

    // Linha base do contrato (Secretaria é passada como parâmetro)
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
                item.descricao.replace(/[\n;]/g, ' ').trim(), 
                item.quantidadeItem,
                formatPrice(item.precoUnitario),
                item.unidadeDeMedida,
                item.aprovado ? "SIM" : "NÃO"
            ];
            csv += [...baseRow, ...itemRow].map(col => String(col)).join(";") + "\n";
        });
    } else {
        // Se não houver itens
        const emptyItemRow = ["-", "N/A", "N/A", "0", "0,00", "N/A", "NÃO"];
        csv += [...baseRow, ...emptyItemRow].map(col => String(col)).join(";") + "\n";
    }

    return csv;
};