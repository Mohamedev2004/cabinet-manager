
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Facture {{ $invoice->invoice_number }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 14px; color: #333; line-height: 1.6; }
        .invoice-box { max-width: 800px; margin: auto; padding: 30px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
        .company-info { text-align: left; }
        .invoice-info { text-align: right; }
        .patient-info { margin-bottom: 30px; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .table th { background: #f8f9fa; border-bottom: 2px solid #dee2e6; padding: 12px; text-align: left; }
        .table td { padding: 12px; border-bottom: 1px solid #eee; }
        .totals { float: right; width: 250px; }
        .total-row { display: flex; justify-content: space-between; padding: 5px 0; }
        .total-row.grand-total { font-weight: bold; font-size: 1.2em; border-top: 2px solid #333; margin-top: 10px; padding-top: 10px; }
        .status-badge { display: inline-block; padding: 5px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
        .status-paid { background: #d4edda; color: #155724; }
        .status-partially_paid { background: #fff3cd; color: #856404; }
        .status-pending { background: #f8d7da; color: #721c24; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 20px; }
        .clearfix::after { content: ""; clear: both; display: table; }
    </style>
</head>
<body>
    <div class="invoice-box">
        <table style="width: 100%; margin-bottom: 40px;">
            <tr>
                <td style="width: 50%; vertical-align: top;">
                    <div class="company-info">
                        <h1 style="margin: 0; color: #2c3e50;">CABINET MÉDICAL</h1>
                        <p style="margin: 5px 0;">Adresse du Cabinet<br>Ville, Code Postal<br>Téléphone: 05 XX XX XX XX</p>
                    </div>
                </td>
                <td style="width: 50%; text-align: right; vertical-align: top;">
                    <div class="invoice-info">
                        <h2 style="margin: 0; color: #2c3e50;">FACTURE</h2>
                        <p style="margin: 5px 0;">
                            <strong>N°:</strong> {{ $invoice->invoice_number }}<br>
                            <strong>Date:</strong> {{ \Carbon\Carbon::parse($invoice->invoice_date)->format('d/m/Y') }}<br>
                            <strong>Statut:</strong> 
                            <span class="status-badge status-{{ $invoice->status }}">
                                @if($invoice->status === 'paid') Payée
                                @elseif($invoice->status === 'partially_paid') Partiellement Payée
                                @else En attente
                                @endif
                            </span>
                        </p>
                    </div>
                </td>
            </tr>
        </table>

        <div class="patient-info">
            <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">Facturé à :</h3>
            <p style="margin: 5px 0;">
                <strong>{{ $invoice->patient->first_name }} {{ $invoice->patient->last_name }}</strong><br>
                Téléphone: {{ $invoice->patient->phone }}<br>
                Adresse: {{ $invoice->patient->address ?? '—' }}
            </p>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>Service / Acte</th>
                    <th style="text-align: right;">Prix Unitaire</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $item)
                <tr>
                    <td>{{ $item->service->name ?? 'Service #' . $item->service_id }}</td>
                    <td style="text-align: right;">{{ number_format($item->unit_price, 2, ',', ' ') }} Dhs</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="clearfix">
            <div class="totals">
                <table style="width: 100%;">
                    <tr>
                        <td style="padding: 5px 0;">Sous-total:</td>
                        <td style="text-align: right; padding: 5px 0;">{{ number_format($invoice->total_amount, 2, ',', ' ') }} Dhs</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0;">Montant Payé:</td>
                        <td style="text-align: right; padding: 5px 0; color: #28a745;">{{ number_format($invoice->paid_amount, 2, ',', ' ') }} Dhs</td>
                    </tr>
                    <tr class="grand-total">
                        <td style="padding: 10px 0;">Reste à payer:</td>
                        <td style="text-align: right; padding: 10px 0; color: #dc3545;">{{ number_format($invoice->remaining_amount, 2, ',', ' ') }} Dhs</td>
                    </tr>
                </table>
            </div>
        </div>

        <div class="footer">
            <p>Merci pour votre confiance.</p>
            <p>Cabinet Médical - Logiciel de Gestion</p>
        </div>
    </div>
</body>
</html>
