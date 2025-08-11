use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Serialize)]
struct Greeting {
    message: String,
}

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().json(Greeting {
        message: "Hello, world!".to_string(),
    })
}

#[derive(Deserialize)]
struct InputData {
    name: String,
}

#[post("/greet")]
async fn greet(data: web::Json<InputData>) -> impl Responder {
    let response = Greeting {
        message: format!("Hello, {}!", data.name),
    };
    HttpResponse::Ok().json(response)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Read port from env or default to 4000
    let port = env::var("PORT").unwrap_or_else(|_| "4000".to_string());
    let bind_address = format!("127.0.0.1:{}", port);

    println!("Starting server on http://{}", bind_address);

    HttpServer::new(|| {
        App::new()
            .service(hello)
            .service(greet)
    })
    .bind(bind_address)?
    .run()
    .await
}
