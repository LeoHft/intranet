<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'isAuthenticated' => Auth::check(),
        'canLogin' => Route::has('login'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');


Route::get('/dashboard', function () {
    // This route is only accessible to authenticated users
    return Inertia::render('Dashboard', [

    ]);
})->middleware(['auth', 'verified'])->name('dashboard');


Route::get('/adminDashboard', function () {
    // This route is only accessible to authenticated users
    return Inertia::render('AdminDashboard', []);
})->middleware(['auth', 'verified', 'admin'])->name('adminDashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
