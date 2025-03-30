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

    public function update(Request $request, $id)
    {
        $category = Categories::findOrFail($id);

        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
        ]);

        $category->update([
            'Name' => $request->name,
            'Description' => $request->description,
        ]);

        return response()->json(['message' => 'Category updated successfully'], 200);
    }

    public function destroy($id)
    {
        $category = Categories::findOrFail($id);
        $category->delete();

        return response()->json(['message' => 'Category deleted successfully'], 200);
    }
}
