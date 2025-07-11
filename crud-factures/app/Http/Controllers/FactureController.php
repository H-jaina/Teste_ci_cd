<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Facture;
use App\Models\LienFacture;
use Barryvdh\DomPDF\Facade\Pdf;

class FactureController extends Controller
{   public function store(Request $request)
    {
        $request->validate([
            'client' => 'required|string|max:255',
            'produit' => 'required|string|max:255',
            'quantite' => 'required|numeric',
            'prix_unitaire' => 'required|numeric',
        ]);
    
        $facture = Facture::create($request->all());
    
        return response()->json($facture, 201);
    }


    public function genererLienPDF($id)
    {
        $facture = Facture::findOrFail($id);
    
        // Vérifie s'il existe un lien déjà utilisé
        $lienUtilise = LienFacture::where('facture_id', $facture->id)
                        ->where('utilise', true)
                        ->first();
    
        if ($lienUtilise) {
            return response()->json(['message' => 'Lien déjà utilisé. Vous ne pouvez plus générer cette facture.'], 403);
        }
    
        // Vérifie s’il y a un lien encore valide
        $lienExistant = LienFacture::where('facture_id', $facture->id)
                        ->where('utilise', false)
                        ->where('expire_le', '>', now())
                        ->first();
    
        if ($lienExistant) {
            $url = url("/facture/telecharger/{$lienExistant->token}");
            return response()->json(['url' => $url], 200);
        }
    
        // Sinon, création d’un nouveau lien
        $token = Str::uuid();
        $lien = LienFacture::create([
            'facture_id' => $facture->id,
            'token' => $token,
            'utilise' => false,
            'expire_le' => now()->addDay(),
        ]);
    
        $url = url("/facture/telecharger/{$token}");
        return response()->json(['url' => $url], 201);
    }
    
    
    public function telechargerLien($token)
    {
        $lien = LienFacture::where('token', $token)->first();
    
        if (!$lien) {
            return response()->json(['message' => 'Lien invalide'], 404);
        }
    
        if ($lien->utilise) {
            return response()->json(['message' => 'Lien déjà utilisé'], 403);
        }
    
        // 🔒 Marquer comme utilisé IMMÉDIATEMENT
        $lien->update(['utilise' => true]);
    
        $facture = $lien->facture;
    
        // 🖨️ Générer le PDF
        $pdf = Pdf::loadView('pdf.facture', compact('facture'));
    
        return response($pdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="facture_' . $facture->id . '.pdf"')
            ->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            ->header('Pragma', 'no-cache')
            ->header('Expires', '0');
    }
    
    public function viewPDF($uuid)
    {
        $invoice = Invoice::where('uuid', $uuid)
                          ->where('expires_at', '>=', now())
                          ->firstOrFail();
    
        $sessionKey = 'access_pdf_'.$uuid;
    
        if (!session()->has($sessionKey)) {
            // Première visite : autoriser et stocker en session
            session()->put($sessionKey, true);
        } else {
            // Déjà consulté dans cette session : autorisé
        }
    
        // Générer le PDF
        $pdf = PDF::loadView('invoices.pdf', compact('invoice'));
        return $pdf->stream('facture.pdf');
    }
     
}






