'use client';

import { SheetState, cellKey } from './excelEngine';

export function buildSheetFromGrid(
  name: string,
  grid: string[][],
  headerBg = '#E8F0FE',
  headerColor = '#1A0F0A'
): SheetState {
  const cells: SheetState['cells'] = {};
  grid.forEach((row, r) => {
    row.forEach((val, c) => {
      if (val !== '') {
        cells[cellKey(r, c)] = {
          v: val,
          s:
            r === 0
              ? { bold: true, bg: headerBg, color: headerColor, border: true }
              : val.startsWith('=SUM')
              ? { bold: true, bg: '#FFF9F5' }
              : undefined,
        };
      }
    });
  });

  return {
    name,
    cells,
    rows: Math.max(35, grid.length + 15),
    cols: Math.max(18, (grid[0]?.length || 0) + 8),
    colWidths: { 0: 170, 1: 140, 2: 110, 3: 110, 4: 120 },
    freezeHeader: true,
    showGridlines: true,
  };
}

export const SPREADSHEET_TEMPLATES: { id: string; label: string; build: () => { title: string; sheets: SheetState[] } }[] = [
  {
    id: 'blank',
    label: 'Blank Spreadsheet',
    build: () => ({
      title: 'Untitled spreadsheet',
      sheets: [
        {
          name: 'Sheet1',
          cells: {},
          rows: 40,
          cols: 18,
          colWidths: {},
          freezeHeader: false,
          showGridlines: true,
        },
      ],
    }),
  },
  {
    id: 'budget',
    label: 'Monthly Budget Planner',
    build: () => ({
      title: 'Monthly Budget Planner',
      sheets: [
        buildSheetFromGrid(
          'Budget',
          [
            ['Expense Item', 'Category', 'Qty', 'Unit Price', 'Total Cost'],
            ['Cloud Hosting', 'Infrastructure', '1', '1200', '=C2*D2'],
            ['Design Software', 'Creative', '2', '650', '=C3*D3'],
            ['Play Store Console', 'Publishing', '1', '2100', '=C4*D4'],
            ['Test Devices', 'Hardware', '2', '3500', '=C5*D5'],
            ['Office Fiber', 'Utilities', '1', '799', '=C6*D6'],
            ['Grand Total', '', '=SUM(C2:C6)', '', '=SUM(E2:E6)'],
          ],
          '#FFF0E6',
          '#D94F1D'
        ),
        buildSheetFromGrid('Notes', [['Topic', 'Details'], ['Savings Goal', 'Keep monthly overhead below 15000']]),
      ],
    }),
  },
  {
    id: 'invoice',
    label: 'GST Invoice Sheet',
    build: () => ({
      title: 'Client GST Invoice #2026',
      sheets: [
        buildSheetFromGrid(
          'Invoice',
          [
            ['Service / Item', 'Qty', 'Rate', 'Tax Rate', 'Subtotal'],
            ['Mobile App UI Design', '1', '15000', '0.18', '=B2*C2*(1+D2)'],
            ['Store Banner Assets', '3', '2000', '0.18', '=B3*C3*(1+D3)'],
            ['QA Regression Testing', '2', '2500', '0.18', '=B4*C4*(1+D4)'],
            ['Total Payable', '', '', '', '=SUM(E2:E4)'],
          ],
          '#ECFDF5',
          '#065F46'
        ),
      ],
    }),
  },
  {
    id: 'inventory',
    label: 'Inventory & Stock Tracker',
    build: () => ({
      title: 'Inventory Tracker',
      sheets: [
        buildSheetFromGrid(
          'Stock',
          [
            ['SKU', 'Product Name', 'In Stock', 'Unit Price', 'Valuation', 'Alert Status'],
            ['PX-101', 'Wireless Mouse', '24', '650', '=C2*D2', '=IF(C2<10,"REORDER","OK")'],
            ['PX-102', 'USB-C Hub', '6', '1299', '=C3*D3', '=IF(C3<10,"REORDER","OK")'],
            ['PX-103', 'Mechanical Keyboard', '14', '2800', '=C4*D4', '=IF(C4<10,"REORDER","OK")'],
            ['PX-104', 'Laptop Stand', '4', '950', '=C5*D5', '=IF(C5<10,"REORDER","OK")'],
            ['Totals', '', '=SUM(C2:C5)', '', '=SUM(E2:E5)', ''],
          ],
          '#EFF6FF',
          '#1E3A8A'
        ),
      ],
    }),
  },
];

