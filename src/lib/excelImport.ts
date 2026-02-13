import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';

// Vite will give us a URL to the static asset
import priceListUrl from '@/assets/Price-List-Jadugar-app.xlsx?url';

interface RawRow {
  [key: string]: unknown;
}

function getField(row: RawRow, keys: string[]): string {
  for (const key of keys) {
    const v = row[key];
    if (typeof v === 'string' && v.trim()) return v.trim();
    if (typeof v === 'number') return String(v);
  }
  return '';
}

function getNumber(row: RawRow, keys: string[]): number {
  const s = getField(row, keys);
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

// For object-shaped rows (JSON files)
function rowsToProducts(rows: RawRow[]) {
  let lastBrand = '';
  let lastCategory = '';
  let lastUnit = '';

  return rows
    .map((row) => {
      const name = getField(row, ['Name', 'name']);
      let brand = getField(row, ['Brand', 'brand']);
      let category = getField(row, ['Category', 'category']);
      let unit = getField(row, ['Unit', 'unit']);
      const price = getNumber(row, ['Price', 'price']);

      // Forward-fill brand, category, unit from previous non-empty rows
      if (!brand && lastBrand) brand = lastBrand;
      if (!category && lastCategory) category = lastCategory;
      if (!unit && lastUnit) unit = lastUnit;

      if (!name || !brand || !category || !unit || !price) {
        return null;
      }

      lastBrand = brand;
      lastCategory = category;
      lastUnit = unit;

      return {
        name,
        brand,
        category,
        unit,
        price,
        image: null,
        description: null,
      };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);
}

// For matrix/array-shaped rows (Excel/CSV with fixed 5 columns)
function rowsToProductsFromMatrix(matrix: unknown[][]) {
  let lastBrand = '';
  let lastCategory = '';
  let lastUnit = '';

  return matrix
    .map((row, index) => {
      // Assume first row is header: skip it
      if (index === 0) return null;
      const [nameRaw, brandRaw, categoryRaw, priceRaw, unitRaw] = row;

      const name = String(nameRaw ?? '').trim();
      let brand = String(brandRaw ?? '').trim();
      let category = String(categoryRaw ?? '').trim();
      let unit = String(unitRaw ?? '').trim();
      const price = Number(priceRaw ?? NaN);

      // Forward-fill brand, category, unit if missing
      if (!brand && lastBrand) brand = lastBrand;
      if (!category && lastCategory) category = lastCategory;
      if (!unit && lastUnit) unit = lastUnit;

      if (!name || !brand || !category || !unit || !Number.isFinite(price) || price <= 0) {
        return null;
      }

      lastBrand = brand;
      lastCategory = category;
      lastUnit = unit;

      return {
        name,
        brand,
        category,
        unit,
        price,
        image: null,
        description: null,
      };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);
}

export async function importProductsFromExcel(): Promise<number> {
  const res = await fetch(priceListUrl);
  if (!res.ok) {
    throw new Error('Failed to load price list file');
  }
  const buf = await res.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array' });
  const sheetName = wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  const matrix = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: '',
  });
  const productsToInsert = rowsToProductsFromMatrix(matrix as unknown[][]);

  if (!productsToInsert.length) {
    throw new Error('No valid product rows found in Excel file');
  }

  const { error } = await supabase.from('products').insert(productsToInsert);
  if (error) throw error;

  return productsToInsert.length;
}

export async function importProductsFromFile(file: File): Promise<number> {
  const name = file.name.toLowerCase();
  const isJson = name.endsWith('.json');
  const isCsv = name.endsWith('.csv');

  if (isJson) {
    const text = await file.text();
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error('Invalid JSON file');
    }
    const rows: RawRow[] = Array.isArray(parsed) ? (parsed as RawRow[]) : [];
    const productsToInsert = rowsToProducts(rows);
    if (!productsToInsert.length) {
      throw new Error('No valid product rows found in JSON file');
    }
    const { error } = await supabase.from('products').insert(productsToInsert);
    if (error) throw error;
    return productsToInsert.length;
  }

  if (isCsv) {
    const text = await file.text();
    const wb = XLSX.read(text, { type: 'string' });
    const sheetName = wb.SheetNames[0];
    const sheet = wb.Sheets[sheetName];
    const matrix = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
      header: 1,
      defval: '',
    });
    const productsToInsert = rowsToProductsFromMatrix(matrix as unknown[][]);
    if (!productsToInsert.length) {
      throw new Error('No valid product rows found in CSV file');
    }
    const { error } = await supabase.from('products').insert(productsToInsert);
    if (error) throw error;
    return productsToInsert.length;
  }

  // Default: treat as Excel workbook
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array' });
  const sheetName = wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  const matrix = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: '',
  });
  const productsToInsert = rowsToProductsFromMatrix(matrix as unknown[][]);
  if (!productsToInsert.length) {
    throw new Error('No valid product rows found in file');
  }
  const { error } = await supabase.from('products').insert(productsToInsert);
  if (error) throw error;
  return productsToInsert.length;
}

