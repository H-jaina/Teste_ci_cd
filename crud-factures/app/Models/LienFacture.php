<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class LienFacture extends Model
{
    use HasFactory;

    protected $fillable = [
        'facture_id',
        'token',
        'utilise',
        'expire_le'
    ];

    public function facture()
    {
        return $this->belongsTo(Facture::class);

    }
}



