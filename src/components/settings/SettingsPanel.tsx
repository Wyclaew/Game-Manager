import { useState, useEffect } from 'react';
import { Monitor, Swords, Key, User, FolderOpen, AlertCircle, Wifi, RefreshCw } from 'lucide-react';
import Database from '@tauri-apps/plugin-sql';
import { invoke } from '@tauri-apps/api/core';
import { useSync } from '../../hooks/useSync';
import { useGameStore } from '../../stores/useGameStore';
import { InputField } from '../ui/InputField';
import { ActionButton } from '../ui/ActionButton';

export function SettingsPanel() {
  const [steamApiKey, setSteamApiKey] = useState('');
  const [steamId, setSteamId] = useState('');
  const [steamPath, setSteamPath] = useState('');
  const [epicPath, setEpicPath] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const { syncSteam, syncEpic } = useSync();
  const { isSyncing, syncMessage, addToast } = useGameStore();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const db = await Database.load('sqlite:gamemanager.db');
      const rows = await db.select<{ key: string; value: string }[]>(`SELECT key, value FROM settings`);
      const settingsMap = new Map(rows.map(r => [r.key, r.value]));

      setSteamApiKey(settingsMap.get('steam_api_key') ?? '');
      setSteamId(settingsMap.get('steam_id') ?? '');
      
      let loadedSteam = settingsMap.get('steam_path') ?? '';
      let loadedEpic = settingsMap.get('epic_path') ?? '';

      if (!loadedSteam || !loadedEpic) {
        try {
          const detected = await invoke<{ steam_path: string | null; epic_path: string | null; os: string }>('detect_platform_paths');
          if (!loadedSteam && detected.steam_path) loadedSteam = detected.steam_path;
          if (!loadedEpic && detected.epic_path) loadedEpic = detected.epic_path;
        } catch (e) {}
      }
      setSteamPath(loadedSteam);
      setEpicPath(loadedEpic);
    } catch (err) {
      console.error(err);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const db = await Database.load('sqlite:gamemanager.db');
      const settings = [
        ['steam_api_key', steamApiKey],
        ['steam_id', steamId],
        ['steam_path', steamPath],
        ['epic_path', epicPath]
      ];
      for (const [key, value] of settings) {
        await db.execute(
          `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
           ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')`,
          [key, value]
        );
      }
      addToast('Ayarlar başarıyla kaydedildi.', 'success');
    } catch (err) {
      addToast(`Kaydedilemedi: ${err instanceof Error ? err.message : String(err)}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full h-full max-w-7xl mx-auto flex flex-col select-none">
      
      {/* Header Info */}
      <div className="mb-12">
        <h2 className="text-[32px] font-bold tracking-tight text-white mb-3">Bağlantılar ve Entegrasyonlar</h2>
        <p className="text-[15px] text-slate-400 max-w-3xl leading-relaxed tracking-wide">
          Oyun kütüphanelerinizi bağlayarak koleksiyonunuzu tek bir çatı altında toplayın. Girdiğiniz özel API anahtarları yalnızca bu cihazda yerel veritabanınızda güvende tutulur.
        </p>
      </div>

      {/* Grid Layout: Premium Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        
        {/* Steam Card */}
        <section className="bg-[#0E1017]/90 border border-white/[0.05] rounded-2xl p-8 shadow-2xl shadow-black/50 flex flex-col">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/[0.03] border border-white/[0.06]">
              <Monitor size={26} className="text-white" />
            </div>
            <div>
              <h3 className="text-[19px] font-semibold text-white tracking-tight">Steam Ağı</h3>
              <p className="text-[14px] text-slate-400 mt-1">Geliştirici anahtarı ile otomatik veri akışı</p>
            </div>
          </div>

          <div className="flex flex-col gap-6 flex-1">
            <InputField label="Steam API Anahtarı" type="password" value={steamApiKey} onChange={e => setSteamApiKey(e.target.value)} icon={Key} placeholder="XXXXXXXXXXXXXXXXXXXX" />
            <InputField label="SteamID64 Profil Numarası" type="text" value={steamId} onChange={e => setSteamId(e.target.value)} icon={User} placeholder="76561198..." />
            <InputField label="Yerel Kurulum Yolu" type="text" value={steamPath} onChange={e => setSteamPath(e.target.value)} icon={FolderOpen} placeholder="C:\Program Files (x86)\Steam" />
          </div>

          <div className="mt-10 pt-8 border-t border-white/[0.03] flex justify-end">
            <ActionButton 
              variant="secondary" icon={RefreshCw} 
              onClick={() => syncSteam(steamApiKey, steamId, steamPath)} 
              disabled={isSyncing || !steamApiKey || !steamId} 
              loading={isSyncing}
            >
              {isSyncing ? syncMessage : 'Kütüphaneyi Yenile'}
            </ActionButton>
          </div>
        </section>

        {/* Epic Card */}
        <section className="bg-[#0E1017]/90 border border-white/[0.05] rounded-2xl p-8 shadow-2xl shadow-black/50 flex flex-col">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/[0.03] border border-white/[0.06]">
              <Swords size={26} className="text-white" />
            </div>
            <div>
              <h3 className="text-[19px] font-semibold text-white tracking-tight">Epic Games Store</h3>
              <p className="text-[14px] text-slate-400 mt-1">Cihaz yetkilendirmesi ile güvenli bağlantı</p>
            </div>
          </div>

          <div className="flex flex-col gap-6 flex-1">
            <InputField label="Yerel Kurulum Yolu" type="text" value={epicPath} onChange={e => setEpicPath(e.target.value)} icon={FolderOpen} placeholder="C:\Program Files\Epic Games" />
            
            <div className="mt-2 p-5 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
              <div className="flex items-start gap-4">
                <AlertCircle size={20} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                <p className="text-[14px] text-slate-300 leading-relaxed">
                  Epic Games bağlantısı için doğrudan <b>OAuth</b> cihaz yetkilendirmesi kullanılır. Tıkladığınızda açılan resmi sayfadan Game Manager için erişim onayı verin.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/[0.03] flex justify-end">
            <ActionButton variant="secondary" icon={Wifi} onClick={() => syncEpic(epicPath)} disabled={isSyncing}>
              Hesabı Yetkilendir
            </ActionButton>
          </div>
        </section>

      </div>

      {/* Global Save Action - The Anchor */}
      <div className="flex justify-end mt-2 mb-12">
        <ActionButton variant="primary" onClick={saveSettings} loading={isSaving} className="px-8 min-w-[200px] shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          Değişiklikleri Kaydet
        </ActionButton>
      </div>

    </div>
  );
}
