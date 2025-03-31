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


// Route::middleware('auth:sanctum')->group(function () {


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

    //utilisateurs
    Route::get('/getUsers', 'App\Http\Controllers\UserController@getUsers'); // Récupère les utilisateurs
    Route::post('/storeUser', 'App\Http\Controllers\UserController@store'); // Enregistre un utilisateur
    Route::put('/updateUser/{id}', 'App\Http\Controllers\UserController@update'); // Modifie un utilisateur
    Route::delete('/deleteUser/{id}', 'App\Http\Controllers\UserController@destroy'); // Supprime un utilisateur

// });

// require __DIR__.'/auth.php';
