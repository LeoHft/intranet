<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Service;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Service::cfactory()->create([
            'name' => 'test service',
            'description' => 'test service description',
            'internal_url' => 'http://localhost:8000',
            'external_url' => 'https://testservice.com',
            'image_url' => 'http://127.0.0.1:8000/storage/images/no-photo-available.jpg',
            'status_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
