<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
    // protected $casts = [
    //     'status_id' => 'integer',
    // ];
}
