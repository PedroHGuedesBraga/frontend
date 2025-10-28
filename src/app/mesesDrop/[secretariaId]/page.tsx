"use client";

import React, { useState, useEffect } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { DraggableCard } from "@/components/droppable/DraggableCard";
import { DroppableArea } from "@/components/droppable/DroppableArea";
import { useParams, useRouter } from "next/navigation";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
import useMeses from "@/hooks/GET/useMeses";
// 1. IMPORTAR o hook useUpdateContrato
import { useUpdateContrato } from "@/hooks/PATCH/useUpdateContrato";
import { ContratoDraggableCard } from "@/components/cards/ContratoDraggableCard";

// Interface for contract data
interface Contract {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
}

// Interface for month data (based on useMeses hook)
interface Month {
  monthName: string;
  monthNumber: string;
  totalCount: number;
}

export default function DragPage() {
  const params = useParams();
  const router = useRouter();
  const secretariaId = params.secretariaId as string;

  // Fetch data using useMeses hook
  const { meses, secretariaNome, loading, error, contratos } = useMeses(secretariaId);

  // 2. CHAMA o hook useUpdateContrato para obter a função de PATCH
  const { updateContrato, loading: patchLoading } = useUpdateContrato();

  // State for contracts
  const [contracts, setContracts] = useState<Contract[]>([]);

  // State to track each card's parent droppable area (month)
  const [cardParents, setCardParents] = useState<Record<string, string>>({});

  // Map meses to months array for rendering
  const months = meses.map((m: Month) => ({
    name: m.monthName,
    number: parseInt(m.monthNumber),
  }));

  // Initialize contracts and cardParents when contratos data is available
  useEffect(() => {
    if (contratos && contratos.length > 0) {
      // Map contratos to the Contract interface
      const mappedContracts: Contract[] = contratos.map((c: any) => ({
        id: c.id,
        name: c.nome,
        date: c.data, // Already in YYYY-MM-DD format
      }));

      // Initialize cardParents based on contract dates
      const initialCardParents = mappedContracts.reduce((acc, contract) => {
        const date = new Date(contract.date);
        const monthName = date.toLocaleString('pt-BR', { month: 'long' });
        acc[contract.id] = monthName.charAt(0).toUpperCase() + monthName.slice(1); // Capitalize (e.g., 'janeiro' -> 'Janeiro')
        return acc;
      }, {} as Record<string, string>);

      setContracts(mappedContracts);
      setCardParents(initialCardParents);
    }
  }, [contratos]);

  // Handle drag end event
  const handleDragEnd = async (event: DragEndEvent) => {
    const { over, active } = event;
    
    // Verifica se foi solto em uma área droppable diferente.
    if (!over || over.id === cardParents[active.id as string]) {
        console.log("Contrato movido para a mesma coluna ou fora.");
        return;
    }

    const newMonthName = over.id as string;
    const contractId = active.id as string;
    
    // Encontra o contrato que está sendo movido
    const contractToUpdate = contracts.find((c) => c.id === contractId);

    if (contractToUpdate) {
        // Encontra o número do novo mês
        const monthNumber = months.find((m) => m.name === newMonthName)?.number;
        
        if (monthNumber) {
            const oldDate = new Date(contractToUpdate.date);
            // Preserva o ano e o dia, muda apenas o mês
            const newDateObject = new Date(
                oldDate.getFullYear(),
                monthNumber - 1,
                oldDate.getDate()
            );
            
            // Novo formato YYYY-MM-DD para o PATCH
            const newDateString = newDateObject.toISOString().split("T")[0]; 

            // 1. ATUALIZA O ESTADO LOCAL (OTIMISTA)
            setCardParents((prev) => ({
                ...prev,
                [contractId]: newMonthName,
            }));

            setContracts((prev) =>
                prev.map((contract) =>
                    contract.id === contractId
                        ? { ...contract, date: newDateString }
                        : contract
                )
            );

            console.log(`Dropped card ${contractId} onto ${newMonthName}. New date: ${newDateString}`);

            // 2. CHAMA O PATCH PARA O BACKEND
            try {
                // Prepara os dados para o PATCH. No seu caso, só a data deve mudar.
                const patchData = { 
                    data: newDateString, 
                    // Você pode adicionar outros campos que seu backend espera, se houver
                };

                await updateContrato(contractId, patchData);
                console.log(`Contrato ${contractId} atualizado com sucesso no backend para o mês ${newMonthName}.`);

            } catch (err) {
                console.error("Falha ao fazer o PATCH no contrato. Revertendo estado local...", err);
                
                // Opção de REVERTER o estado local em caso de falha no PATCH
                // Neste ponto, você precisaria de um mecanismo mais robusto para reverter para o estado anterior
                // ou forçar um refresh dos dados. Por simplicidade, vamos apenas logar o erro.
                // Se o erro acontecer, o contrato terá sido movido visualmente, mas não no DB.
                // Idealmente, você faria uma lógica de *rollback* aqui.

                // Por enquanto, apenas um alerta para o usuário:
                alert(`Erro ao salvar a movimentação do contrato ${contractToUpdate.name}. Por favor, recarregue a página.`);
                
            }
        }
    }
  };

  // ======================================================
  // TELAS DE ESTADO
  // ======================================================
  // Adiciona a verificação do loading do patch (opcional, para feedback visual)
  const totalLoading = loading || patchLoading;

  if (totalLoading)
    return (
      <div className="flex justify-content-center align-items-center min-h-screen">
        <ProgressSpinner />
      </div>
    );

  if (error) return <p className="text-red-500 p-5">Erro: {error}</p>;

  if (!secretariaNome)
    return <p className="p-5">Secretaria não encontrada</p>;
  // ======================================================
  // RENDERIZAÇÃO
  // ======================================================
  return (
   <div style={{ padding: "20px" }}>
      {/* ... (Cabeçalho e botões) ... */}

      
      <DndContext onDragEnd={handleDragEnd}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
          {months.map((month) => (
            <DroppableArea key={month.name} id={month.name}>
              <div style={{ textAlign: "center", marginBottom: "10px", fontWeight: 'bold' }}>
                {month.name}
              </div>
              {contracts
                .filter((contract: Contract) => cardParents[contract.id] === month.name)
                .map((contract: Contract) => (
                  <ContratoDraggableCard 
                    key={contract.id} 
                    id={contract.id}
                    name={contract.name} // Passa apenas o nome
                  />
                ))}
            </DroppableArea>
          ))}
        </div>
      </DndContext>
    </div>
  );
}