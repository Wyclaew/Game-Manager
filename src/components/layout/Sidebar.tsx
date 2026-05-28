import React from 'react';
import {
  Gamepad2, Library, Monitor, Swords, FolderOpen,
  Heart, Clock, Trophy, Settings, RefreshCw, Menu, PanelLeftClose
} from 'lucide-react';
import { useGameStore } from '../../stores/useGameStore';
import { motion } from 'framer-motion';
import type { NavSection } from '../../types';

interface MenuItem {
  id: NavSection;
  label: string;
  icon: typeof Library;
  count?: number;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

export function Sidebar() {
  const { activeNav, setActiveNav, stats, isSyncing, syncMessage, isSidebarOpen, toggleSidebar } = useGameStore();

  const menuSections: MenuSection[] = [
    {
      title: 'KÜTÜPHANE',
      items: [
        { id: 'all', label: 'Tüm Oyunlar', icon: Library, count: stats.totalGames }
      ]
    },
    {
      title: 'PLATFORMLAR',
      items: [
        { id: 'steam', label: 'Steam', icon: Monitor, count: stats.steamGames },
        { id: 'epic', label: 'Epic Games', icon: Swords, count: stats.epicGames },
        { id: 'custom', label: 'Yerel Eklemeler', icon: FolderOpen, count: stats.customGames }
      ]
    },
    {
      title: 'KOLEKSİYONLAR',
      items: [
        { id: 'favorites', label: 'Favoriler', icon: Heart },
        { id: 'playing', label: 'Aktif Oynanan', icon: Gamepad2, count: stats.statusCounts.Playing },
        { id: 'backlog', label: 'Beklemede', icon: Clock, count: stats.statusCounts.Backlog },
        { id: 'completed', label: 'Tamamlandı', icon: Trophy, count: stats.statusCounts.Completed }
      ]
    }
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isSidebarOpen ? 304 : 88 }} // 304px = w-76
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className={`bg-[#08090C] border-r border-white/[0.03] flex flex-col h-screen z-20 relative transition-all duration-150 overflow-y-auto scrollbar-none ${
        isSidebarOpen ? 'px-6 py-8' : 'px-4 py-8'
      }`}
    >
      <div className="w-full flex-1">
        {/* Header */}
        <div className={`mb-10 flex items-center ${isSidebarOpen ? 'justify-between space-x-3' : 'justify-center'} w-full`}>
          {isSidebarOpen ? (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-500/10 border border-cyan-500/20 flex-shrink-0">
                <Gamepad2 className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white leading-none">
                  Game Manager
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 mt-1.5 bg-cyan-500/10 text-cyan-400 rounded-md border border-cyan-500/20 w-max tracking-wide">
                  V2.0 ALPHA
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => toggleSidebar()}
              className="p-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors focus:outline-none"
            >
              <Menu size={22} />
            </button>
          )}

          {isSidebarOpen && (
            <button
              onClick={() => toggleSidebar()}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors flex-shrink-0 focus:outline-none"
            >
              <PanelLeftClose size={20} />
            </button>
          )}
        </div>

        {/* Navigation Rows */}
        <div className="space-y-6">
          {menuSections.map((section) => (
            <div key={section.title} className="w-full">
              {isSidebarOpen ? (
                <span className="mt-10 mb-4 block text-[12px] font-bold tracking-widest text-slate-500 uppercase px-5">
                  {section.title}
                </span>
              ) : (
                <div className="h-[1px] bg-white/[0.03] my-8 w-full" />
              )}

              <div className="space-y-1.5">
                {section.items.map((item) => {
                  const isActive = activeNav === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setActiveNav(item.id)}
                      className={`relative flex items-center justify-between w-full ${
                        isSidebarOpen ? 'px-5' : 'justify-center px-0'
                      } py-4 my-1.5 rounded-xl cursor-pointer group transition-all duration-150 ease-out select-none ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500/[0.06] to-transparent'
                          : 'bg-transparent hover:bg-white/[0.02]'
                      }`}
                    >
                      {/* The Absolute Strict Marker */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-6 bg-cyan-400 rounded-r-md" />
                      )}

                      <div className="flex items-center space-x-4">
                        <item.icon
                          className={`w-[22px] h-[22px] transition-colors duration-150 flex-shrink-0 ${
                            isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                          }`}
                        />
                        {isSidebarOpen && (
                          <span
                            className={`text-[15px] transition-colors duration-150 tracking-wide whitespace-nowrap ${
                              isActive ? 'text-white font-semibold' : 'text-slate-300 group-hover:text-white font-medium'
                            }`}
                          >
                            {item.label}
                          </span>
                        )}
                      </div>

                      {isSidebarOpen && item.count !== undefined && item.count > 0 && (
                        <span className={`text-[12px] font-mono font-bold px-2.5 py-1 rounded-md transition-colors duration-150 ${
                          isActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/[0.04] group-hover:bg-white/[0.08] text-slate-400 group-hover:text-slate-200'
                        }`}>
                          {item.count}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full pt-8 mt-8 border-t border-white/[0.03] flex-shrink-0">
        {isSyncing && (
          <div className={`flex items-center ${isSidebarOpen ? 'space-x-3 px-5 py-4' : 'justify-center p-4'} rounded-xl bg-white/[0.02] border border-white/[0.04] mb-4 animate-pulse`}>
            <RefreshCw size={20} className="animate-spin text-cyan-400 flex-shrink-0" />
            {isSidebarOpen && (
              <span className="text-[14px] font-medium text-slate-300 truncate">
                {syncMessage || 'Eşzamanlanıyor...'}
              </span>
            )}
          </div>
        )}

        <div
          onClick={() => setActiveNav('settings')}
          className={`relative flex items-center justify-between w-full ${
            isSidebarOpen ? 'px-5' : 'justify-center px-0'
          } py-4 rounded-xl cursor-pointer group transition-all duration-150 ease-out select-none ${
            activeNav === 'settings'
              ? 'bg-gradient-to-r from-cyan-500/[0.06] to-transparent'
              : 'bg-transparent hover:bg-white/[0.02]'
          }`}
        >
          {activeNav === 'settings' && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-6 bg-cyan-400 rounded-r-md" />
          )}

          <div className="flex items-center space-x-4">
            <Settings
              className={`w-[22px] h-[22px] transition-colors duration-150 flex-shrink-0 ${
                activeNav === 'settings' ? 'text-white' : 'text-slate-400 group-hover:text-white'
              }`}
            />
            {isSidebarOpen && (
              <span
                className={`text-[15px] transition-colors duration-150 tracking-wide ${
                  activeNav === 'settings' ? 'text-white font-semibold' : 'text-slate-300 group-hover:text-white font-medium'
                }`}
              >
                Ayarlar
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
