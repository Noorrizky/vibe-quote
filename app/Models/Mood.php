<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Mood extends Model
{
    protected $fillable = ['name', 'slug', 'emoji', 'color_hex'];

    public function quotes(): BelongsToMany
    {
        return $this->belongsToMany(Quote::class);
    }
}