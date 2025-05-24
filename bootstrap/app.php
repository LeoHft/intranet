<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    //Applications des middlewares globalement à toute l'app ! 
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->trustProxies(at: '*'); // Permet de faire confiance aux proxies, utile pour les applications derrière un proxy inverse comme Nginx ou Apache

        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class, // Alias du middleware
        ]);

        $middleware->api(prepend: [
            \Illuminate\Cookie\Middleware\EncryptCookies::class, // crypte/décrypte les cookies
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class, //distinguer les requêtes « stateful » (celles qui proviennent d’un navigateur ou d’une SPA) des autres requêtes
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
