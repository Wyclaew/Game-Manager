// error.rs — Uygulama genelinde robust hata yönetimi (thiserror)
// Rust backend hataları bu modül aracılığıyla frontend'e serialize edilerek taşınır.

#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("Ağ hatası: {0}")]
    Network(#[from] reqwest::Error),
    
    #[error("Dosya sistemi hatası: {0}")]
    Io(#[from] std::io::Error),
    
    #[error("Veritabanı hatası: {0}")]
    Database(String),
    
    #[error("Yetkilendirme hatası: {0}")]
    Auth(String),
    
    #[error("Sistem hatası: {0}")]
    System(String),
}

// Tauri IPC üzerinden JSON formatında gönderilebilmesi için Serialize trait'i
impl serde::Serialize for AppError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(&self.to_string())
    }
}
