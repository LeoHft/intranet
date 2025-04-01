<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use App\Models\CategoriesServices;
use App\Models\Services;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
use App\Models\ServicesAccess;


class ServicesController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'internal_url' => 'required|string',
            'external_url' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
            $imageUrl = asset('storage/' . $imagePath);
        } else {
            $imageUrl = null;
        }
        
        $service = Services::create([
            'Name' => $request->name,
            'Description' => $request->description,
            'WifiUrl' => $request->internal_url,
            'CloudflareUrl' => $request->external_url,
            'ImageUrl' => $imageUrl,
            'StatusId' => $request->status_id,
        ]);

        if ($service) {
            foreach (json_decode($request->category_id) as $categoryId) {
                CategoriesServices::create([
                    'CategoryId' => $categoryId,
                    'ServiceId' => $service->id,
                ]);
            }
            foreach (json_decode($request->user_id) as $userId) {
                ServicesAccess::create([
                    'UserId' => $userId,
                    'ServiceId' => $service->id,
                ]);
            }

        }

        return response()->json(['message' => 'Service created successfully', 'service' => $service], 201);
    }

    public function getServices(): JsonResponse
    {
        $services = Services::with('categories')->with('status')->with('users')->get();
        return response()->json($services);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'internal_url' => 'required|string',
            'external_url' => 'required|string',
            'image' => 'optional|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $service = Services::findOrFail($id);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
            $imageUrl = asset('storage/' . $imagePath);
        } else {
            $imageUrl = $service->ImageUrl;
        }

        $service->update([
            'Name' => $request->name,
            'Description' => $request->description,
            'WifiUrl' => $request->internal_url,
            'CloudflareUrl' => $request->external_url,
            'ImageUrl' => $imageUrl,
            'StatusId' => $request->status_id,
        ]);

        // Update categories
        CategoriesServices::where('ServiceId', $id)->delete();
        foreach (json_decode($request->category_id) as $categoryId) {
            CategoriesServices::create([
                'CategoryId' => $categoryId,
                'ServiceId' => $service->id,
            ]);
        }
        ServicesAccess::where('ServiceId', $id)->delete();
        foreach (json_decode($request->user_id) as $userId) {
            ServicesAccess::create([
                'UserId' => $userId,
                'ServiceId' => $service->id,
            ]);
        }

        return response()->json(['message' => 'Service updated successfully', 'service' => $service], 200);
    }

    public function destroy($id): JsonResponse
    {
        $service = Services::findOrFail($id);
        $service->delete();

        // Delete associated categories
        CategoriesServices::where('ServiceId', $id)->delete();
        ServicesAccess::where('ServiceId', $id)->delete();

        return response()->json(['message' => 'Service deleted successfully'], 200);
    }
}
