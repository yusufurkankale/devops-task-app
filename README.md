# 🚀 3-Tier Web App Deployment with AWS & CI/CD

Bu proje, 3 katmanlı (Frontend, Backend, Database) bir web uygulamasının modern DevOps standartlarına uygun olarak AWS ortamına dağıtılmasını (deployment) içermektedir. Altyapı kurulumundan CI/CD süreçlerine kadar tüm yapı otomatize edilmiştir.

## 🏗️ Mimari ve Kullandığım Teknolojiler

* **Altyapı (IaC):** AWS EC2 sunucusunu ve ağ güvenlik ayarlarını (Security Groups) **Terraform** ile kodlayarak ayağa kaldırdım.
* **Konteynerizasyon:** Tüm servisleri (React, Node.js, MongoDB) bağımsız çalışabilmeleri için **Dockerize** ettim ve orkestrasyon için **Docker Compose** kullandım.
* **İmaj Depolama:** Docker imajlarını oluşturduktan sonra **AWS ECR** (Elastic Container Registry) üzerinde açtığım repolarda depoladım.
* **Web Server & Proxy:** Dışarıdan gelen API isteklerini karşılamak ve backend'e güvenli bir şekilde yönlendirmek için **Nginx**'i reverse proxy olarak yapılandırdım.
* **CI/CD:** Tüm bu dağıtım (deployment) sürecini **GitHub Actions** ile tam otomatik hale getirdim.

## ⚙️ CI/CD Pipeline Akışı

Bu repodaki `main` branch'ine her kod gönderdiğimde (push) arka planda şu otomasyon çalışıyor:

1. **Build & Push:** GitHub Actions kodları derleyip yeni imajları oluşturuyor ve bu imajları AWS hesabımda bulunan ECR depolarına gönderiyor.
2. **Deploy:** Ardından otomatik olarak EC2 sunucuma SSH ile bağlanıp, `docker-compose pull` komutuyla ECR'daki en güncel imajları sunucuya çekiyor ve sistemi kesintisiz bir şekilde güncelliyor.

## 🛡️ Güvenlik Yaklaşımım

* **Port İzolasyonu:** Terraform yapılandırmasında sadece dışarıdan erişim için Port 80 (HTTP) ve Port 22 (SSH) portlarını dünyaya açık bıraktım. Backend (5000) ve Database (27017) portları dışarıya tamamen kapalı; sadece Nginx üzerinden ve Docker'ın iç ağı üzerinden haberleşiyorlar.
* **IAM Yetkilendirmesi:** Görevi inceleyecek ekip için minimum yetki (least privilege) prensibini uygulayarak sadece EC2 sunucusunu ve ECR imajlarını görebilen özel bir AWS IAM (Reviewer) kullanıcısı oluşturdum.

## 📂 Proje Dizin Yapısı

```text
.
├── backend/                # Node.js backend kaynak kodları ve Dockerfile
├── frontend/               # React frontend kaynak kodları, Dockerfile ve nginx.conf
├── terraform/              # AWS EC2 ve Security Group IaC kodları (main.tf)
├── .github/workflows/      # GitHub Actions CI/CD pipeline yapılandırması
└── docker-compose.yml      # Tüm servislerin orkestrasyon dosyası
