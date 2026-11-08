import fs from 'fs';
import path from 'path';
import { StoreData, PublixaApp, DeletionRequest, SupportMessage } from './types';

const dataFilePath = path.join(process.cwd(), 'data', 'store.json');

export function getStoreData(): StoreData {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return { apps: [], deletionRequests: [], supportMessages: [] };
    }
    const content = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(content) as StoreData;
  } catch (error) {
    console.error('Error reading store data:', error);
    return { apps: [], deletionRequests: [], supportMessages: [] };
  }
}

export function saveStoreData(data: StoreData): void {
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing store data:', error);
  }
}

// App helpers
export function getAllApps(): PublixaApp[] {
  return [...getStoreData().apps].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
}

export function getAppBySlug(slug: string): PublixaApp | undefined {
  const apps = getAllApps();
  return apps.find((app) => app.slug.toLowerCase() === slug.toLowerCase() || app.id.toLowerCase() === slug.toLowerCase());
}

export function saveApp(appData: Partial<PublixaApp> & { name: string; packageName: string }): PublixaApp {
  const data = getStoreData();
  const slug = appData.slug || appData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const existingIndex = data.apps.findIndex((a) => a.id === appData.id || a.slug === slug || a.packageName === appData.packageName);

  const newApp: PublixaApp = {
    id: appData.id || `app-${Date.now()}`,
    slug: slug,
    name: appData.name,
    packageName: appData.packageName,
    developerBrand: 'Publixa',
    legalOwner: 'Prince Kumar Singh',
    shortDescription: appData.shortDescription || 'Mobile application developed by Publixa.',
    longDescription: appData.longDescription || appData.shortDescription || 'Application operated by Publixa.',
    category: appData.category || 'General',
    icon: appData.icon || '📱',
    playStoreUrl: appData.playStoreUrl || `https://play.google.com/store/apps/details?id=${appData.packageName}`,
    status: appData.status || 'Active',
    lastUpdated: appData.lastUpdated || 'September 2026',
    supportEmail: appData.supportEmail || 'publixaorignal@gmail.com',
    permissions: appData.permissions || [
      { name: 'Internet (INTERNET)', purpose: 'Connect to application backend and essential services.' }
    ],
    thirdPartyServices: appData.thirdPartyServices || [
      { name: 'Google Play Services', category: 'Platform Services', privacyPolicyUrl: 'https://policies.google.com/privacy', purpose: 'Standard licensing and platform APIs.' }
    ],
    dataCollected: appData.dataCollected || {
      deviceUsage: ['IP address (coarse region)', 'Device model and OS version', 'App crash diagnostics'],
      userProvided: ['Customer support inquiries and feedback']
    }
  };

  if (existingIndex >= 0) {
    data.apps[existingIndex] = { ...data.apps[existingIndex], ...newApp };
  } else {
    data.apps.unshift(newApp);
  }

  saveStoreData(data);
  return existingIndex >= 0 ? data.apps[existingIndex] : newApp;
}

export function deleteApp(id: string): boolean {
  const data = getStoreData();
  const initialLength = data.apps.length;
  data.apps = data.apps.filter((a) => a.id !== id && a.slug !== id);
  if (data.apps.length !== initialLength) {
    saveStoreData(data);
    return true;
  }
  return false;
}

// Deletion Request helpers
export function addDeletionRequest(req: Omit<DeletionRequest, 'id' | 'status' | 'createdAt'>): DeletionRequest {
  const data = getStoreData();
  const newReq: DeletionRequest = {
    id: `DEL-${Math.floor(100000 + Math.random() * 900000)}`,
    name: req.name,
    email: req.email,
    appName: req.appName,
    packageName: req.packageName,
    requestType: req.requestType,
    details: req.details || 'No additional details provided.',
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  data.deletionRequests.unshift(newReq);
  saveStoreData(data);
  return newReq;
}

export function updateDeletionRequestStatus(id: string, status: DeletionRequest['status']): boolean {
  const data = getStoreData();
  const req = data.deletionRequests.find((r) => r.id === id);
  if (req) {
    req.status = status;
    saveStoreData(data);
    return true;
  }
  return false;
}

// Support Message helpers
export function addSupportMessage(msg: Omit<SupportMessage, 'id' | 'status' | 'createdAt'>): SupportMessage {
  const data = getStoreData();
  const newMsg: SupportMessage = {
    id: `SUP-${Math.floor(1000 + Math.random() * 9000)}`,
    name: msg.name,
    email: msg.email,
    subject: msg.subject,
    appName: msg.appName || 'General / Organization',
    message: msg.message,
    status: 'New',
    createdAt: new Date().toISOString()
  };
  data.supportMessages.unshift(newMsg);
  saveStoreData(data);
  return newMsg;
}

export function updateSupportMessageStatus(id: string, status: SupportMessage['status']): boolean {
  const data = getStoreData();
  const msg = data.supportMessages.find((m) => m.id === id);
  if (msg) {
    msg.status = status;
    saveStoreData(data);
    return true;
  }
  return false;
}
