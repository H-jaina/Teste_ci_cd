<?php

namespace App\Http\Controllers;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Facture;
use App\Models\LienFacture;

class LienFactureController extends Controller
{
    public function telecharger($token)
    {
        $lien = LienFacture::where('token', $token)
            ->where('utilise', false)
            ->first();

        if (!$lien) {
            return response('Lien invalide ou déjà utilisé', 404);
        }

        $facture = Facture::find($lien->facture_id);

        if (!$facture) {
            return response('Facture introuvable', 404);
        }

        // Générer le PDF
        $pdf = Pdf::loadView('pdf.facture', compact('facture'));

        // Marquer le lien comme utilisé
        $lien->utilise = true;
        $lien->save();

        return $pdf->stream("facture_{$facture->id}.pdf");
    }
}
