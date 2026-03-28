const XLSX = require('xlsx');

const basePath = 'C:\\Users\\Jorge Daniel\\OneDrive\\Documentos\\01.TRABAJO\\02. INDOOR SPORT\\04.FINANZAS\\Extractos\\';
const files = [
  '27700047658_ENE2025.xlsx','27700047658_FEB2025.xlsx','27700047658_MAR2025.xlsx',
  '27700047658_ABR2025.xlsx','27700047658_MAY2025.xlsx','27700047658_JUN2025.xlsx',
  '27700047658_JUL2025.xlsx','27700047658_AGO2025.xlsx','27700047658_SEP2025.xlsx',
  '27700047658_OCT2025.xlsx','27700047658_NOV2025.xlsx','27700047658_DIC2025.xlsx',
  '27700047658_ENE2026.xlsx','27700047658_FEB2026.xlsx',
];

function parseNum(str) {
  if (!str) return 0;
  return parseFloat(str.replace(/,/g, '').replace(/\s/g, '').replace(/\$/g, '')) || 0;
}

// NEW logic: isIngreso = valor > 0, isEgreso = valor < 0
function isIngreso(t) { return t.valor > 0; }
function isEgreso(t) { return t.valor < 0; }

console.log('VALIDACIÓN CON LÓGICA CORREGIDA: Ingreso/Egreso por SIGNO del valor');
console.log('='.repeat(100));
console.log('');
console.log(
  'Mes'.padEnd(12) + '| ' +
  'Abonos Extracto'.padStart(20) + ' | ' +
  'Abonos Calc'.padStart(20) + ' | ' +
  'Cargos Extracto'.padStart(20) + ' | ' +
  'Cargos Calc'.padStart(20) + ' | ' +
  'OK?'
);
console.log('-'.repeat(105));

let allOk = true;

files.forEach(filename => {
  const wb = XLSX.readFile(basePath + filename);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const range = XLSX.utils.decode_range(ws['!ref']);
  const totalRows = range.e.r + 1;
  const getCell = (r, c) => { const cell = ws[XLSX.utils.encode_cell({r, c})]; return cell ? String(cell.v).trim() : ''; };

  let summary = {};
  for (let r = 0; r < 20; r++) {
    if (getCell(r, 0) === 'SALDO ANTERIOR') {
      const dr = r + 1;
      summary = { saldoAnterior: parseNum(getCell(dr,0)), totalAbonos: parseNum(getCell(dr,1)), totalCargos: parseNum(getCell(dr,2)), saldoActual: parseNum(getCell(dr,3)) };
      break;
    }
  }

  let year = '';
  for (let r = 0; r < 15; r++) { if (getCell(r, 0) === 'DESDE') { year = getCell(r+1, 1).split('/')[0]; break; } }

  const transactions = [];
  let r = 0;
  while (r < totalRows) {
    if (getCell(r, 0) === 'FECHA' && getCell(r, 1).includes('DESCRIPCI')) {
      r++;
      while (r < totalRows) {
        const fecha = getCell(r, 0), desc = getCell(r, 1);
        if (desc === 'FIN ESTADO DE CUENTA') { r++; break; }
        if (fecha === 'FECHA' || fecha === 'Movimientos:' || desc === 'Movimientos:') break;
        if (fecha && fecha.includes('/') && desc) {
          transactions.push({ valor: parseNum(getCell(r, 4)), desc });
        }
        r++;
      }
    } else { r++; }
  }

  // Calculate using NEW logic (by sign)
  let calcIng = 0, calcEgr = 0;
  transactions.forEach(t => {
    if (isIngreso(t)) calcIng += t.valor;
    else if (isEgreso(t)) calcEgr += Math.abs(t.valor);
  });

  const ingOk = Math.abs(calcIng - summary.totalAbonos) < 1;
  const egrOk = Math.abs(calcEgr - summary.totalCargos) < 1;
  const ok = ingOk && egrOk;
  if (!ok) allOk = false;

  const label = filename.replace('27700047658_','').replace('.xlsx','');
  console.log(
    label.padEnd(12) + '| ' +
    summary.totalAbonos.toFixed(2).padStart(20) + ' | ' +
    calcIng.toFixed(2).padStart(20) + ' | ' +
    summary.totalCargos.toFixed(2).padStart(20) + ' | ' +
    calcEgr.toFixed(2).padStart(20) + ' | ' +
    (ok ? '✅' : '❌')
  );

  if (!ok) {
    console.log(`  ^^^ Dif Abonos: ${Math.abs(calcIng - summary.totalAbonos).toFixed(2)} | Dif Cargos: ${Math.abs(calcEgr - summary.totalCargos).toFixed(2)}`);
  }
});

console.log('-'.repeat(105));
console.log(allOk ? '\n✅✅✅ TODOS LOS 14 MESES CUADRAN PERFECTAMENTE ✅✅✅' : '\n❌ HAY DISCREPANCIAS - REVISAR');
