<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Facture #{{ $facture->id }}</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 14px;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .facture-container {
            padding: 30px;
        }
        h1 {
            color: #18BC9C;
            text-align: center;
        }
        .infos {
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            border: 1px solid #ccc;
            padding: 10px;
        }
        th {
            background-color: #f0f0f0;
        }
        .total {
            text-align: right;
            margin-top: 20px;
            font-weight: bold;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            text-align: center;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="facture-container">
        <h1>Facture N°{{ $facture->id }}</h1>
        <div class="infos">
            <p><strong>Client :</strong> {{ $facture->client }}</p>
            <p><strong>Date :</strong> {{ $facture->created_at->format('d/m/Y') }}</p>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Désignation</th>
                    <th>Quantité</th>
                    <th>Prix unitaire</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ $facture->produit }}</td>
                    <td>{{ $facture->quantite }}</td>
                    <td>{{ number_format($facture->prix_unitaire, 0, ',', ' ') }} Ar</td>
                    <td>{{ number_format($facture->prix_unitaire * $facture->quantite, 0, ',', ' ') }} Ar</td>
                </tr>
            </tbody>
        </table>

        <p class="total">Total à payer : {{ number_format($facture->prix_unitaire * $facture->quantite, 0, ',', ' ') }} Ar</p>

        <div class="footer">
            <p>Merci de votre confiance!</p>
        </div>
    </div>
</body>
</html>
