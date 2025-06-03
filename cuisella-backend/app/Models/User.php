<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Recipe;
use App\Models\Favorite;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * A user has many recipes.
     */
    public function recipes()
    {
        return $this->hasMany(Recipe::class);
    }

    /**
     * A user has many favorites.
     */
    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }
}
