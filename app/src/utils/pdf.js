import { jsPDF } from 'jspdf';

// Returns an object URL (blob URL) to open in a new tab
export function generateRentalPDF({ rental, car, person }) {
  try {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const margin = 48;
    let y = margin;

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('ALQUILERES PELADO', margin, y);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    y += 18;
    doc.text('Comprobante de reserva', margin, y);

    // Right side meta
    const rightX = 595 - margin; // A4 width 595pt
    doc.setFontSize(10);
    doc.text(`Nro: ${rental?.id ?? '-'} `, rightX, margin, { align: 'right' });
    doc.text(`Fecha emisión: ${formatDate(new Date())}`, rightX, margin + 14, { align: 'right' });

    // Separator
    y += 24;
    line(doc, margin, y, 595 - margin, y);
    y += 18;

    // Customer (person)
    doc.setFont('helvetica', 'bold');
    doc.text('Datos del cliente', margin, y); y += 14;
    doc.setFont('helvetica', 'normal');
    doc.text(`Nombre: ${person?.name ?? '-'}`, margin, y); y += 14;
    doc.text(`DNI: ${person?.dni ?? '-'}`, margin, y); y += 14;
    doc.text(`Teléfono: ${person?.phone ?? '-'}`, margin, y); y += 14;
    doc.text(`Género: ${person?.gender ?? '-'}`, margin, y); y += 18;

    // Car
    doc.setFont('helvetica', 'bold');
    doc.text('Datos del auto', margin, y); y += 14;
    doc.setFont('helvetica', 'normal');
    doc.text(`Vehículo: ${car?.brand ?? '-'} ${car?.model ?? ''}`.trim(), margin, y); y += 14;
    doc.text(`Color: ${car?.color ?? '-'}`, margin, y); y += 14;
    doc.text(`Año: ${car?.age ?? '-'}`, margin, y); y += 18;

    // Rental
    doc.setFont('helvetica', 'bold');
    doc.text('Detalle del alquiler', margin, y); y += 14;
    doc.setFont('helvetica', 'normal');
    const start = (rental?.start_date || '').slice(0,10);
    const end = (rental?.completion_date || '').slice(0,10);
    const daily = Number(rental?.daily_rate ?? car?.price_day ?? 0);
    const days = diffDays(start, end);
    const total = Number(rental?.total ?? (daily * days));
    doc.text(`Desde: ${format( start )}`, margin, y); y += 14;
    doc.text(`Hasta: ${format( end )}`, margin, y); y += 14;
    doc.text(`Días: ${days}`, margin, y); y += 14;
    doc.text(`Tarifa diaria: $${fmt(daily)}`, margin, y); y += 18;

    // Total box
    const boxY = y;
    doc.setDrawColor(49, 130, 206); // blue-600
    doc.setFillColor(15, 23, 42); // slate-900
    doc.roundedRect(595 - margin - 220, boxY - 24, 220, 72, 6, 6, 'S');
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL', 595 - margin - 110, boxY, { align: 'center' });
    doc.setFontSize(16);
    doc.text(`$ ${fmt(total)}`, 595 - margin - 110, boxY + 26, { align: 'center' });
    doc.setFontSize(11);
    y += 72;

    // Terms
    y += 16;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    const terms = 'Este comprobante certifica la reserva del vehículo indicado por el período seleccionado. Presentarlo junto a su DNI al momento de retirar el vehículo. La reserva puede estar sujeta a verificación de disponibilidad y condiciones de la empresa.';
    wrapText(doc, terms, margin, y, 595 - margin * 2, 14);

    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    return url;
  } catch (e) {
    console.error('PDF error', e);
    return null;
  }
}

function line(doc, x1, y1, x2, y2) {
  doc.setDrawColor(51, 65, 85);
  doc.line(x1, y1, x2, y2);
}

function wrapText(doc, text, x, y, maxWidth, lineHeight) {
  const lines = doc.splitTextToSize(text, maxWidth);
  lines.forEach((ln, i) => doc.text(ln, x, y + i * lineHeight));
}

function formatDate(d) {
  try { return d.toISOString().slice(0,10); } catch { return ''; }
}

function fmt(n) {
  try {
    const num = Number(n);
    if (!Number.isFinite(num)) return '0';
    return num.toLocaleString('es-AR');
  } catch { return '0'; }
}

function format(s) { return s || '-'; }

function diffDays(a, b) {
  try {
    const s = new Date(a); s.setHours(12,0,0,0);
    const e = new Date(b); e.setHours(12,0,0,0);
    const ms = e - s;
    if (!Number.isFinite(ms)) return 0;
    const d = Math.round(ms / (1000*60*60*24));
    return d > 0 ? d : 0;
  } catch {
    return 0;
  }
}
