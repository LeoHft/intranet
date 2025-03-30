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


Route::get('/status', 'App\Http\Controllers\ServicesController@getStatus'); // Récupère les status




Route::post('/storeService', 'App\Http\Controllers\ServicesController@store'); // Enregistre un service

Route::get('/getCategories', 'App\Http\Controllers\CategoryController@getCategory'); // Récupère les catégories
Route::post('/storeCategory', 'App\Http\Controllers\CategoryController@store'); // Enregistre une catégorie
Route::put('/updateCategory/{id}', 'App\Http\Controllers\CategoryController@update'); // Modifie une catégorie
Route::delete('/deleteCategory/{id}', 'App\Http\Controllers\CategoryController@destroy'); // Supprime une catégorie