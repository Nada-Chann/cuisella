<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'ingredients',
        'steps',
        'time',
        'servings',
         'image_path',
    ];

    // ensure Laravel casts `ingredients` and `steps` JSON ↔ array automatically
    protected $casts = [
        'ingredients' => 'array',
        'steps'       => 'array',
    ];
     public function getImageUrlAttribute()
{
    return $this->image_path ? asset('storage/'.$this->image_path) : null;
}
    // Recipe belongs to a User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
