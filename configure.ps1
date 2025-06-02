$db_connection_var = "mysql"
$db_host_var = "intranet-db"
$db_port_var = "3306"
$db_database_var = "intranet"
$db_username_var = "root"
$db_password_var = "secret"

Remove-Item ".env" -Force -ErrorAction SilentlyContinue
Remove-Item ".env.prod" -Force -ErrorAction SilentlyContinue
Clear-Host
Write-Host ""
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host "               Configuration de l'application Intranet                  " -ForegroundColor Cyan
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Ce script vous guide dans la configuration de l'environnement :" -ForegroundColor White
Write-Host ""
Write-Host "=> Mode " -NoNewline; Write-Host "developpement" -ForegroundColor Yellow
Write-Host "  - Requiert Docker et Docker Compose installes sur votre machine." -ForegroundColor Gray
Write-Host "  - Acces depuis http://localhost:8000" -ForegroundColor Cyan
Write-Host ""

Write-Host "=> Mode " -NoNewline; Write-Host "production" -ForegroundColor Green
Write-Host "  - Requiert Docker et Docker Compose installes sur votre machine." -ForegroundColor Gray
Write-Host ""

Write-Host "Souhaitez-vous demarrer en mode " -NoNewline; Write-Host "developpement ?" -ForegroundColor Yellow  -NoNewline; $devMode = Read-Host "  (o/N)"

if ($devMode -match '^[oOyY]$') {
    cp ".env.dev" ".env"

    docker compose --profile dev up --watch

} else {

    if (Test-Path ".env") { Remove-Item ".env" }
    if (Test-Path ".env.prod") { Remove-Item ".env.prod" }

    cp ".env.example" ".env.prod"
    $envFile = ".env.prod"
    # Mode production
    Write-Host "`nFichier .env.example deja existant, avec une configuration pour acceder a l'application en" -NoNewline; Write-Host " http://127.0.0.1" -ForegroundColor Cyan
    $reconfigure = Read-Host "Souhaitez-vous le reconfigurer pour y acceder avec une autre adresse (ex : https://subdomain.domain.com) ? (o/N)"

    if ($reconfigure -notmatch '^[oOyY]$') {
        Write-Host "`nUtilisation de la configuration existante."

        $content = Get-Content $envFile
        $content = $content -replace '^DB_CONNECTION=.*', "DB_CONNECTION=$db_connection_var"
        $content = $content -replace '^DB_HOST=.*', "DB_HOST=$db_host_var"
        $content = $content -replace '^DB_PORT=.*', "DB_PORT=$db_port_var"
        $content = $content -replace '^DB_DATABASE=.*', "DB_DATABASE=$db_database_var"
        $content = $content -replace '^DB_USERNAME=.*', "DB_USERNAME=$db_username_var"
        $content = $content -replace '^DB_PASSWORD=.*', "DB_PASSWORD=$db_password_var"

        Set-Content $envFile $content
        docker compose --profile production up --build
    }

    $domain = Read-Host "Quel est le domaine de l'application (ex: intranet.local)"
    $useHttps = Read-Host "Utiliser HTTPS ? (o/N)"

    $protocol = if ($useHttps -match '^[oOyY]$') { "https" } else { "http" }

    # Lire contenu et remplacer
    $content = Get-Content $envFile
    $content = $content -replace '^APP_DOMAIN=.*', "APP_DOMAIN=$domain"
    $content = $content -replace '^PROTOCOL=.*', "PROTOCOL=$protocol"

    if ($protocol -eq "https") {
        $content = $content -replace '^APP_URL=.*', "APP_URL=${protocol}://${domain}"
        $content = $content -replace '^FRONTEND_URL=.*', "FRONTEND_URL=${protocol}://${domain}"
        $content = $content -replace '^CORS_ALLOWED_ORIGINS=.*', "CORS_ALLOWED_ORIGINS=${protocol}://${domain}"
        $content = $content -replace '^SANCTUM_STATEFUL_DOMAINS=.*', "SANCTUM_STATEFUL_DOMAINS=${domain}"
    } else {
        $content = $content -replace '^APP_URL=.*', "APP_URL=${protocol}://${domain}:8088"
        $content = $content -replace '^FRONTEND_URL=.*', "FRONTEND_URL=${protocol}://${domain}:8088"
        $content = $content -replace '^CORS_ALLOWED_ORIGINS=.*', "CORS_ALLOWED_ORIGINS=${protocol}://${domain}:8088,${protocol}://${domain}:5173"
        $content = $content -replace '^SANCTUM_STATEFUL_DOMAINS=.*', "SANCTUM_STATEFUL_DOMAINS=${domain}:8088"
    }

    $content = $content -replace '^SESSION_DOMAIN=.*', "SESSION_DOMAIN=${domain}"
    $content = $content -replace '^DB_CONNECTION=.*', "DB_CONNECTION=$db_connection_var"
    $content = $content -replace '^DB_HOST=.*', "DB_HOST=$db_host_var"
    $content = $content -replace '^DB_PORT=.*', "DB_PORT=$db_port_var"
    $content = $content -replace '^DB_DATABASE=.*', "DB_DATABASE=$db_database_var"
    $content = $content -replace '^DB_USERNAME=.*', "DB_USERNAME=$db_username_var"
    $content = $content -replace '^DB_PASSWORD=.*', "DB_PASSWORD=$db_password_var"


    if ($protocol -eq "http") {
        $content = $content -replace '^SESSION_SECURE_COOKIE=.*', "SESSION_SECURE_COOKIE=false"
    } else {
        $content = $content -replace '^SESSION_SECURE_COOKIE=.*', "SESSION_SECURE_COOKIE=true"
    }

    # Sauvegarde
    Set-Content $envFile $content


    Write-Host "`n.env.example configure. Lancement de docker ..."
    docker compose --profile production up --build

}