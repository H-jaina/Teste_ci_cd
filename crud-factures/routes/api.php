<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FactureController;
use App\Http\Controllers\LienFactureController;

Route::get('/factures/generer-lien/{id}', [LienFactureController::class, 'genererLien']);
Route::get('/facture/generer-lien/{id}', [FactureController::class, 'genererLien']);

// Route test simple
Route::post('/test-post', function (Request $request) {
    return response()->json([
        'success' => true,
        'data_received' => $request->all()
    ]);
});

// Routes API pour la ressource "factures"
Route::apiResource('factures', FactureController::class);

