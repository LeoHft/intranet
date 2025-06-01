$envFile = ".env.example"

Write-Host "Fichier .env.example déjà existant, avec une configuration pour y accéder en http://127.0.0.1"
$reconfigure = Read-Host "Souhaites-tu le reconfigurer pour y accéder avec une autre adresse (ex : https://subdomain.domain.com) ? (o/N)"

if ($reconfigure -notmatch '^[oOyY]$') {
    Write-Host "Configuration annulée, on continue avec la configuration existante.`n"
    docker compose up --build
    exit 0
}

$domain = Read-Host "Quel est le domaine de l'application (ex: intranet.local)"
$useHttps = Read-Host "Utiliser HTTPS ? (o/N)"

if ($useHttps -match '^[oOyY]$') {
    $protocol = "https"
} else {
    $protocol = "http"
}

# Lire le contenu du .env.example
$content = Get-Content $envFile

# Remplacer les lignes spécifiques
$content = $content -replace '^APP_DOMAIN=.*', "APP_DOMAIN=$domain"
$content = $content -replace '^PROTOCOL=.*', "PROTOCOL=$protocol"


if ($protocol -eq "https") {
    $content = $content -replace '^APP_URL=.*', "APP_URL=${protocol}://${domain}"
    $content = $content -replace '^FRONTEND_URL=.*', "FRONTEND_URL=${protocol}://${domain}"
    $content = $content -replace '^CORS_ALLOWED_ORIGINS=.*', "CORS_ALLOWED_ORIGINS=${protocol}://${domain}"
    $content = $content -replace '^SANCTUM_STATEFUL_DOMAINS=.*', "SANCTUM_STATEFUL_DOMAINS=$domain"
} else {
    $content = $content -replace '^APP_URL=.*', "APP_URL=${protocol}://${domain}:8088"
    $content = $content -replace '^FRONTEND_URL=.*', "FRONTEND_URL=${protocol}://${domain}:8088"
    $content = $content -replace '^CORS_ALLOWED_ORIGINS=.*', "CORS_ALLOWED_ORIGINS=${protocol}://${domain}:8088"
    $content = $content -replace '^SANCTUM_STATEFUL_DOMAINS=.*', "SANCTUM_STATEFUL_DOMAINS=$domain:8088"
}
$content = $content -replace '^SESSION_DOMAIN=.*', "SESSION_DOMAIN=${domain}"


if ($protocol -eq "http") {
    $content = $content -replace '^SESSION_SECURE_COOKIE=.*', "SESSION_SECURE_COOKIE=false"
} else {
    $content = $content -replace '^SESSION_SECURE_COOKIE=.*', "SESSION_SECURE_COOKIE=true"
}

# Sauvegarde dans le fichier
Set-Content $envFile $content

Write-Host ".env.example configuré. Lancement de docker compose up --build..."
docker compose up --build
