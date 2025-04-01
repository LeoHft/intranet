<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServicesAccess extends Model
{
    protected $table = 'services_access';

    protected $fillable = [
        'ServiceId',
        'UserId',
    ];

    public function service()
    {
        return $this->belongsTo(Services::class, 'ServiceId');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'UserId');
    }
}
