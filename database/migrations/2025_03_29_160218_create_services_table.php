<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('status', function (Blueprint $table) {
            $table->id();
            $table->string('Name');
            $table->string('Description');
            $table->timestamps();
        });

        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('Name');
            $table->string('Description');
            $table->timestamps();
        });

        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('Name');
            $table->string('Description');
            $table->string('WifiUrl');
            $table->string('CloudflareUrl');
            $table->string('ImageUrl');
            $table->foreignId('StatusId')->constrained('status');
            $table->timestamps();
        });

        Schema::create('categories_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('CategoryId')->constrained('categories')->onDelete('cascade');
            $table->foreignId('ServiceId')->constrained('services')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('services_access', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ServiceId')->constrained('services')->onDelete('cascade');
            $table->foreignId('UserId')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services_access');
        Schema::dropIfExists('categories_services');
        Schema::dropIfExists('services');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('status');
    }
};
