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


//Catégories
Route::get('/getCategories', 'App\Http\Controllers\CategoryController@getCategory'); // Récupère les catégories
Route::post('/storeCategory', 'App\Http\Controllers\CategoryController@store'); // Enregistre une catégorie
Route::put('/updateCategory/{id}', 'App\Http\Controllers\CategoryController@update'); // Modifie une catégorie
Route::delete('/deleteCategory/{id}', 'App\Http\Controllers\CategoryController@destroy'); // Supprime une catégorie

//Status
Route::get('/getStatus', 'App\Http\Controllers\StatusController@getStatus'); // Récupère les status
Route::post('/storeStatus', 'App\Http\Controllers\StatusController@store'); // Enregistre un status
Route::put('/updateStatus/{id}', 'App\Http\Controllers\StatusController@update'); // Modifie un status
Route::delete('/deleteStatus/{id}', 'App\Http\Controllers\StatusController@destroy'); // Supprime un status