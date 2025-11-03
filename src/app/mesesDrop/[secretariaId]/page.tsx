/*
"use client";

import React, { useState, useEffect } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { DraggableCard } from "@/components/droppable/DraggableCard";
import { DroppableArea } from "@/components/droppable/DroppableArea";
import { useParams, useRouter } from "next/navigation";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
import useMeses from "@/hooks/GET/useMeses";
import { useUpdateContrato } from "@/hooks/PATCH/useUpdateContrato";
import { ContratoDraggableCard } from "@/components/cards/ContratoDraggableCard";


interface Contract {
  id: string;
  name: string;
  date: string; 
}


interface Month {
  monthName: string;
  monthNumber: string;
  totalCount: number;
}

export default function DragPage() {
  const params = useParams();
  const router = useRouter();
  const secretariaId = params.secretariaId as string;

  
  const { meses, secretariaNome, loading, error, contratos } = useMeses(secretariaId);


  const { updateContrato, loading: patchLoading } = useUpdateContrato();

 
  const [contracts, setContracts] = useState<Contract[]>([]);

  
  const [cardParents, setCardParents] = useState<Record<string, string>>({});


  const months = meses.map((m: Month) => ({
    name: m.monthName,
    number: parseInt(m.monthNumber),
  }));

 
  useEffect(() => {
    if (contratos && contratos.length > 0) {
      
      const mappedContracts: Contract[] = contratos.map((c: any) => ({
        id: c.id,
        name: c.nome,
        date: c.data, 
      }));

   
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


  const handleDragEnd = async (event: DragEndEvent) => {
    const { over, active } = event;
    
 
    if (!over || over.id === cardParents[active.id as string]) {
        console.log("Contrato movido para a mesma coluna ou fora.");
        return;
    }

    const newMonthName = over.id as string;
    const contractId = active.id as string;
    
  
    const contractToUpdate = contracts.find((c) => c.id === contractId);

    if (contractToUpdate) {
      
        const monthNumber = months.find((m) => m.name === newMonthName)?.number;
        
        if (monthNumber) {
            const oldDate = new Date(contractToUpdate.date);
           
            const newDateObject = new Date(
                oldDate.getFullYear(),
                monthNumber - 1,
                oldDate.getDate()
            );
            
          
            const newDateString = newDateObject.toISOString().split("T")[0]; 

            
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

        
            try {
                
                const patchData = { 
                    data: newDateString, 
                  
                };

                await updateContrato(contractId, patchData);
                console.log(`Contrato ${contractId} atualizado com sucesso no backend para o mês ${newMonthName}.`);

            } catch (err) {
                console.error("Falha ao fazer o PATCH no contrato. Revertendo estado local...", err);
                
                
                alert(`Erro ao salvar a movimentação do contrato ${contractToUpdate.name}. Por favor, recarregue a página.`);
                
            }
        }
    }
  };


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

  return (
   <div style={{ padding: "20px" }}>
   

      
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
                    name={contract.name} 
                  />
                ))}
            </DroppableArea>
          ))}
        </div>
      </DndContext>
    </div>
  );
} */