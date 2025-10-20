"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Toolbar } from 'primereact/toolbar'; // Importa o Toolbar
import { Button } from 'primereact/button';   // Usamos o Button do PrimeReact

const Header = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Lógica de logout
    console.log("Usuário deslogado!");
    router.push('/'); // Redireciona para a página de login
  };

  // Conteúdo que deve ir para a esquerda (START)
  const startContent = (
    // Colocamos o nome da aplicação ou um logo aqui
    <h1 className="text-xl font-bold text-white">PREFEITURA DE CAMPINA GRANDE</h1>
  );

  // Conteúdo que deve ir para a direita (END)
  const endContent = (
    <nav className="flex space-x-4 items-center font-semibold">
      
      {/* LINK HOME */}
      <Link 
        href="/home" 
        className="text-white hover:text-blue-300 transition-colors flex items-center gap-1 p-2"
      >
        <i className="pi pi-home text-sm"></i>
        <span>HOME</span>
      </Link>
      
      {/* LINK ADMIN */}
      <Link 
        href="/adminPage" 
        className="text-white hover:text-blue-300 transition-colors flex items-center gap-1 p-2"
      >
        <i className="pi pi-user text-sm"></i>
        <span>ADMIN</span>
      </Link>
      
      {/* BOTÃO SAIR (usamos o Button do PrimeReact para garantir o estilo) */}
      <Button
        label="Sair"
        icon="pi pi-sign-out"
        iconPos="right"
        onClick={handleLogout}
        // p-button-danger para a cor vermelha e p-button-sm para ser compacto
        className="p-button-danger p-button-sm ml-4"
      />
    </nav>
  );

  return (
    // Removemos a tag <header> e usamos um div container com a cor de fundo
    <div style={{ backgroundColor: '#2a5683' }} className="shadow-md w-full">
      <div className="max-w-6xl mx-auto">
        <Toolbar 
          start={startContent} 
          end={endContent} 
          // Classes para garantir que o Toolbar não tenha fundo ou bordas próprias
          className="bg-transparent border-none p-4" 
        />
      </div>
    </div>
  );
};

export default Header;