<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Services extends Model
{
    protected $fillable = [
        'Name',
        'Description',
        'WifiUrl',
        'CloudflareUrl',
        'ImageUrl',
        'StatusId',
    ];


    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(
            Categories::class,
            'categories_services',
            'ServiceId',
            'CategoryId'
        );
    }

    public function status()
    {
        return $this->belongsTo(Status::class, 'StatusId');
    }

    public function users(): BelongsToMany 
    {
        return $this->belongsToMany(
            User::class, // Modèle associé
            'services_access', // Nom de la table pivot
            'ServiceId', // Clé étrangère du modèle actuel dans la table pivot
            'UserId' // Clé étrangère du modèle associé dans la table pivot
        );
    }

}
