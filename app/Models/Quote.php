<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Quote extends Model
{
    protected $fillable = ['content', 'author'];

    public function moods(): BelongsToMany
    {
        return $this->belongsToMany(Mood::class);
    }
}