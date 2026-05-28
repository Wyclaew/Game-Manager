// commands/games.rs — Oyun CRUD Tauri Komutları
// Frontend'den invoke() ile çağrılan veritabanı işlemleri

use crate::error::AppError;

/// Tüm oyunları platform bilgisiyle birlikte getirir.
#[tauri::command]
pub async fn get_all_games() -> Result<String, AppError> {
    Ok("[]".to_string())
}

/// Oyunun durumunu günceller (Backlog, Playing, Completed vb.)
#[tauri::command]
pub async fn update_game_status(_game_id: i64, _status: String) -> Result<(), AppError> {
    Ok(())
}

/// Oyunun favori durumunu değiştirir
#[tauri::command]
pub async fn toggle_favorite(_game_id: i64) -> Result<(), AppError> {
    Ok(())
}

#[derive(serde::Serialize)]
pub struct DetectedPaths {
    pub steam_path: Option<String>,
    pub epic_path: Option<String>,
    pub os: String,
}

/// Sistemde kurulu Steam ve Epic Games varsayılan yollarını tespit eder.
#[tauri::command]
pub async fn detect_platform_paths() -> Result<DetectedPaths, AppError> {
    let mut detected = DetectedPaths {
        steam_path: None,
        epic_path: None,
        os: std::env::consts::OS.to_string(),
    };

    #[cfg(target_os = "windows")]
    {
        let steam_default = std::path::Path::new("C:\\Program Files (x86)\\Steam");
        if steam_default.exists() {
            detected.steam_path = Some(steam_default.to_string_lossy().to_string());
        }
        let epic_default = std::path::Path::new("C:\\Program Files\\Epic Games");
        if epic_default.exists() {
            detected.epic_path = Some(epic_default.to_string_lossy().to_string());
        }
    }

    #[cfg(target_os = "macos")]
    {
        if let Ok(home) = std::env::var("HOME") {
            let steam_default = std::path::PathBuf::from(home).join("Library/Application Support/Steam");
            if steam_default.exists() {
                detected.steam_path = Some(steam_default.to_string_lossy().to_string());
            }
        }
        let epic_default = std::path::Path::new("/Users/Shared/Epic Games");
        if epic_default.exists() {
            detected.epic_path = Some(epic_default.to_string_lossy().to_string());
        }
    }

    Ok(detected)
}

