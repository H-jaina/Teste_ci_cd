<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LienFactureController;
use App\Http\Controllers\FactureController;
Route::get('/facture/telecharger/{token}', [LienFactureController::class, 'telecharger']);
