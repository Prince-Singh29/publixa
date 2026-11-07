export interface AppPermission {
  name: string;
  purpose: string;
}

export interface ThirdPartyService {
  name: string;
  category: string;
  privacyPolicyUrl: string;
  purpose: string;
}

export interface PublixaApp {
  id: string;
  slug: string;
  name: string;
  packageName: string;
  developerBrand?: string;
  legalOwner?: string;
  shortDescription: string;
  longDescription?: string;
  tagline?: string;
  rating?: number;
  downloads?: string;
  category: string;
  icon: string; // Relative image path or emoji
  screenshots?: string[]; // Relative image paths
  features?: string[];
  playStoreUrl?: string;
  status?: string;
  lastUpdated?: string;
  supportEmail?: string;
  permissions: Array<{ name: string; purpose: string } | string>;
  thirdPartyServices?: ThirdPartyService[];
  thirdPartySDKs?: string[];
  dataCollected?: {
    deviceUsage: string[];
    userProvided: string[];
  };
}

export interface DeletionRequest {
  id: string;
  name: string;
  email: string;
  appName: string;
  packageName: string;
  requestType: 'Data Deletion' | 'Account Deletion' | 'Complete Wipe';
  details: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Rejected';
  createdAt: string;
}

export interface SupportMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  appName?: string;
  message: string;
  status: 'New' | 'In Review' | 'Resolved';
  createdAt: string;
}

export interface StoreData {
  apps: PublixaApp[];
  deletionRequests: DeletionRequest[];
  supportMessages: SupportMessage[];
}
