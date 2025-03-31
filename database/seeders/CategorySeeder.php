<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('categories')->insert([
            [
                'Name' => 'Domotique',
                'Description' => "Home assistant",
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
