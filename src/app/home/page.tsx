"use client";

import React, { useState, useEffect } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import { secretariaService } from "@/services/secretaria/secretariaService";
import { Secretaria } from "@/types/secretaria";
import HomeCard from "@/components/cards/HomeCard";

export default function HomePage() {
  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [novaSecretaria, setNovaSecretaria] = useState("");

  // ======================================
  // FETCH SECRETARIAS
  // ======================================
  useEffect(() => {
    const fetchSecretarias = async () => {
      try {
        const data = await secretariaService.getAll();
        setSecretarias(data);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar secretarias:", err);
        setError("Não foi possível carregar as secretarias. Verifique o servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchSecretarias();
  }, []);

  // ======================================
  // ADICIONAR SECRETARIA
  // ======================================
  const handleAddSecretaria = async () => {
    if (!novaSecretaria.trim()) return;

    try {
      const nova = await secretariaService.create({ nome: novaSecretaria });
      setSecretarias((prev) => [...prev, nova]);
      setNovaSecretaria("");
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao adicionar secretaria:", error);
    }
  };

  // ======================================
  // TELAS DE STATUS
  // ======================================

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

  // ======================================
  // RENDERIZAÇÃO DOS CARDS
  // ======================================

  return (
    <div className="p-5">
      <div className="flex justify-content-between align-items-center mb-4">
        <h1 className="text-3xl font-bold text-900">Lista de Secretarias</h1>
        <Button
          label="Adicionar Secretaria"
          icon="pi pi-plus"
          className="p-button-success"
          onClick={() => setShowModal(true)}
        />
      </div>

      <div className="grid">
        {secretarias.map((secretaria) => (
          <div key={secretaria.id} className="col-12 md:col-6 lg:col-3 mb-4">
            <HomeCard
              secretaryId={secretaria.id}
              secretaryName={secretaria.nome}
            />
          </div>
        ))}
      </div>

      {/* Modal para adicionar secretaria */}
      <Dialog
        header="Nova Secretaria"
        visible={showModal}
        style={{ width: "30vw" }}
        modal
        onHide={() => setShowModal(false)}
      >
        <div className="flex flex-column gap-3 p-3">
          <label htmlFor="nome">Nome da Secretaria</label>
          <InputText
            id="nome"
            value={novaSecretaria}
            onChange={(e) => setNovaSecretaria(e.target.value)}
            placeholder="Digite o nome da secretaria"
            className="w-full"
          />
          <Button
            label="Adicionar"
            icon="pi pi-check"
            className="p-button-success mt-2"
            onClick={handleAddSecretaria}
          />
        </div>
      </Dialog>
    </div>
  );
}
