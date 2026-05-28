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
