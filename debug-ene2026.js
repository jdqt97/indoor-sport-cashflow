const XLSX = require('xlsx');

const f = 'C:\\Users\\Jorge Daniel\\OneDrive\\Documentos\\01.TRABAJO\\02. INDOOR SPORT\\04.FINANZAS\\Extractos\\27700047658_ENE2026.xlsx';
const wb = XLSX.readFile(f);
const ws = wb.Sheets[wb.SheetNames[0]];
const range = XLSX.utils.decode_range(ws['!ref']);
const totalRows = range.e.r + 1;

const getCell = (r, c) => {
  const cell = ws[XLSX.utils.encode_cell({r, c})];
  return cell ? String(cell.v).trim() : '';
};

function parseNum(str) {
  if (!str) return 0;
  return parseFloat(str.replace(/,/g, '').replace(/\s/g, '').replace(/\$/g, '')) || 0;
}

// Get summary
for (let r = 0; r < 20; r++) {
  if (getCell(r, 0) === 'SALDO ANTERIOR') {
    const dr = r + 1;
    console.log('=== RESUMEN DEL EXTRACTO (lo que dice el banco) ===');
    console.log('Saldo Anterior:', getCell(dr, 0));
    console.log('Total Abonos:', getCell(dr, 1));
    console.log('Total Cargos:', getCell(dr, 2));
    console.log('Saldo Actual:', getCell(dr, 3));
    break;
  }
}

// Get year
let year = '';
for (let r = 0; r < 15; r++) {
  if (getCell(r, 0) === 'DESDE') { year = getCell(r+1, 1).split('/')[0]; break; }
}

// Parse ALL transactions
const transactions = [];
let r = 0;
while (r < totalRows) {
  if (getCell(r, 0) === 'FECHA' && getCell(r, 1).includes('DESCRIPCI')) {
    r++;
    while (r < totalRows) {
      const fecha = getCell(r, 0);
      const desc = getCell(r, 1);
      if (desc === 'FIN ESTADO DE CUENTA') { r++; break; }
      if (fecha === 'FECHA') break;
      if (fecha === 'Movimientos:' || desc === 'Movimientos:') break;
      if (fecha && fecha.includes('/') && desc) {
        const valor = parseNum(getCell(r, 4));
        const saldo = parseNum(getCell(r, 5));
        transactions.push({ fecha, desc, valor, saldo });
      }
      r++;
    }
  } else { r++; }
}

// Real totals (by sign of value, as the bank does it)
let bankAbonos = 0, bankCargos = 0;
transactions.forEach(t => {
  if (t.valor > 0) bankAbonos += t.valor;
  else bankCargos += Math.abs(t.valor);
});

console.log('\n=== TOTALES POR SIGNO DEL VALOR (como el banco) ===');
console.log('Abonos (positivos):', bankAbonos.toFixed(2));
console.log('Cargos (negativos):', bankCargos.toFixed(2));
console.log('Total transacciones:', transactions.length);

// Now apply categorization logic from the dashboard
function categorize(desc, valor) {
  const d = desc.toUpperCase();
  if (d.includes('PAGO A NOMIN') || d.includes('PAGO DE NOMIN') || d.includes('NOMINA') || d.includes('NÓMINA'))
    return 'Nómina';
  if (d.includes('PAGO A PROVE') || d.includes('PAGO DE PROV'))
    return 'Proveedores';
  if (d.includes('COMPRA EN'))
    return 'Compras';
  if (d.includes('TRASLADO') || d.includes('FONDO DE INVERSION') || d.includes('FONDO INVERSION'))
    return 'Movimiento Interno';
  if (d.includes('IMPTO') || d.includes('4X1000') || d.includes('RETEFUENTE') || d.includes('RETEICA') ||
      d.includes('RETENCION') || d.includes('ICA ') || d.includes('COBRO IVA'))
    return 'Impuestos';
  if (d.includes('CUOTA MANEJO') || d.includes('IVA CUOTA') || d.includes('COMISION') ||
      d.includes('COBRO PAGOS AUTO') || d.includes('PAGO INTERES') || d.includes('ABONO INTERES'))
    return 'Gastos Financieros';
  if (d.includes('PAGO PSE'))
    return 'Servicios/PSE';
  if (d.includes('RETIRO CAJERO') || d.includes('RETIRO ATM'))
    return 'Retiros';
  if (valor > 0) {
    if (d.includes('CONSIG') || d.includes('CONSIGNACION')) return 'Ingresos - Consignaciones';
    if (d.includes('TRANSFERENCIA')) return 'Ingresos - Transferencias';
    if (d.includes('PAGO QR')) return 'Ingresos - Pago QR';
    if (d.includes('PAGO INTERBANC')) return 'Ingresos - Interbancario';
    return 'Ingresos - Otros';
  }
  if (valor < 0) return 'Otros Egresos';
  return 'Otros';
}

function isIngreso(cat) { return cat.startsWith('Ingresos'); }
function isEgreso(cat) { return !isIngreso(cat) && cat !== 'Movimiento Interno'; }

// Apply categorization and calculate dashboard totals
let dashIngresos = 0, dashEgresos = 0;
const problemTx = []; // Transactions where sign ≠ category

transactions.forEach(t => {
  const cat = categorize(t.desc, t.valor);

  if (isIngreso(cat)) dashIngresos += t.valor;
  else if (isEgreso(cat)) dashEgresos += Math.abs(t.valor);

  // Flag problematic transactions: positive value but categorized as egreso
  if (t.valor > 0 && isEgreso(cat)) {
    problemTx.push({ ...t, cat, issue: 'POSITIVE value but categorized as EGRESO' });
  }
  // Negative value but categorized as ingreso
  if (t.valor < 0 && isIngreso(cat)) {
    problemTx.push({ ...t, cat, issue: 'NEGATIVE value but categorized as INGRESO' });
  }
});

console.log('\n=== TOTALES SEGÚN CATEGORIZACIÓN DEL DASHBOARD ===');
console.log('Ingresos (cat starts with "Ingresos"):', dashIngresos.toFixed(2));
console.log('Egresos (cat is egreso):', dashEgresos.toFixed(2));
console.log('Flujo neto dashboard:', (dashIngresos - dashEgresos).toFixed(2));

console.log('\n=== TRANSACCIONES PROBLEMÁTICAS (signo ≠ categoría) ===');
console.log(`Encontradas: ${problemTx.length}`);
problemTx.forEach(t => {
  console.log(`  ${t.fecha} | ${t.desc.substring(0,45)} | VALOR: ${t.valor} | CAT: ${t.cat} | ${t.issue}`);
});

// Sum of problematic positive tx classified as egreso
const posAsEgreso = problemTx.filter(t => t.valor > 0).reduce((s,t) => s + t.valor, 0);
const negAsIngreso = problemTx.filter(t => t.valor < 0).reduce((s,t) => s + Math.abs(t.valor), 0);
console.log(`\nTotal valor positivo clasificado como egreso: $${posAsEgreso.toFixed(2)}`);
console.log(`Total valor negativo clasificado como ingreso: $${negAsIngreso.toFixed(2)}`);

// Show all categories and their totals
const catSummary = {};
transactions.forEach(t => {
  const cat = categorize(t.desc, t.valor);
  if (!catSummary[cat]) catSummary[cat] = { pos: 0, neg: 0, count: 0 };
  if (t.valor > 0) catSummary[cat].pos += t.valor;
  else catSummary[cat].neg += Math.abs(t.valor);
  catSummary[cat].count++;
});

console.log('\n=== RESUMEN POR CATEGORÍA ===');
Object.entries(catSummary).sort((a,b) => (b[1].pos+b[1].neg) - (a[1].pos+a[1].neg)).forEach(([cat, data]) => {
  const tipo = isIngreso(cat) ? 'INGRESO' : isEgreso(cat) ? 'EGRESO' : 'INTERNO';
  console.log(`  ${cat} [${tipo}]: +${data.pos.toFixed(0)} / -${data.neg.toFixed(0)} (${data.count} tx)`);
});
