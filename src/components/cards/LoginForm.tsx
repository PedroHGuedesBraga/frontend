"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";
import { authService } from "@/services/authService";

export function LoginForm() {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // toggle admin/usuario
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let data;

      if (isAdmin) {
        data = await authService.loginAdmin(cpf, senha);
      } else {
        data = await authService.loginUsuario(cpf, senha);
      }

      if (data?.token) {
        alert("Login bem-sucedido!");
        if (isAdmin) {
          router.push("/home");
        } else if (data.user?.secretariaId) {
          router.push(`/mesesSecretaria/${data.user.secretariaId}`);
        } else {
          alert("Usuário sem secretaria atribuída.");
        }
      } else {
        alert("CPF ou senha inválidos.");
      }
    } catch (err: any) {
      console.error("Erro no login:", err);
      alert(err?.response?.data?.message || "Erro ao efetuar login.");
    } finally {
      setLoading(false);
    }
  };

  const cardTitle = <h1 className="text-2xl font-bold">Acesso ao Sistema</h1>;

  return (
    <div className="flex justify-content-center align-items-center min-h-screen surface-ground">
      <Card title={cardTitle} className="md:w-30rem shadow-6 p-fluid">
        <form onSubmit={handleLogin} className="p-fluid">
          {/* CPF */}
          <div className="field mb-4">
            <label htmlFor="cpf" className="font-semibold mb-2 block">
              CPF
            </label>
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-user"></i>
              </span>
              <InputText
                id="cpf"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="Digite seu CPF"
                required
              />
            </div>
          </div>

          {/* Senha */}
          <div className="field mb-3">
            <label htmlFor="senha" className="font-semibold mb-2 block">
              Senha
            </label>
            <Password
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              toggleMask
              feedback={false}
              className="w-full"
              inputClassName="w-full"
              required
            />
          </div>

          {/* Link para alternar login Admin */}
          <div className="mb-3 text-right">
            <span
              className="text-blue-600 cursor-pointer hover:underline text-sm"
              onClick={() => setIsAdmin(!isAdmin)}
            >
              {isAdmin ? "Entrar como Usuário" : "Entrar como Administrador"}
            </span>
          </div>

          {/* Botão Login */}
          <Button
            label={isAdmin ? "Entrar como Admin" : "Entrar como Usuário"}
            icon={classNames("pi", { "pi-spin pi-spinner": loading, "pi-sign-in": !loading })}
            type="submit"
            className="p-button-lg w-full"
            disabled={loading}
          />
        </form>
      </Card>
    </div>
  );
}
