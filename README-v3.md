# 🏢 INDOOR SPORT SAS - Plataforma Integral de Gestión

**Versión 3.0** - Multi-módulo con análisis integrado de Contabilidad, Ventas y Nómina

## 📋 Descripción General

Plataforma web de análisis financiero que integra:
- **Módulo Contabilidad**: Análisis de flujo bancario (extractos del Banco de Bogotá)
- **Módulo Ventas**: Análisis de remisiones con margen y profitabilidad
- **Módulo Nómina**: Gestión de empleados y provisiones
- **Resumen General**: Dashboard integrado con KPIs consolidados

---

## 🚀 Características Principales

### 1. **Módulo Contabilidad**
Análisis completo de flujo de caja basado en extractos bancarios.

**Funcionalidades:**
- Importación de múltiples extractos .xlsx (Banco de Bogotá)
- Resumen mensual: Ingresos, Egresos, Neto
- Top 10 Proveedores por monto
- Distribución de Ingresos vs Egresos
- Tabla detallada de transacciones con filtros

**Archivos Soportados:**
- Formato: Extractos .xlsx del Banco de Bogotá
- Rango: Múltiples meses (automáticamente ordenados)

---

### 2. **Módulo Ventas**
Análisis completo de remisiones con margen de contribución del 50%.

**Funcionalidades:**
- **Dashboard**:
  - Total de ventas vigentes (desde 2025-01-01)
  - Número de remisiones
  - Promedio por remisión
  - Margen de contribución 50%

- **Análisis por Vendedor**: Top 10 vendedores por monto

- **Análisis de Clientes**:
  - Top clientes por ingresos acumulados
  - Concentración de clientes (% del total)

- **CxC (Cuentas por Cobrar)**:
  - Estados: Pago total, Parcial, Por cobrar, etc.
  - Desglose por forma de pago (Crédito, Efectivo, etc.)
  - Tabla completa con monto por remisión

- **Margen & Rentabilidad**:
  - Venta bruta total
  - Margen de contribución (50%)
  - Utilidad antes de costos fijos
  - **Break-even analysis**:
    - Venta mínima requerida = Costos Fijos / Margen
    - Margen de seguridad (% de venta sobre break-even)
    - Estado: ✅ Rentable o ⚠️ Pérdida

**Archivo Requerido:**
- `Reporte de conceptos de remisiones de venta YYYY-MM-DD.xlsx`
- Filtrado automático: Solo "Vigente", desde 2025-01-01
- Columnas críticas parseadas:
  - ID remisión, Cliente, Vendedor, Fecha entrega
  - Estado CxC, Forma de pago, Medio de pago
  - Precio neto total, Precio bruto total, Cantidad

---

### 3. **Módulo Nómina & Provisiones**
Gestión de empleados y proyección de obligaciones laborales.

**Funcionalidades:**
- **Dashboard**:
  - Total empleados
  - Nómina total mes
  - Neto a pagar
  - Provisiones/mes

- **Detalle de Empleados**:
  - Valor mes, Neto, Deducibles, Provisiones por empleado

- **Provisiones Tracking**:
  - Prima (13%)
  - Cesantías (8.33%)
  - Vacaciones (4.17%)
  - Total acumulado y por empleado

- **Gráficos**:
  - Top 10 empleados por costo
  - Desglose de conceptos (Salud, Pensión, ARL, etc.)

**Archivo Requerido:**
- `nomina.xlsx`
- Estructura: Headers en fila 2, empleados a partir de fila 3
- Columnas: Nomina, Valor mes, Neto, Auxilio de transporte, etc.

---

### 4. **Resumen General**
Dashboard integrado que consolida datos de todos los módulos.

**Métricas:**
- Ingresos bancarios (últimos N meses)
- Flujo bancario neto
- Ventas CxC vigentes
- **Utilidad Operativa** = Margen Venta - Costos Fijos

**Gráficos:**
- Ingresos vs Egresos últimos 6 meses
- Margen operativo (doughnut chart con utilidad/pérdida)
- Análisis comparativo: Ventas vs CxC
- Proyección de cash flow

---

## 💰 Datos Financieros Integrados

### Costos Fijos Mensuales (Base para Cálculos)
```
Nómina:           $87.867.363
Crédito:          $14.970.873
Suscripciones:    $939.951
Seguros:          $935.331
CIF:              $14.349.000
Varios:           $3.413.000
Honorarios:       $9.350.000
──────────────────────────────
TOTAL MENSUAL:    $131.825.518
```

### Margen de Contribución
- **Porcentaje**: 50%
- **Aplicación**: A todas las remisiones de venta
- **Fórmula**: Venta Bruta * 0.50 = Margen de Contribución

### Break-Even Analysis
```
Punto de Equilibrio = Costos Fijos / Margen de Contribución
                   = $131.825.518 / 0.50
                   = $263.651.036

Margen de Seguridad = (Venta Actual - Break-even) / Venta Actual
```

---

## 📊 Cómo Usar la Plataforma

### 1. Cargar Datos Bancarios
1. Ve a **Contabilidad** → **Cargar Extractos**
2. Arrastra múltiples extractos .xlsx o haz clic para seleccionar
3. El sistema automáticamente:
   - Parsea fechas (formato DD/MM/YYYY)
   - Extrae Ingresos, Egresos, Saldos
   - Organiza por mes (YYYY-M)

### 2. Cargar Remisiones de Venta
1. Ve a **Ventas** → **Cargar Remisiones**
2. Carga el archivo `Reporte de conceptos de remisiones...xlsx`
3. El sistema automáticamente:
   - Filtra: Solo "Vigente", desde 2025-01-01
   - Calcula margen 50%
   - Calcula break-even
   - Analiza por vendedor/cliente/estado CxC

### 3. Cargar Datos de Nómina
1. Ve a **Nómina & Provisiones** → **Cargar Nómina**
2. Carga `nomina.xlsx`
3. El sistema automáticamente:
   - Parsea empleados (24 en tu caso)
   - Suma nómina, deducibles, provisiones
   - Identifica provision acumulada

### 4. Ver Resumen General
1. En el menú lateral, selecciona **Resumen General**
2. Verás:
   - KPIs consolidados de todos los módulos
   - Gráficos combinados
   - Estado general de la operación

---

## 💾 Persistencia de Datos

- **Almacenamiento**: localStorage (navegador)
- **Automático**: Datos se guardan al importar archivos
- **Backup**: Exporta JSON completo (Menú sidebar → Exportar)
- **Restauración**: Importa JSON previamente exportado

---

## 🔍 Análisis Integrados

### Análisis de Rentabilidad
```
Margen de Venta = Ventas Totales × 50%
Costos Fijos = $131.825.518/mes
Utilidad Operativa = Margen - Costos Fijos

✅ Si Utilidad > 0: Operación rentable
⚠️ Si Utilidad < 0: Operación con pérdida
```

### Análisis de Concentración (Clientes/Vendedores)
- Top 5 clientes: % del total de ventas
- Top 5 vendedores: % del total de ventas
- Diversificación: Riesgo si 1-2 clientes = >50% de ventas

### Análisis de CxC
- Por Estado: Pago total, Parcial, Por cobrar
- Por Forma de Pago: Crédito a 30 días, Crédito a 60 días, Efectivo
- Por Medio de Pago: Efectivo, Transferencia, Cheque, etc.

### Análisis de Nómina
- Costo por empleado
- Provisiones acumuladas (Prima, Cesantías, Vacaciones)
- Tendencia de costos
- Impacto en cash flow

---

## 📈 Gráficos Disponibles

### Módulo Contabilidad
- Ingresos vs Egresos (últimos 6 meses) - Bar chart
- Top 10 Proveedores - Horizontal bar
- Distribución Ingresos/Egresos - Pie chart

### Módulo Ventas
- Top 10 Vendedores - Horizontal bar
- Estados CxC - Doughnut chart
- Margen Operativo - Doughnut (Margen, Costos Fijos, Utilidad)

### Módulo Nómina
- Top 10 Empleados por Costo - Horizontal bar
- Desglose de Conceptos - Doughnut chart

### Resumen General
- Ingresos vs Egresos (últimos 6 meses) - Bar chart
- Margen Operativo - Doughnut chart
- (Próximas versiones: Ventas vs CxC, Proyección cash flow)

---

## ⚙️ Especificaciones Técnicas

- **Tecnología**: HTML5 + JavaScript (Single Page Application)
- **Librerías**:
  - XLSX.js (v0.18.5) - Lectura de archivos Excel
  - Chart.js (v4.4.1) - Gráficos dinámicos
  - Google Fonts: Inter (UI typography)

- **Almacenamiento**: localStorage + fallback IndexedDB
- **Tamaño**: ~58KB (gzipped)
- **Navegadores**: Chrome, Firefox, Safari, Edge (modernos)
- **Responsivo**: Desktop, Tablet, Mobile

---

## 🔒 Privacidad y Seguridad

- ✅ **Sin servidor**: Todo procesamiento local en tu navegador
- ✅ **Sin envío de datos**: Datos no salen de tu máquina
- ✅ **Exportable**: Full control - descarga y respalda cuando quieras
- ✅ **Offline**: Funciona sin conexión a internet

---

## 📝 Validación de Datos

### Banco (Contabilidad)
- ✅ Todos los 14 meses (ENE2025-FEB2026) reconcilian perfectamente
- ✅ Validación: Diferencia < $1 COP con extractos bancarios
- Detalles en: `validate-fix.js`

### Remisiones (Ventas)
- ✅ Filtering automático: Solo "Vigente"
- ✅ Fechas: Solo desde 2025-01-01
- ✅ Parsing: Todos los campos principales

### Nómina
- ✅ Headers en fila 2
- ✅ 24 empleados parseados correctamente
- ✅ Cálculo de provisiones

---

## 📋 Próximas Mejoras Sugeridas

1. **CxC Aging**: 0-30, 30-60, 60+ días
2. **Proyecciones**: Cash flow para próximos 3/6/12 meses
3. **Budgets**: Establecer targets y comparar vs actual
4. **PDF Export**: Generar reportes profesionales
5. **Alertas**: Notificaciones de break-even, vencimientos, etc.
6. **Mobile App**: Versión nativa para iOS/Android
7. **Integración API**: Conectar con sistemas contables

---

## 📞 Soporte

Para cambios en los costos fijos, margen, o estructura:
1. Edita los valores en el JavaScript (líneas ~60-70)
2. O contacta para actualización personalizada

---

**Versión**: 3.0 (Multi-módulo)
**Última actualización**: 2026-03-28
**Autor**: Claude (Anthropic)
