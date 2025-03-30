<?php

use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/posts', function () {
    return Post::all(); // Récupère tous les posts de la DB
});

Route::get('/categories', 'App\Http\Controllers\CategoryController@getCategory'); // Récupère les catégories

Route::get('/status', 'App\Http\Controllers\ServicesController@getStatus'); // Récupère les status




Route::post('/storeService', 'App\Http\Controllers\ServicesController@store'); // Enregistre un service
Route::post('/storeCategory', 'App\Http\Controllers\CategoryController@store'); // Enregistre une catégorie