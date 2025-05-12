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
          GRU IOT - Aviation Safety Monitoring System © {new Date().getFullYear()}
        </div>
        <div className="mt-2 md:mt-0 flex space-x-4">
          <Link href="/support" className="hover:text-primary">Support</Link>
          <Link href="/documentation" className="hover:text-primary">Documentation</Link>
          <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
        </div>
        <div className="mt-2 md:mt-0">
          Version {version} | Last update: {lastUpdate}
        </div>
      </div>
      <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800 developer-credit">
        Developed by João Vitor Belasque • 
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
