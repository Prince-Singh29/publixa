import React from 'react';
import type { Metadata } from 'next';
import DocToolsSuite from '@/components/webapp/DocToolsSuite';
import SuiteSeoSection from '@/components/webapp/SuiteSeoSection';

export const metadata: Metadata = {
  title: 'Publixa Docs — Full Online Document & Word Editor (No Account Required)',
  description:
    'Create, format, edit, and export Word (.docx), PDF, HTML, and TXT documents with headings, lists, colors, images, and tables — directly in your browser without an account.',
  keywords: ['online document editor no login', 'google docs alternative free', 'word to pdf offline', 'docx editor in browser'],
};

export default function DocsFullAppPage() {
  return (
    <div className="w-full bg-[#F8FAFD] min-h-[calc(100vh-80px)] p-2 sm:p-4">
      <div className="w-full max-w-[1920px] mx-auto">
        <DocToolsSuite mode="docx" appName="Publixa Docs" />
      </div>
      <SuiteSeoSection focus="docs" />
    </div>
  );
}

