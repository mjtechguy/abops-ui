// Mock data for clusters
export const clusters = [
  {
    id: "cluster-1",
    name: "prod-us-west",
    status: "healthy",
    provider: "aws",
    type: "rke2",
    nodes: 5,
    cpu: 75,
    memory: 68,
    storage: 42,
    region: "us-west-2"
  },
  {
    id: "cluster-2",
    name: "prod-us-east",
    status: "healthy",
    provider: "aws",
    type: "rke2",
    nodes: 5,
    cpu: 62,
    memory: 70,
    storage: 38,
    region: "us-east-1"
  },
  {
    id: "cluster-3",
    name: "staging-eu",
    status: "warning",
    provider: "gcp",
    type: "k3s",
    nodes: 3,
    cpu: 85,
    memory: 78,
    storage: 55,
    region: "europe-west1"
  },
  {
    id: "cluster-4",
    name: "dev-local",
    status: "healthy",
    provider: "harvester",
    type: "k3s",
    nodes: 2,
    cpu: 45,
    memory: 50,
    storage: 30,
    region: "local"
  },
  {
    id: "cluster-5",
    name: "data-processing",
    status: "unhealthy",
    provider: "gcp",
    type: "vanilla",
    nodes: 4,
    cpu: 92,
    memory: 95,
    storage: 88,
    region: "us-central1"
  },
  {
    id: "cluster-6",
    name: "prod-eu-central",
    status: "healthy",
    provider: "aws",
    type: "rke2",
    nodes: 6,
    cpu: 70,
    memory: 65,
    storage: 50,
    region: "eu-central-1"
  },
  {
    id: "cluster-7",
    name: "prod-ap-south",
    status: "healthy",
    provider: "aws",
    type: "rke2",
    nodes: 4,
    cpu: 65,
    memory: 60,
    storage: 45,
    region: "ap-south-1"
  },
  {
    id: "cluster-8",
    name: "staging-us",
    status: "healthy",
    provider: "gcp",
    type: "k3s",
    nodes: 3,
    cpu: 55,
    memory: 50,
    storage: 40,
    region: "us-west1"
  },
  {
    id: "cluster-9",
    name: "dev-eu",
    status: "healthy",
    provider: "harvester",
    type: "k3s",
    nodes: 2,
    cpu: 40,
    memory: 45,
    storage: 35,
    region: "eu-west1"
  },
  {
    id: "cluster-10",
    name: "ml-training",
    status: "warning",
    provider: "gcp",
    type: "vanilla",
    nodes: 8,
    cpu: 88,
    memory: 92,
    storage: 75,
    region: "us-east4"
  },
  {
    id: "cluster-11",
    name: "prod-ap-east",
    status: "healthy",
    provider: "aws",
    type: "rke2",
    nodes: 5,
    cpu: 72,
    memory: 68,
    storage: 52,
    region: "ap-east-1"
  },
  {
    id: "cluster-12",
    name: "backup-central",
    status: "healthy",
    provider: "harvester",
    type: "rke2",
    nodes: 3,
    cpu: 35,
    memory: 40,
    storage: 60,
    region: "local"
  }
];

// Mock data for the dashboard
export const clusterStats = {
  total: clusters.length,
  healthy: clusters.filter(c => c.status === 'healthy').length,
  warning: clusters.filter(c => c.status === 'warning').length,
  unhealthy: clusters.filter(c => c.status === 'unhealthy').length,
  resourceUsage: {
    cpu: 68,
    memory: 72,
    storage: 45
  }
};
