<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// ggjgjhikj
class Facture extends Model
{
    protected $fillable = ['client', 'produit', 'quantite', 'prix_unitaire'];
}
