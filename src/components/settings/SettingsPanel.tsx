// components/settings/SettingsPanel.tsx — Ayarlar Sayfası (Concept A)
// Steam API Key, SteamID64, Epic hesap bilgileri, asimetrik butonlar ve Toast bildirim entegrasyonu

import { useState, useEffect } from 'react';
import {
  Save, RefreshCw, Monitor, Swords, Key,
  User, FolderOpen, AlertCircle, Wifi
} from 'lucide-react';
import Database from '@tauri-apps/plugin-sql';
import { useSync } from '../../hooks/useSync';
import { useGameStore } from '../../stores/useGameStore';

export function SettingsPanel() {
  // Form durumları
  const [steamApiKey, setSteamApiKey] = useState('');
  const [steamId, setSteamId] = useState('');
  const [steamPath, setSteamPath] = useState('');
  const [epicPath, setEpicPath] = useState('');
  const [autoSync, setAutoSync] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [syncError, setSyncError] = useState('');

  const { syncSteam, syncEpic } = useSync();
  const { isSyncing, syncMessage, addToast } = useGameStore();

  // Ayarları veritabanından yükle
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

  // Ayarları veritabanına kaydet
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

  // Steam senkronizasyonu başlat
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

  // Epic senkronizasyonu başlat
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
    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 max-w-3xl animate-fade-in select-none">
      {/* Başlık */}
      <div>
        <h2 className="text-2xl font-bold font-display text-text-bright mb-1">
          Ayarlar
        </h2>
        <p className="text-sm text-text-secondary">
          Platform bağlantıları ve uygulama yapılandırması
        </p>
      </div>

      {/* ==========================================
          Steam Yapılandırması
          ========================================== */}
      <section
        className="rounded-2xl p-6 space-y-5 bg-bg-secondary border border-border-subtle shadow-premium"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-sky-500/10"
          >
            <Monitor size={18} className="text-sky-400" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-text-bright">
              Steam Entegrasyonu
            </h3>
            <p className="text-xs text-text-secondary">
              Steam Web API ile kütüphanenizi senkronize edin
            </p>
          </div>
        </div>

        {/* Steam API Key */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-wider">
            <Key size={13} className="text-accent-orange" />
            Steam API Anahtarı
          </label>
          <input
            type="password"
            value={steamApiKey}
            onChange={(e) => setSteamApiKey(e.target.value)}
            placeholder="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            className="input-premium w-full font-mono text-xs"
          />
          <p className="text-xs text-text-muted mt-1.5">
            API anahtarınızı{' '}
            <a href="https://steamcommunity.com/dev/apikey" target="_blank" rel="noopener noreferrer" className="text-accent-orange hover:underline font-semibold">steamcommunity.com/dev/apikey</a>
            {' '}adresinden alabilirsiniz.
          </p>
        </div>

        {/* SteamID64 */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-wider">
            <User size={13} className="text-accent-orange" />
            SteamID64
          </label>
          <input
            type="text"
            value={steamId}
            onChange={(e) => setSteamId(e.target.value)}
            placeholder="76561198XXXXXXXXX"
            className="input-premium w-full font-mono text-xs"
          />
          <p className="text-xs text-text-muted mt-1.5">
            SteamID'nizi{' '}
            <a href="https://steamid.io" target="_blank" rel="noopener noreferrer" className="text-accent-orange hover:underline font-semibold">steamid.io</a>
            {' '}üzerinden bulabilirsiniz.
          </p>
        </div>

        {/* Steam Kurulum Yolu */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-wider">
            <FolderOpen size={13} className="text-accent-orange" />
            Steam Kurulum Yolu
          </label>
          <input
            type="text"
            value={steamPath}
            onChange={(e) => setSteamPath(e.target.value)}
            className="input-premium w-full font-mono text-xs"
          />
        </div>

        {/* Steam Senkronizasyon Butonu */}
        <button
          className="btn-primary flex items-center gap-2.5 w-full justify-center py-3 cursor-pointer"
          onClick={handleSteamSync}
          disabled={isSyncing || !steamApiKey || !steamId}
          style={{
            opacity: isSyncing || !steamApiKey || !steamId ? 0.5 : 1,
          }}
        >
          <RefreshCw size={15} className={isSyncing ? 'animate-spin' : ''} />
          {isSyncing ? syncMessage : 'Steam Kütüphanesini Senkronize Et'}
        </button>

        {syncError && (
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/25">
            <AlertCircle size={15} className="text-accent-rose flex-shrink-0 mt-0.5" />
            <p className="text-xs text-accent-rose font-medium">
              {syncError}
            </p>
          </div>
        )}
      </section>

      {/* ==========================================
          Epic Games Yapılandırması
          ========================================== */}
      <section
        className="rounded-2xl p-6 space-y-5 bg-bg-secondary border border-border-subtle shadow-premium"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent-teal/10"
          >
            <Swords size={18} className="text-accent-teal" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-text-bright">
              Epic Games Entegrasyonu
            </h3>
            <p className="text-xs text-text-secondary">
              OAuth akışı ile Epic Games kütüphanenizi bağlayın
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-wider">
            <FolderOpen size={13} className="text-accent-teal" />
            Epic Games Kurulum Yolu
          </label>
          <input
            type="text"
            value={epicPath}
            onChange={(e) => setEpicPath(e.target.value)}
            className="input-premium w-full font-mono text-xs"
          />
        </div>

        <button
          className="flex items-center gap-2.5 w-full justify-center py-3 rounded-xl font-bold font-display text-xs tracking-wider border border-border-medium text-text-primary hover:bg-bg-hover hover:border-border-strong transition-all duration-200 cursor-pointer"
          onClick={handleEpicSync}
          disabled={isSyncing}
        >
          <Wifi size={15} />
          Epic Games Hesabını Bağla
        </button>
      </section>

      {/* ==========================================
          Genel Ayarlar
          ========================================== */}
      <section
        className="rounded-2xl p-6 space-y-5 bg-bg-secondary border border-border-subtle shadow-premium"
      >
        <h3 className="text-base font-bold font-display text-text-bright">
          Genel Ayarlar
        </h3>

        {/* Otomatik senkronizasyon toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-text-primary">
              Başlangıçta Otomatik Senkronizasyon
            </p>
            <p className="text-xs text-text-muted">
              Uygulama açıldığında kütüphaneleri otomatik güncelle
            </p>
          </div>
          <button
            className={`relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer ${
              autoSync ? 'bg-accent-orange' : 'bg-bg-hover'
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

      {/* Kaydet butonu */}
      <div className="flex items-center gap-3">
        <button
          className="btn-primary flex items-center gap-2 px-6 py-3 cursor-pointer shadow-premium"
          onClick={saveSettings}
          disabled={isSaving}
        >
          <Save size={15} />
          {isSaving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
        </button>
      </div>
    </div>
  );
}
