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
            'description' => 'nullable|string',
            'internal_url' => 'nullable|string',
            'external_url' => 'nullable|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
            $image_url = asset('storage/' . $imagePath);
        } else {
            $image_url = null;
        }
        
        $service = Services::create([
            'name' => $request->name,
            'description' => $request->description,
            'internal_url' => $request->internal_url,
            'external_url' => $request->external_url,
            'image_url' => $image_url,
            'status_id' => $request->status_id,
        ]);

        if ($service) {
            foreach (json_decode($request->category_id) as $categoryId) {
                CategoriesServices::create([
                    'category_id' => $categoryId,
                    'service_id' => $service->id,
                ]);
            }
            foreach (json_decode($request->user_id) as $userId) {
                ServicesAccess::create([
                    'user_id' => $userId,
                    'service_id' => $service->id,
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
            'description' => 'nullable|string',
            'internal_url' => 'nullable|string',
            'external_url' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $service = Services::findOrFail($id);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
            $image_url = asset('storage/' . $imagePath);
        } else {
            $image_url = $service->image_url;
        }

        $service->update([
            'name' => $request->name,
            'description' => $request->description,
            'internal_url' => $request->internal_url,
            'external_url' => $request->external_url,
            'image_url' => $image_url,
            'status_id' => $request->status_id,
        ]);

        // Update categories
        CategoriesServices::where('service_id', $id)->delete();
        foreach (json_decode($request->category_id) as $categoryId) {
            CategoriesServices::create([
                'category_id' => $categoryId,
                'service_id' => $service->id,
            ]);
        }
        ServicesAccess::where('service_id', $id)->delete();
        foreach (json_decode($request->user_id) as $userId) {
            ServicesAccess::create([
                'user_id' => $userId,
                'service_id' => $service->id,
            ]);
        }

        return response()->json(['message' => 'Service updated successfully', 'service' => $service], 200);
    }

    public function destroy($id): JsonResponse
    {
        $service = Services::findOrFail($id);
        $service->delete();

        // Delete associated categories
        CategoriesServices::where('service_id', $id)->delete();
        ServicesAccess::where('service_id', $id)->delete();

        return response()->json(['message' => 'Service deleted successfully'], 200);
    }
}
