$db_connection_var = "mysql"
$db_host_var = "intranet-db"
$db_port_var = "3306"
$db_database_var = "intranet"
$db_username_var = "root"
$db_password_var = "secret"

Remove-Item ".env" -Force -ErrorAction SilentlyContinue
Remove-Item ".env.preprod" -Force -ErrorAction SilentlyContinue
Clear-Host
Write-Host ""
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host "               Configuration de l'application Intranet                  " -ForegroundColor Cyan
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Ce script vous guide dans la configuration de l'environnement :" -ForegroundColor White
Write-Host ""
Write-Host "=> Mode " -NoNewline; Write-Host "developpement (sans Docker)" -ForegroundColor Yellow
Write-Host "  - PHP, Composer, Node.js et MariaDB doivent etre installes localement." -ForegroundColor Gray
Write-Host ""

Write-Host "=> Mode " -NoNewline; Write-Host "production (avec Docker)" -ForegroundColor Green
Write-Host "  - Requiert Docker et Docker Compose installes sur votre machine." -ForegroundColor Gray
Write-Host ""

Write-Host "Souhaitez-vous demarrer en mode " -NoNewline; Write-Host "developpement (sans Docker) ?" -ForegroundColor Yellow  -NoNewline; $devMode = Read-Host "  (o/N)"

if ($devMode -match '^[oOyY]$') {
    cp ".env.example" ".env"
    $envFile = ".env"
    # Mode développement
    (Get-Content $envFile) |
        ForEach-Object {
            $_ -replace '^VITE_DEV_SERVER=.*', 'VITE_DEV_SERVER=true' `
               -replace '^APP_ENV=.*', 'APP_ENV=local' `
               -replace '^APP_DEBUG=.*', 'APP_DEBUG=true' `
               -replace '^APP_URL=.*', 'APP_URL=http://127.0.0.1:8000' `
               -replace '^FRONTEND_URL=.*', 'FRONTEND_URL=http://127.0.0.1:8000' `
               -replace '^CORS_ALLOWED_ORIGINS=.*', 'CORS_ALLOWED_ORIGINS=http://127.0.0.1:8000' `
               -replace '^SANCTUM_STATEFUL_DOMAINS=.*', 'SANCTUM_STATEFUL_DOMAINS=127.0.0.1:8000' `
               -replace '^SESSION_DOMAIN=.*', 'SESSION_DOMAIN=127.0.0.1' `
               -replace '^SESSION_SECURE_COOKIE=.*', 'SESSION_SECURE_COOKIE=false' `
               -replace '^DB_CONNECTION=.*', 'DB_CONNECTION=mysql' `
               -replace '^DB_HOST=.*', 'DB_HOST=localhost' `
               -replace '^DB_PORT=.*', 'DB_PORT=3306' `
               -replace '^DB_DATABASE=.*', 'DB_DATABASE=intranet' `
               -replace '^DB_USERNAME=.*', 'DB_USERNAME=root' `

        } | Set-Content $envFile
    


    Write-Host "`nInstallation des dependances PHP"
    composer install --no-interaction --optimize-autoloader
    Write-Host "`nInstallation des dependances NPM"
    npm ci
    Write-Host "`nGeneration de la cle d'application"
    php artisan key:generate
    Write-Host "`nMigration de la base de données"
    php artisan migrate --seed --force -n
    Write-Host "`nPublication des assets"
    php artisan storage:link
    Write-Host "`nLancement en mode developpement sans Docker..."
    Start-Process powershell -ArgumentList "php artisan serve"
    Start-Process powershell -ArgumentList "npm run dev"

} else {

    if (Test-Path ".env") { Remove-Item ".env" }
    cp ".env.example" ".env.preprod"
    $envFile = ".env.preprod"
    # Mode production
    Write-Host "`nFichier .env.example deja existant, avec une configuration pour acceder a l'application en http://127.0.0.1"
    $reconfigure = Read-Host "Souhaitez-vous le reconfigurer pour y acceder avec une autre adresse (ex : https://subdomain.domain.com) ? (o/N)"

    if ($reconfigure -notmatch '^[oOyY]$') {
        Write-Host "`nConfiguration annulee, utilisation de la configuration existante."

        $content = Get-Content $envFile
        $content = $content -replace '^DB_CONNECTION=.*', "DB_CONNECTION=$db_connection_var"
        $content = $content -replace '^DB_HOST=.*', "DB_HOST=$db_host_var"
        $content = $content -replace '^DB_PORT=.*', "DB_PORT=$db_port_var"
        $content = $content -replace '^DB_DATABASE=.*', "DB_DATABASE=$db_database_var"
        $content = $content -replace '^DB_USERNAME=.*', "DB_USERNAME=$db_username_var"
        $content = $content -replace '^DB_PASSWORD=.*', "DB_PASSWORD=$db_password_var"

        Set-Content $envFile $content
        docker compose up --build
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
        $content = $content -replace '^CORS_ALLOWED_ORIGINS=.*', "CORS_ALLOWED_ORIGINS=${protocol}://${domain}:8088"
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


    Write-Host "`n.env.example configure. Lancement de docker compose up --build..."
    docker compose up --build

}