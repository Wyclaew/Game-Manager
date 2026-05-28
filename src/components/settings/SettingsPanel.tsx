// components/settings/SettingsPanel.tsx — Ayarlar Sayfası

import { useState, useEffect } from 'react';
import {
  Save, RefreshCw, Monitor, Swords, Key,
  User, FolderOpen, AlertCircle, Wifi
} from 'lucide-react';
import Database from '@tauri-apps/plugin-sql';
import { useSync } from '../../hooks/useSync';
import { useGameStore } from '../../stores/useGameStore';
import { InputField } from '../ui/InputField';
import { ActionButton } from '../ui/ActionButton';

export function SettingsPanel() {
  const [steamApiKey, setSteamApiKey] = useState('');
  const [steamId, setSteamId] = useState('');
  const [steamPath, setSteamPath] = useState('');
  const [epicPath, setEpicPath] = useState('');
  const [autoSync, setAutoSync] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [syncError, setSyncError] = useState('');

  const { syncSteam, syncEpic } = useSync();
  const { isSyncing, syncMessage, addToast } = useGameStore();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const db = await Database.load('sqlite:gamemanager.db');
      const rows = await db.select<{ key: string; value: string }[]>(
        `SELECT key, value FROM settings`
      );
      const settingsMap = new Map(rows.map(r => [r.key, r.value]));

      setSteamApiKey(settingsMap.get('steam_api_key') ?? '');
      setSteamId(settingsMap.get('steam_id') ?? '');
      setSteamPath(settingsMap.get('steam_path') ?? '');
      setEpicPath(settingsMap.get('epic_path') ?? '');
      setAutoSync(settingsMap.get('auto_sync') !== 'false');
    } catch (err) {
      console.error('Ayarlar yüklenirken hata:', err);
      addToast('Ayarlar yüklenemedi', 'error');
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    setSyncError('');
    try {
      const db = await Database.load('sqlite:gamemanager.db');
      const settings = [
        ['steam_api_key', steamApiKey],
        ['steam_id', steamId],
        ['steam_path', steamPath],
        ['epic_path', epicPath],
        ['auto_sync', String(autoSync)],
      ];

      for (const [key, value] of settings) {
        await db.execute(
          `INSERT INTO settings (key, value, updated_at) VALUES ($1, $2, datetime('now'))
           ON CONFLICT(key) DO UPDATE SET value = $2, updated_at = datetime('now')`,
          [key, value]
        );
      }

      addToast('Ayarlar başarıyla kaydedildi', 'success');
    } catch (err) {
      console.error('Ayarlar kaydedilirken hata:', err);
      addToast('Ayarlar kaydedilemedi', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSteamSync = async () => {
    setSyncError('');
    try {
      await syncSteam(steamApiKey, steamId);
      addToast('Steam kütüphanesi başarıyla eşzamanlandı', 'success');
    } catch (err) {
      setSyncError(String(err));
      addToast('Steam eşzamanlama hatası', 'error');
    }
  };

  const handleEpicSync = async () => {
    setSyncError('');
    try {
      await syncEpic();
      addToast('Epic Games kütüphanesi başarıyla eşzamanlandı', 'success');
    } catch (err) {
      addToast('Epic Games eşzamanlama hatası', 'error');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 max-w-3xl select-none">
      {/* Başlık */}
      <div>
        <h2 className="text-xl font-black font-display text-text-bright tracking-wide mb-1 uppercase">
          Ayarlar
        </h2>
        <p className="text-xs text-text-secondary font-semibold">
          Platform entegrasyonları, dizinler ve genel uygulama ayarları
        </p>
      </div>

      {/* Steam Entegrasyonu */}
      <section
        className="rounded-2xl p-6 space-y-6 bg-[rgba(20,22,28,0.6)] border border-[rgba(255,255,255,0.04)] shadow-premium backdrop-blur-md"
      >
        <div className="flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-sky-500/10 border border-sky-500/25"
          >
            <Monitor size={18} className="text-sky-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-display text-text-bright tracking-wide uppercase">
              Steam Entegrasyonu
            </h3>
            <p className="text-[11px] text-text-secondary font-semibold">
              API anahtarınız ile kütüphane verilerini güvenle indirin
            </p>
          </div>
        </div>

        {/* Form Elemanları */}
        <div className="space-y-4">
          <InputField
            label="Steam API Anahtarı"
            type="password"
            value={steamApiKey}
            onChange={(e) => setSteamApiKey(e.target.value)}
            placeholder="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            icon={Key}
          />
          <p className="text-[11px] text-text-secondary px-1 font-semibold">
            API anahtarınızı{' '}
            <a href="https://steamcommunity.com/dev/apikey" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline font-bold">steamcommunity.com/dev/apikey</a>
            {' '}adresinden alabilirsiniz.
          </p>
        </div>

        <div className="space-y-4">
          <InputField
            label="SteamID64"
            type="text"
            value={steamId}
            onChange={(e) => setSteamId(e.target.value)}
            placeholder="76561198XXXXXXXXX"
            icon={User}
          />
          <p className="text-[11px] text-text-secondary px-1 font-semibold">
            Kullanıcı SteamID değerinizi{' '}
            <a href="https://steamid.io" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline font-bold">steamid.io</a>
            {' '}üzerinden bulabilirsiniz.
          </p>
        </div>

        <InputField
          label="Steam Kurulum Yolu"
          type="text"
          value={steamPath}
          onChange={(e) => setSteamPath(e.target.value)}
          placeholder="C:\Program Files (x86)\Steam"
          icon={FolderOpen}
        />

        <ActionButton
          variant="primary"
          icon={RefreshCw}
          onClick={handleSteamSync}
          disabled={isSyncing || !steamApiKey || !steamId}
          loading={isSyncing}
          className="w-full py-3.5 tracking-wider font-display text-[11px] shadow-[0_0_15px_rgba(249,115,22,0.2)]"
        >
          {isSyncing ? syncMessage : 'STEAM KÜTÜPHANESİNİ EŞZAMANLA'}
        </ActionButton>

        {syncError && (
          <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-rose-500/5 border border-rose-500/15">
            <AlertCircle size={15} className="text-rose-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-rose-300 font-semibold leading-relaxed">
              {syncError}
            </p>
          </div>
        )}
      </section>

      {/* Epic Games Entegrasyonu */}
      <section
        className="rounded-2xl p-6 space-y-6 bg-[rgba(20,22,28,0.6)] border border-[rgba(255,255,255,0.04)] shadow-premium backdrop-blur-md"
      >
        <div className="flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-teal-500/10 border border-teal-500/25"
          >
            <Swords size={18} className="text-teal-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-display text-text-bright tracking-wide uppercase">
              Epic Games Entegrasyonu
            </h3>
            <p className="text-[11px] text-text-secondary font-semibold">
              OAuth akışı ve cihaz kodları üzerinden Epic hesabınızı bağlayın
            </p>
          </div>
        </div>

        <InputField
          label="Epic Games Kurulum Yolu"
          type="text"
          value={epicPath}
          onChange={(e) => setEpicPath(e.target.value)}
          placeholder="C:\Program Files\Epic Games"
          icon={FolderOpen}
        />

        <ActionButton
          variant="secondary"
          icon={Wifi}
          onClick={handleEpicSync}
          disabled={isSyncing}
          className="w-full py-3.5 tracking-wider font-display text-[11px]"
        >
          EPIC GAMES HESABINI BAĞLA
        </ActionButton>
      </section>

      {/* Genel Ayarlar */}
      <section
        className="rounded-2xl p-6 space-y-6 bg-[rgba(20,22,28,0.6)] border border-[rgba(255,255,255,0.04)] shadow-premium backdrop-blur-md"
      >
        <h3 className="text-sm font-bold font-display text-text-bright tracking-wide uppercase">
          Genel Ayarlar
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-text-bright tracking-wide">
              AÇILIŞTA OTOMATİK EŞZAMANLAMA
            </p>
            <p className="text-[11px] text-text-secondary font-semibold mt-1">
              Uygulama açılırken bağlı platform kütüphanelerini otomatik olarak tarar
            </p>
          </div>
          <button
            className={`relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer outline-none ${
              autoSync ? 'bg-gradient-to-r from-orange-500 to-rose-600 shadow-[0_0_10px_rgba(249,115,22,0.3)]' : 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.05)]'
            }`}
            onClick={() => setAutoSync(!autoSync)}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                autoSync ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Kaydet Butonu */}
      <div className="flex justify-start">
        <ActionButton
          variant="primary"
          icon={Save}
          onClick={saveSettings}
          disabled={isSaving}
          loading={isSaving}
          className="py-3.5 px-8 font-display tracking-wider text-[11px] shadow-[0_0_20px_rgba(249,115,22,0.2)]"
        >
          AYARLARI KAYDET
        </ActionButton>
      </div>
    </div>
  );
}
