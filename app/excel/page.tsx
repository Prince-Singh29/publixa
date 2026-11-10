import React from 'react';
import type { Metadata } from 'next';
import ExcelToolsSuite from '@/components/webapp/ExcelToolsSuite';
import SuiteSeoSection from '@/components/webapp/SuiteSeoSection';

export const metadata: Metadata = {
  title: 'Publixa Sheets — Full Online Excel & Spreadsheet App (No Account Required)',
  description:
    'Create, edit, format, calculate formulas, visualize charts, and export Excel (.xlsx), CSV, JSON, and PDF spreadsheets directly in your browser with zero account required.',
  keywords: ['online excel spreadsheet free no login', 'google sheets alternative offline', 'xlsx to pdf converter', 'csv editor online'],
};

export default function ExcelFullAppPage() {
  return (
    <div className="w-full bg-[#F8FAFD] min-h-[calc(100vh-80px)] p-2 sm:p-4">
      <div className="w-full max-w-[1920px] mx-auto">
        <ExcelToolsSuite defaultMode="reader" appName="Publixa Sheets" />
      </div>
      <SuiteSeoSection focus="excel" />
    </div>
  );
}

