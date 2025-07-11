<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Facture;
use App\Models\LienFacture;
use Illuminate\Support\Str;

class FactureController extends Controller
{
    // GET /api/factures
    public function index()
    {
        return response()->json(Facture::all());
    }

    // POST /api/factures
    public function store(Request $request)
    {
        $facture = Facture::create([
            'client' => $request->input('client'),
            'produit' => $request->input('produit'),
            'quantite' => $request->input('quantite'),
            'prix_unitaire' => $request->input('prix_unitaire'),
        ]);

        return response()->json($facture, 201);
    }

    // GET /api/factures/{id}
    public function show(Facture $facture)
    {
        return response()->json($facture);
    }

    // PUT /api/factures/{id}
    public function update(Request $request, Facture $facture)
    {
        $facture->update([
            'client' => $request->input('client'),
            'produit' => $request->input('produit'),
            'quantite' => $request->input('quantite'),
            'prix_unitaire' => $request->input('prix_unitaire'),
        ]);

        return response()->json($facture);
    }

    // DELETE /api/factures/{id}
    public function destroy(Facture $facture)
    {
        $facture->delete();

        return response()->json(['message' => 'Facture supprimée avec succès']);
    }
    public function genererLien($id)
{
    $facture = Facture::findOrFail($id);

    $token = Str::uuid(); // Génère un token unique

    // Créer un lien
    $lien = LienFacture::create([
        'facture_id' => $facture->id,
        'token' => $token,
        'utilise' => false,
    ]);

    return response()->json([
        'url' => url('/facture/telecharger/' . $token)
    ]);
}

}





