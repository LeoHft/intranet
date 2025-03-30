<?php

namespace App\Http\Controllers;
use App\Models\Services;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ServicesController extends Controller
{
    public function getCategory()
    {
        return response()->json([
                ['id' => 1, 'name' => 'Category 1'],
                ['id' => 2, 'name' => 'Category 2'],
                ['id' => 3, 'name' => 'Category 3'],
                ['id' => 4, 'name' => 'Category 4'],
                ['id' => 5, 'name' => 'Category 5'],
        ]);
    }

    public function getStatus() {
        return response()->json([
            ['id' => 1, 'name' => 'Status 1'],
            ['id' => 2, 'name' => 'Status 2'],
            ['id' => 3, 'name' => 'Status 3'],
            ['id' => 4, 'name' => 'Status 4'],
            ['id' => 5, 'name' => 'Status 5'],
        ]);
    }

    public function store(Request $request)
    {
        Log::info($request->all());
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'internal_url' => 'required|string',
            'external_url' => 'required|string',
            'image_url' => 'required|string',
            'category_id' => 'required|array', // Le champ doit être un tableau
            'category_id.*' => 'integer|exists:categories,id', // Chaque élément du tableau doit être un entier existant
            'status_id' => 'required|integer|exists:status,id', 
        ]);
        

        Services::create([
            'Name' => $request->name,
            'Description' => $request->description,
            'WifiUrl' => $request->internal_url,
            'CloudflareUrl' => $request->external_url,
            'ImageUrl' => $request->image_url,
            'StatusId' => $request->status_id,
        ]);






        return response()->json(['message' => 'Service created successfully'], 201);
    }
}
