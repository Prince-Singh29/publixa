import React from 'react';
import type { Metadata } from 'next';
import PptToolsSuite from '@/components/webapp/PptToolsSuite';
import SuiteSeoSection from '@/components/webapp/SuiteSeoSection';

export const metadata: Metadata = {
  title: 'Publixa Slides — Full Online PowerPoint & Presentation Studio (No Account Required)',
  description:
    'Design slide decks, build bar charts, open .pptx files, run fullscreen presentations, and export .pptx or widescreen .pdf directly in your browser without an account.',
  keywords: ['online powerpoint maker free no login', 'google slides alternative offline', 'pptx to pdf converter', 'presentation builder online'],
};

export default function SlidesFullAppPage() {
  return (
    <div className="w-full bg-[#F8FAFD] min-h-[calc(100vh-80px)] p-2 sm:p-4">
      <div className="w-full max-w-[1920px] mx-auto">
        <PptToolsSuite defaultTab="create" appName="Publixa Slides" />
      </div>
      <SuiteSeoSection focus="slides" />
    </div>
  );
}

