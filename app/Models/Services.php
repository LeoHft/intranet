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

}
