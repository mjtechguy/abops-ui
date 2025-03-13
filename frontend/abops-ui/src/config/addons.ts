// Define types for add-ons
export type AddonType = 
  | 'ingress-nginx'
  | 'traefik'
  | 'cert-manager'
  | 'monitoring'
  | 'logging'
  | 'istio'
  | 'neuvector'
  | 'harbor'
  | 'minio';

export interface Addon {
  id: AddonType;
  name: string;
  description: string;
  logoPath: string;
  category: 'ingress' | 'security' | 'monitoring' | 'storage' | 'service-mesh';
  defaultEnabled: boolean;
  version: string;
  versions: string[];
  defaultValuesUrl?: string;
}

// Get environment variables for logo paths
const getLogoPath = (addon: string): string => {
  const envVar = `NEXT_PUBLIC_LOGO_${addon.replace(/-/g, '_').toUpperCase()}`;
  return process.env[envVar] || `/abops/addons/${addon}.svg`;
};

// Define available add-ons
export const addons: Addon[] = [
  {
    id: 'ingress-nginx',
    name: 'NGINX Ingress Controller',
    description: 'An Ingress controller for Kubernetes using NGINX as a reverse proxy and load balancer',
    logoPath: getLogoPath('ingress-nginx'),
    category: 'ingress',
    defaultEnabled: false,
    version: '4.7.1',
    versions: ['4.7.1', '4.6.1', '4.5.2', '4.4.0']
  },
  {
    id: 'traefik',
    name: 'Traefik',
    description: 'A modern HTTP reverse proxy and load balancer for microservices',
    logoPath: getLogoPath('traefik'),
    category: 'ingress',
    defaultEnabled: false,
    version: '23.1.0',
    versions: ['23.1.0', '22.1.0', '21.1.0', '20.8.0']
  },
  {
    id: 'cert-manager',
    name: 'cert-manager',
    description: 'Automated certificate management for Kubernetes',
    logoPath: getLogoPath('cert-manager'),
    category: 'security',
    defaultEnabled: false,
    version: '1.12.3',
    versions: ['1.12.3', '1.11.4', '1.10.2', '1.9.1']
  },
  {
    id: 'monitoring',
    name: 'Prometheus & Grafana',
    description: 'Monitoring and visualization for Kubernetes clusters',
    logoPath: getLogoPath('monitoring'),
    category: 'monitoring',
    defaultEnabled: false,
    version: '45.27.2',
    versions: ['45.27.2', '44.3.1', '43.2.1', '42.0.3']
  },
  {
    id: 'logging',
    name: 'ELK Stack',
    description: 'Elasticsearch, Logstash, and Kibana for log collection and analysis',
    logoPath: getLogoPath('logging'),
    category: 'monitoring',
    defaultEnabled: false,
    version: '8.8.2',
    versions: ['8.8.2', '8.7.1', '8.6.2', '8.5.1']
  },
  {
    id: 'istio',
    name: 'Istio',
    description: 'Service mesh for connecting, securing, and observing microservices',
    logoPath: getLogoPath('istio'),
    category: 'service-mesh',
    defaultEnabled: false,
    version: '1.18.2',
    versions: ['1.18.2', '1.17.5', '1.16.7', '1.15.7']
  },
  {
    id: 'neuvector',
    name: 'NeuVector',
    description: 'Container security platform providing real-time protection',
    logoPath: getLogoPath('neuvector'),
    category: 'security',
    defaultEnabled: false,
    version: '2.6.3',
    versions: ['2.6.3', '2.5.0', '2.4.2', '2.3.0']
  },
  {
    id: 'harbor',
    name: 'Harbor',
    description: 'Cloud native registry for storing, signing, and scanning container images',
    logoPath: getLogoPath('harbor'),
    category: 'storage',
    defaultEnabled: false,
    version: '1.12.2',
    versions: ['1.12.2', '1.11.1', '1.10.3', '1.9.4']
  },
  {
    id: 'minio',
    name: 'MinIO',
    description: 'High-performance object storage compatible with Amazon S3 API',
    logoPath: getLogoPath('minio'),
    category: 'storage',
    defaultEnabled: false,
    version: '12.6.9',
    versions: ['12.6.9', '12.5.8', '12.4.5', '12.3.7']
  }
];

// Helper functions
export const getAddonById = (id: AddonType): Addon | undefined => {
  return addons.find(addon => addon.id === id);
};

export const getAddonsByCategory = (category: string): Addon[] => {
  return addons.filter(addon => addon.category === category);
};

export const getAddonCategories = (): string[] => {
  return Array.from(new Set(addons.map(addon => addon.category)));
};
