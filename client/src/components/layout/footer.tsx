import React from "react";
import { Link } from "wouter";

interface FooterProps {
  version: string;
  lastUpdate: string;
}

export function Footer({ version, lastUpdate }: FooterProps) {
  return (
    <footer className="bg-white dark:bg-darkbg-paper p-4 border-t border-neutral-100 dark:border-neutral-800 text-center text-xs text-neutral-500">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div>
          GRU IOT - Sistema de Monitoramento SGSO © {new Date().getFullYear()}
        </div>
        <div className="mt-2 md:mt-0 flex space-x-4">
          <Link href="/suporte" className="hover:text-primary">Suporte</Link>
          <Link href="/documentacao" className="hover:text-primary">Documentação</Link>
          <Link href="/privacidade" className="hover:text-primary">Política de Privacidade</Link>
        </div>
        <div className="mt-2 md:mt-0">
          Versão {version} | Última atualização: {lastUpdate}
        </div>
      </div>
      <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800 developer-credit">
        Desenvolvido por João Vitor Belasque • 
        <a 
          href="https://github.com/joaobelasque" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-primary hover:underline mx-1"
        >
          GitHub
        </a>
        • 
        <a 
          href="https://www.linkedin.com/in/joaobelasque" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-primary hover:underline mx-1"
        >
          LinkedIn
        </a>
      </div>
    </footer>
  );
}
