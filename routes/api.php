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