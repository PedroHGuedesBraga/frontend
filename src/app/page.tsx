"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password'; // Componente de senha elegante
import { classNames } from 'primereact/utils'; // Para classes dinâmicas

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Lógica de Autenticação de Teste
    setTimeout(() => {
      setLoading(false);
      if (username === 'admin' && password === '123') {
        alert('Login bem-sucedido!');
        router.push('/home');
      } else {
        alert('Nome de usuário ou senha incorretos.');
      }
    }, 1500); // Simula um atraso de rede
  };

  // Título e Subtítulo do Card
  const cardTitle = <h1 className="text-2xl font-bold">Acesso ao Sistema</h1>;

  return (
    // Centraliza o formulário no meio da tela
    <div className="flex justify-content-center align-items-center min-h-screen surface-ground">
      
      <Card title={cardTitle} className="md:w-30rem shadow-6 p-fluid">
        
        <form onSubmit={handleLogin} className="p-fluid">
          
          {/* CAMPO USUÁRIO */}
          <div className="field mb-4">
            <label htmlFor="username" className="font-semibold mb-2 block">
              Usuário
            </label>
            <div className="p-inputgroup">
              {/* Ícone dentro do campo */}
              <span className="p-inputgroup-addon">
                <i className="pi pi-user"></i>
              </span>
              <InputText 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Digite seu CPF"
                required
              />
            </div>
          </div>

          {/* CAMPO SENHA */}
          <div className="field mb-5">
            <label htmlFor="password" className="font-semibold mb-2 block">
              Senha
            </label>
            <Password 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              toggleMask // Permite mostrar/esconder a senha
              feedback={false} // Remove a barra de força da senha
              className="w-full"
              inputClassName="w-full"
              required
            />
          </div>

          {/* BOTÃO LOGIN */}
          <Button 
            label="Entrar" 
            icon={classNames('pi', {'pi-spin pi-spinner': loading, 'pi-sign-in': !loading})}
            type="submit" 
            className="p-button-lg" 
            disabled={loading}
          />
          
        </form>
      </Card>
    </div>
  );
}