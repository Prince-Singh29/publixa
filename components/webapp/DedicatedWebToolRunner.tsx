'use client';

import React from 'react';
import { WebToolComponentKey } from '@/lib/seoToolsData';
import DocToolsSuite from './DocToolsSuite';
import ExcelToolsSuite from './ExcelToolsSuite';
import PptToolsSuite from './PptToolsSuite';
import StylishNameStudio from './StylishNameStudio';
import VpnPrivacySuite from './VpnPrivacySuite';
import { PassportPhotoTool, WallpaperStudioTool, StatusMediaStudioTool } from './MediaWallpaperTools';
import {
  QrStudioTool,
  VoiceCalculatorTool,
  BirthdayReminderTool,
  ExpenseChecklistTool,
  GroceryChecklistTool,
  AllInOneToolbox,
} from './UtilityPlannerTools';
import { WordConnectGame, LiquidColorSortGame, MusicStudioGame } from './CasualGamesSuite';

export default function DedicatedWebToolRunner({
  componentKey,
  title,
}: {
  componentKey: WebToolComponentKey;
  title: string;
}) {
  switch (componentKey) {
    case 'docx':
      return <DocToolsSuite mode="docx" appName={title} />;
    case 'doc2pdf':
      return <DocToolsSuite mode="doc2pdf" appName={title} />;
    case 'excel':
      return <ExcelToolsSuite defaultMode="reader" appName={title} />;
    case 'excel2pdf':
      return <ExcelToolsSuite defaultMode="pdf" appName={title} />;
    case 'ppt_create':
      return <PptToolsSuite defaultTab="create" appName={title} />;
    case 'ppt_reader':
      return <PptToolsSuite defaultTab="reader" appName={title} />;
    case 'ppt_charts':
      return <PptToolsSuite defaultTab="charts" appName={title} />;
    case 'ppt_outline':
      return <PptToolsSuite defaultTab="outline" appName={title} />;
    case 'ppt_templates':
      return <PptToolsSuite defaultTab="templates" appName={title} />;
    case 'stylish':
      return <StylishNameStudio mode="gaming" appName={title} />;
    case 'qr':
      return <QrStudioTool />;
    case 'passport':
      return <PassportPhotoTool />;
    case 'wallpaper':
      return <WallpaperStudioTool />;
    case 'status_media':
      return <StatusMediaStudioTool />;
    case 'voice_calc':
      return <VoiceCalculatorTool />;
    case 'birthday':
      return <BirthdayReminderTool />;
    case 'expense':
      return <ExpenseChecklistTool />;
    case 'grocery':
      return <GroceryChecklistTool />;
    case 'unit':
      return <AllInOneToolbox defaultTab="unit" standalone={true} />;
    case 'password':
      return <AllInOneToolbox defaultTab="password" standalone={true} />;
    case 'color':
      return <AllInOneToolbox defaultTab="color" standalone={true} />;
    case 'json':
      return <AllInOneToolbox defaultTab="json" standalone={true} />;
    case 'base64':
      return <AllInOneToolbox defaultTab="base64" standalone={true} />;
    case 'timer':
      return <AllInOneToolbox defaultTab="timer" standalone={true} />;
    case 'bmi':
      return <AllInOneToolbox defaultTab="bmi" standalone={true} />;
    case 'vpn_inspector':
      return <VpnPrivacySuite defaultTab="inspector" appName={title} standalone={true} />;
    case 'vpn_wireguard':
      return <VpnPrivacySuite defaultTab="wireguard" appName={title} standalone={true} />;
    case 'vpn_dns':
      return <VpnPrivacySuite defaultTab="dns" appName={title} standalone={true} />;
    case 'vpn_tracker':
      return <VpnPrivacySuite defaultTab="tracker" appName={title} standalone={true} />;
    case 'game_word':
      return <WordConnectGame />;
    case 'game_sort':
      return <LiquidColorSortGame />;
    case 'game_music':
      return <MusicStudioGame />;
    default:
      return <AllInOneToolbox defaultTab="stylish" standalone={true} />;
  }
}

