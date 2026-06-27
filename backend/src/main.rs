use axum::{
    routing::{get, post},
    Router, Json, extract::Form,
    response::IntoResponse,
};
use serde::{Deserialize, Serialize};
use tower_http::cors::{CorsLayer, Any};
use tracing_subscriber;
use reqwest::Client;
use std::collections::HashMap;

#[derive(Deserialize)]
struct DownloadRequest {
    url: String,
    quality: Option<String>,
    format: Option<String>,
}

#[derive(Serialize)]
struct DownloadResponse {
    success: bool,
    data: Option<VideoInfo>,
    error: Option<String>,
}

#[derive(Serialize)]
struct VideoInfo {
    title: String,
    thumbnail: String,
    duration: String,
    formats: Vec<VideoFormat>,
}

#[derive(Serialize)]
struct VideoFormat {
    quality: String,
    format: String,
    url: String,
    size: String,
}

#[derive(Serialize)]
struct HealthResponse {
    status: String,
    service: String,
    version: String,
}

async fn health_check() -> impl IntoResponse {
    Json(HealthResponse {
        status: "healthy".to_string(),
        service: "Cobalt Video Downloader".to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
    })
}

async fn root() -> impl IntoResponse {
    Json(serde_json::json!({
        "service": "Cobalt Video Downloader",
        "version": env!("CARGO_PKG_VERSION"),
        "endpoints": {
            "POST /download": "Get video download links",
            "GET /health": "Health check"
        }
    }))
}

async fn download_video(
    Form(req): Form<DownloadRequest>,
) -> impl IntoResponse {
    // Validate URL
    if !req.url.contains("youtube.com") && !req.url.contains("youtu.be") &&
       !req.url.contains("twitter.com") && !req.url.contains("x.com") &&
       !req.url.contains("tiktok.com") && !req.url.contains("instagram.com") {
        return Json(DownloadResponse {
            success: false,
            data: None,
            error: Some("Unsupported platform".to_string()),
        });
    }

    // Simulate video info extraction
    let video_info = VideoInfo {
        title: "Sample Video".to_string(),
        thumbnail: format!("https://picsum.photos/seed/{}/320/240", req.url.len()),
        duration: "3:45".to_string(),
        formats: vec![
            VideoFormat {
                quality: "720p".to_string(),
                format: "mp4".to_string(),
                url: format!("https://download.example.com/{}", uuid::Uuid::new_v4()),
                size: "45.2 MB".to_string(),
            },
            VideoFormat {
                quality: "480p".to_string(),
                format: "mp4".to_string(),
                url: format!("https://download.example.com/{}", uuid::Uuid::new_v4()),
                size: "28.1 MB".to_string(),
            },
        ],
    };

    Json(DownloadResponse {
        success: true,
        data: Some(video_info),
        error: None,
    })
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/", get(root))
        .route("/health", get(health_check))
        .route("/download", post(download_video))
        .layer(cors);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3001")
        .await
        .unwrap();

    tracing::info!("Cobalt Video Downloader backend running on port 3001");
    axum::serve(listener, app).await.unwrap();
}
