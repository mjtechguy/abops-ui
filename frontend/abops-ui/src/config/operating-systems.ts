// Define types for operating systems
export type OSType = 
  | 'sles'        // SUSE Linux Enterprise Server
  | 'sle-micro'   // SLE Micro
  | 'opensuse'    // OpenSUSE Tumbleweed
  | 'opensuse-micro' // OpenSUSE Micro
  | 'rhel'        // Red Hat Enterprise Linux
  | 'ubuntu'      // Ubuntu
  | 'rocky'       // Rocky Linux
  | 'alma'        // AlmaLinux
  | 'debian'      // Debian
  | 'amazon-linux'; // Amazon Linux (AWS only)

export interface OSVersion {
  id: string;
  name: string;
  isDefault?: boolean;
}

export interface OperatingSystem {
  id: OSType;
  name: string;
  description: string;
  logoPath: string;
  versions: OSVersion[];
  supportedProviders: string[]; // List of provider IDs that support this OS
}

// Helper function to get logo path
const getLogoPath = (osId: string): string => {
  // Direct mapping for known OS types with absolute paths
  const logoMap: Record<string, string> = {
    'sles': '/abops/os/sles.svg',
    'sle-micro': '/abops/os/sle-micro.svg',
    'opensuse': '/abops/os/opensuse.svg',
    'opensuse-micro': '/abops/os/opensuse-micro.svg',
    'rhel': '/abops/os/rhel.svg',
    'ubuntu': '/abops/os/ubuntu.svg',
    'rocky': '/abops/os/rocky.svg',
    'alma': '/abops/os/alma.svg',
    'debian': '/abops/os/debian.svg',
    'amazon-linux': '/abops/os/amazon-linux.svg',
  };
  
  // Use the environment variable if available, otherwise use the direct path
  const envVar = `NEXT_PUBLIC_LOGO_${osId.toUpperCase().replace(/-/g, '_')}`;
  const logoPath = process.env[envVar] || logoMap[osId] || '/abops/os/default.svg';
  
  // Ensure the path starts with a slash
  return logoPath.startsWith('/') ? logoPath : `/${logoPath}`;
};

// Base directory for OS logos
const osLogosDir = '/abops/os';

// Define operating systems
export const operatingSystems: OperatingSystem[] = [
  {
    id: 'sles',
    name: 'SUSE Linux Enterprise Server',
    description: 'Enterprise-grade Linux distribution with long-term support',
    logoPath: `${osLogosDir}/suse-96.png`,
    versions: [
      { id: '15-sp5', name: '15 SP5', isDefault: true },
      { id: '15-sp4', name: '15 SP4' },
      { id: '15-sp3', name: '15 SP3' },
      { id: '12-sp5', name: '12 SP5' }
    ],
    supportedProviders: ['aws', 'azure', 'gcp', 'digitalocean', 'oracle', 'hetzner', 'harvester', 'vmware', 'proxmox']
  },
  {
    id: 'sle-micro',
    name: 'SLE Micro',
    description: 'Container and virtualization host designed for edge computing',
    logoPath: `${osLogosDir}/suse-96.png`,
    versions: [
      { id: '5.5', name: '5.5', isDefault: true },
      { id: '5.4', name: '5.4' },
      { id: '5.3', name: '5.3' }
    ],
    supportedProviders: ['aws', 'azure', 'gcp', 'harvester', 'vmware', 'proxmox']
  },
  {
    id: 'opensuse',
    name: 'OpenSUSE Tumbleweed',
    description: 'Rolling-release Linux distribution with the latest packages',
    logoPath: `${osLogosDir}/suse-96.png`,
    versions: [
      { id: 'latest', name: 'Latest', isDefault: true }
    ],
    supportedProviders: ['aws', 'azure', 'gcp', 'digitalocean', 'oracle', 'hetzner', 'harvester', 'vmware', 'proxmox']
  },
  {
    id: 'opensuse-micro',
    name: 'OpenSUSE Micro',
    description: 'Lightweight container host based on openSUSE',
    logoPath: `${osLogosDir}/suse-96.png`,
    versions: [
      { id: 'latest', name: 'Latest', isDefault: true }
    ],
    supportedProviders: ['aws', 'azure', 'gcp', 'harvester', 'vmware', 'proxmox']
  },
  {
    id: 'rhel',
    name: 'Red Hat Enterprise Linux',
    description: 'Enterprise-grade Linux distribution from Red Hat',
    logoPath: `${osLogosDir}/rhel.png`,
    versions: [
      { id: '9.3', name: '9.3', isDefault: true },
      { id: '9.2', name: '9.2' },
      { id: '9.1', name: '9.1' },
      { id: '8.9', name: '8.9' },
      { id: '8.8', name: '8.8' }
    ],
    supportedProviders: ['aws', 'azure', 'gcp', 'oracle', 'harvester', 'vmware', 'proxmox']
  },
  {
    id: 'ubuntu',
    name: 'Ubuntu',
    description: 'Popular Linux distribution from Canonical',
    logoPath: `${osLogosDir}/ubuntu.png`,
    versions: [
      { id: '24.04', name: '24.04 LTS', isDefault: true },
      { id: '22.04', name: '22.04 LTS' },
      { id: '20.04', name: '20.04 LTS' }
    ],
    supportedProviders: ['aws', 'azure', 'gcp', 'digitalocean', 'oracle', 'hetzner', 'harvester', 'vmware', 'proxmox']
  },
  {
    id: 'rocky',
    name: 'Rocky Linux',
    description: 'Community enterprise operating system designed to be 100% compatible with RHEL',
    logoPath: `${osLogosDir}/rocky.png`,
    versions: [
      { id: '9.3', name: '9.3', isDefault: true },
      { id: '9.2', name: '9.2' },
      { id: '8.9', name: '8.9' },
      { id: '8.8', name: '8.8' }
    ],
    supportedProviders: ['aws', 'azure', 'gcp', 'digitalocean', 'oracle', 'hetzner', 'harvester', 'vmware', 'proxmox']
  },
  {
    id: 'alma',
    name: 'AlmaLinux',
    description: 'Open source, community-owned and governed RHEL fork',
    logoPath: `${osLogosDir}/alma.png`,
    versions: [
      { id: '9.3', name: '9.3', isDefault: true },
      { id: '9.2', name: '9.2' },
      { id: '8.9', name: '8.9' },
      { id: '8.8', name: '8.8' }
    ],
    supportedProviders: ['aws', 'azure', 'gcp', 'digitalocean', 'oracle', 'hetzner', 'harvester', 'vmware', 'proxmox']
  },
  {
    id: 'debian',
    name: 'Debian',
    description: 'Stable and secure Linux distribution',
    logoPath: `${osLogosDir}/debian.png`,
    versions: [
      { id: '12', name: '12 (Bookworm)', isDefault: true },
      { id: '11', name: '11 (Bullseye)' },
      { id: '10', name: '10 (Buster)' }
    ],
    supportedProviders: ['aws', 'azure', 'gcp', 'digitalocean', 'oracle', 'hetzner', 'harvester', 'vmware', 'proxmox']
  },
  {
    id: 'amazon-linux',
    name: 'Amazon Linux',
    description: 'Linux distribution provided by AWS for use on Amazon EC2',
    logoPath: `${osLogosDir}/aws-96.png`,
    versions: [
      { id: '2023', name: 'Amazon Linux 2023', isDefault: true },
      { id: '2', name: 'Amazon Linux 2' }
    ],
    supportedProviders: ['aws'] // Only supported on AWS
  }
];

// Helper functions
export const getOperatingSystemsForProvider = (providerId: string): OperatingSystem[] => {
  return operatingSystems.filter(os => os.supportedProviders.includes(providerId));
};

export const getDefaultOperatingSystemForProvider = (providerId: string): OperatingSystem | undefined => {
  // SLES is the default for most providers, but Amazon Linux for AWS
  if (providerId === 'aws') {
    return operatingSystems.find(os => os.id === 'amazon-linux');
  }
  return operatingSystems.find(os => os.id === 'sles');
};

export const getOSVersions = (osId: OSType): OSVersion[] => {
  const os = operatingSystems.find(os => os.id === osId);
  return os ? os.versions : [];
};

export const getDefaultOSVersion = (osId: OSType): string => {
  const os = operatingSystems.find(os => os.id === osId);
  if (!os) return '';
  
  const defaultVersion = os.versions.find(v => v.isDefault);
  return defaultVersion ? defaultVersion.id : os.versions[0]?.id || '';
};
