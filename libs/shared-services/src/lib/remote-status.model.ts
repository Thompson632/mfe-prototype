export interface RemoteStatus {
  name: string;
  routePath: string;
  healthUrl: string;
  status: 'healthy' | 'unavailable';
  metadata?: any;
}
