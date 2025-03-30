<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;




class CategoryController extends Controller
{
    public function getCategory()
    {
        $categories = Categories::all();
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
        ]);

        Categories::create([
            'Name' => $request->name,
            'Description' => $request->description,
        ]);

        return response()->json(['message' => 'Category created successfully'], 201);
    }
}
