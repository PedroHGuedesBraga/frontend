"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ProgressSpinner } from 'primereact/progressspinner'; // Spinner para o loading
import { Card } from 'primereact/card'; // Card para mensagens
// Certifique-se de que o caminho abaixo está correto para o seu HomeCard
import HomeCard from '@/components/cards/HomeCard'; 

// URL do seu backend NestJS, que você mencionou:
const API_URL = 'http://localhost:3000/secretaria'; 

// Definindo a interface para o tipo de dado que esperamos receber
interface Secretaria {
  id: string;
  nome: string;
  // O restante do JSON (contratos) não é necessário para o mapeamento
}

export default function HomePage() {
  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSecretarias = async () => {
      try {
        const response = await axios.get<Secretaria[]>(API_URL);
        
        // Verifica se a resposta é um array (garantia)
        if (Array.isArray(response.data)) {
            setSecretarias(response.data);
        } else {
            setSecretarias([]);
        }

        setError(null);
      } catch (err) {
        console.error("Erro ao buscar secretarias:", err);
        setError("Não foi possível carregar os dados. Verifique se o servidor NestJS está rodando em http://localhost:3000.");
      } finally {
        setLoading(false);
      }
    };

    fetchSecretarias();
  }, []); // Roda apenas uma vez, na montagem do componente

  // =================================================================
  // TELAS DE STATUS
  // =================================================================

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center min-h-screen">
        <ProgressSpinner aria-label="Carregando Secretarias" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-content-center m-5">
        <Card title="Erro de Conexão" className="shadow-4 surface-card">
          <p className="p-text-danger">{error}</p>
        </Card>
      </div>
    );
  }

  if (secretarias.length === 0) {
    return (
      <div className="flex justify-content-center m-5">
        <Card title="Nenhuma Secretaria" className="shadow-4 surface-card">
          <p>Nenhuma secretaria encontrada para exibir no momento.</p>
        </Card>
      </div>
    );
  }

  // =================================================================
  // RENDERIZAÇÃO DOS CARDS NA GRID RESPONSIVA
  // =================================================================

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-4 text-900">Lista de Secretarias</h1>
      
      {/* GRID RESPONSIVA USANDO PRIME FLEX CLASSES (col, md:col-6, lg:col-3) */}
      <div className="grid">
        {secretarias.map((secretaria) => (
          // O div externo define o tamanho da coluna e o espaçamento (mb-4)
          <div key={secretaria.id} className="col-12 md:col-6 lg:col-3 mb-4">
            <HomeCard
              secretaryId={secretaria.id}
              secretaryName={secretaria.nome}
            />
          </div>
        ))}
      </div>
    </div>
  );
}