// commands/sync.rs — Platform Senkronizasyon Tauri Komutları
// Steam ve Epic kütüphanelerini senkronize eder

use crate::sync;
use crate::error::AppError;
use std::path::PathBuf;

/// Steam kütüphanesini Web API üzerinden senkronize eder.
/// Kullanıcının Steam API Key ve SteamID64 bilgilerini gerektirir.
#[tauri::command]
pub async fn sync_steam_library(
    api_key: String,
    steam_id: String,
) -> Result<String, AppError> {
    // Steam Web API'den oyun listesini çek
    let games = sync::steam::fetch_steam_library(&api_key, &steam_id).await?;

    // Oyunları JSON olarak döndür
    let json = serde_json::to_string(&games)
        .map_err(|e| AppError::System(format!("JSON serileştirme hatası: {}", e)))?;

    Ok(json)
}

/// Yerel Steam kurulumlarını tarar.
/// libraryfolders.vdf dosyasını okuyarak kurulu oyunları tespit eder.
#[tauri::command]
pub async fn sync_local_installations(
    steam_path: Option<String>,
) -> Result<String, AppError> {
    // Platforma göre varsayılan yolu seç
    let default_path = if cfg!(target_os = "windows") {
        "C:\\Program Files (x86)\\Steam".to_string()
    } else {
        // macOS varsayılan yolu
        let home = std::env::var("HOME").unwrap_or_default();
        format!("{}/Library/Application Support/Steam", home)
    };

    let base_path = steam_path.unwrap_or(default_path);
    let base_path_buf = PathBuf::from(base_path);
    
    // libraryfolders.vdf yolunu oluştur
    let mut vdf_path = base_path_buf.clone();
    vdf_path.push("steamapps");
    vdf_path.push("libraryfolders.vdf");

    if !vdf_path.exists() {
        return Err(AppError::Io(std::io::Error::new(
            std::io::ErrorKind::NotFound,
            format!("Steam libraryfolders.vdf bulunamadı: {:?}", vdf_path)
        )));
    }

    let vdf_content = std::fs::read_to_string(&vdf_path)?;

    // Kütüphane klasörlerini ayrıştır
    let library_paths = sync::steam::parse_library_folders(&vdf_content);

    // Her kütüphane klasöründeki appmanifest dosyalarını tara
    let mut installed_games = Vec::new();
    for lib_path in &library_paths {
        let mut steamapps_dir = PathBuf::from(lib_path);
        steamapps_dir.push("steamapps");
        
        if let Ok(entries) = std::fs::read_dir(&steamapps_dir) {
            for entry in entries.flatten() {
                let file_name = entry.file_name().to_string_lossy().to_string();
                if file_name.starts_with("appmanifest_") && file_name.ends_with(".acf") {
                    if let Ok(content) = std::fs::read_to_string(entry.path()) {
                        if let Some(info) = sync::steam::parse_app_manifest(&content, lib_path) {
                            installed_games.push(info);
                        }
                    }
                }
            }
        }
    }

    let json = serde_json::to_string(&installed_games)
        .map_err(|e| AppError::System(format!("JSON serileştirme hatası: {}", e)))?;

    Ok(json)
}
