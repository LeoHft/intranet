<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Categories extends Model
{
    protected $table = 'categories'; // Nom de la table
    protected $primaryKey = 'id'; // Clé primaire

    protected $fillable = [
        'Name',
        'Description',
    ];

    public function services(): BelongsToMany
    {
        return $this->belongsToMany(
            Services::class,
            'categories_services',
            'CategoryId',
            'ServiceId'
        );
    }

}
