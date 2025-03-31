<?php

namespace App\Http\Controllers;
use App\Models\Services;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ServicesController extends Controller
{
    public function store(Request $request)
    {
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
