import React, { useState } from "react";
import { Link } from "wouter";
import { useTheme } from "@/contexts/theme-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItem {
  label: string;
  icon: string;
  route: string;
  active?: boolean;
}

interface HeaderProps {
  currentTime: string;
  notificationCount: number;
  userName: string;
  currentRoute: string;
}

const navItems: NavItem[] = [
  { label: "Visão Geral", icon: "dashboard", route: "/" },
  { label: "Pistas", icon: "flight_land", route: "/pistas" },
  { label: "Meteorologia", icon: "cloud", route: "/meteorologia" },
  { label: "Equipamentos", icon: "settings", route: "/equipamentos" },
  { label: "Incidentes", icon: "warning", route: "/incidentes" },
  { label: "Análises", icon: "insights", route: "/analises" }
];

export function Header({ currentTime, notificationCount, userName, currentRoute }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="bg-white dark:bg-darkbg-paper shadow-md z-10 sticky top-0">
      <div className="px-4 py-2 md:px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="material-icons text-primary-dark dark:text-primary-light">flight_takeoff</span>
          <h1 className="text-lg md:text-xl font-bold">
            GRU IOT <span className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base font-normal">| SGSO Dashboard</span>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="hidden md:block text-sm text-neutral-600 dark:text-neutral-300">{currentTime}</span>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="rounded-full h-9 w-9 p-0"
          >
            <span className="material-icons dark:hidden">dark_mode</span>
            <span className="material-icons hidden dark:block">light_mode</span>
          </Button>
          
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full h-9 w-9 p-0"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <span className="material-icons">notifications</span>
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-critical rounded-full flex items-center justify-center text-white text-xs">
                  {notificationCount}
                </span>
              )}
            </Button>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-white">
                    <span className="material-icons text-sm">person</span>
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block">{userName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <nav className="px-4 py-1 md:px-6 flex items-center space-x-1 md:space-x-4 overflow-x-auto bg-white dark:bg-darkbg-paper border-t border-neutral-100 dark:border-neutral-800">
        {navItems.map((item) => (
          <Link key={item.route} href={item.route}>
            <Button
              variant={currentRoute === item.route ? "default" : "ghost"}
              className={`px-3 py-2 text-sm rounded-md flex items-center space-x-1 ${
                currentRoute === item.route 
                  ? "bg-primary-light text-white" 
                  : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              <span className="material-icons text-sm">{item.icon}</span>
              <span>{item.label}</span>
            </Button>
          </Link>
        ))}
      </nav>
    </header>
  );
}
