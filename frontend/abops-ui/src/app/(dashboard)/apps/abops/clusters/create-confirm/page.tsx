'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowLeft, Check, Save, Server } from 'lucide-react';
import { 
  getCredentialById,
  CredentialType 
} from '@/config/credentials';
import { 
  getRancherServerById, 
  getCredentialsForServer, 
  RancherServer, 
  RancherCredential 
} from '@/config/rancher-servers';
// Region types
type RegionType = string;
import { OSType } from '@/config/operating-systems';
// Kubernetes types
type KubernetesDistribution = 'k3s' | 'rke' | 'rke2';
// Storage types
type StorageEngineType = 'longhorn' | 'ceph' | 'nfs' | 'CloudProvider';
// Addon types
type AddonType = string;

interface AddonConfig {
  id: AddonType;
  enabled: boolean;
  version: string;
  valuesFile: File | null;
}

// Import Supabase client
import { supabase } from '@/lib/supabase/client';

export default function CreateClusterConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [saveError, setSaveError] = useState('');
  
  // Extract URL parameters once to avoid re-parsing on every render
  const name = searchParams.get('name') || '';
  const provider = searchParams.get('provider') || '';
  const credential = searchParams.get('credential') || '';
  const region = searchParams.get('region') || '';
  const os = searchParams.get('os') || '';
  const osVersion = searchParams.get('osVersion') || '';
  const k8sDistribution = searchParams.get('k8sDistribution') || '';
  const k8sVersion = searchParams.get('k8sVersion') || '';
  const storageEngine = searchParams.get('storageEngine') || '';
  const storageVersion = searchParams.get('storageVersion') || '';
  const rancherServer = searchParams.get('rancherServer') || '';
  const rancherCredential = searchParams.get('rancherCredential') || '';
  
  // Parse complex objects once
  const [nodePools] = useState(() => {
    try {
      const poolsStr = searchParams.get('nodePools');
      return poolsStr ? JSON.parse(poolsStr) : [];
    } catch (e) {
      console.error('Error parsing nodePools:', e);
      return [];
    }
  });
  
  const [addons] = useState(() => {
    try {
      const addonsStr = searchParams.get('addons');
      return addonsStr ? JSON.parse(addonsStr) : [];
    } catch (e) {
      console.error('Error parsing addons:', e);
      return [];
    }
  });
  
  const [securityOptions] = useState(() => {
    try {
      const securityStr = searchParams.get('securityOptions');
      return securityStr ? JSON.parse(securityStr) : [];
    } catch (e) {
      console.error('Error parsing securityOptions:', e);
      return [];
    }
  });
  
  // Create a stable reference to the cluster config
  const clusterConfig = {
    name,
    provider,
    credential,
    region,
    os,
    osVersion,
    k8sDistribution,
    k8sVersion,
    storageEngine,
    storageVersion,
    rancherServer,
    rancherCredential,
    nodePools,
    addons,
    securityOptions,
  };

  // State for resolved entities
  const [providerDetails, setProviderDetails] = useState<any>(null);
  const [credentialDetails, setCredentialDetails] = useState<any>(null);
  const [regionDetails, setRegionDetails] = useState<any>(null);
  const [osDetails, setOsDetails] = useState<any>(null);
  const [k8sDistributionDetails, setK8sDistributionDetails] = useState<any>(null);
  const [k8sVersionDetails, setK8sVersionDetails] = useState<any>(null);
  const [storageEngineDetails, setStorageEngineDetails] = useState<any>(null);
  const [rancherServerDetails, setRancherServerDetails] = useState<RancherServer | null>(null);
  const [rancherCredentialDetails, setRancherCredentialDetails] = useState<RancherCredential | null>(null);
  const [addonDetails, setAddonDetails] = useState<any[]>([]);
  
  // Define logo base directory
  const logoBaseDir = process.env.NEXT_PUBLIC_PROVIDER_LOGOS_DIR || "/abops/providers";

  // Mock functions to replace the missing imports
  const getProviderById = (id: string) => {
    // Return mock provider details based on ID
    const providers: Record<string, any> = {
      'aws': { name: 'Amazon Web Services', id: 'aws' },
      'azure': { name: 'Microsoft Azure', id: 'azure' },
      'gcp': { name: 'Google Cloud Platform', id: 'gcp' },
      'digitalocean': { name: 'DigitalOcean', id: 'digitalocean' },
      'linode': { name: 'Linode', id: 'linode' },
      'harvester': { name: 'Harvester', id: 'harvester' },
      'vmware': { name: 'VMware', id: 'vmware' },
      'proxmox': { name: 'Proxmox', id: 'proxmox' },
    };
    return providers[id] || { name: id, id };
  };

  const getRegionById = (providerId: string, regionId: string) => {
    // Return mock region details
    return { name: regionId, id: regionId };
  };

  const getOSById = (osId: string) => {
    // Return mock OS details
    const osOptions: Record<string, any> = {
      'ubuntu': { name: 'Ubuntu', id: 'ubuntu' },
      'centos': { name: 'CentOS', id: 'centos' },
      'rhel': { name: 'Red Hat Enterprise Linux', id: 'rhel' },
      'sles': { name: 'SUSE Linux Enterprise Server', id: 'sles' },
    };
    return osOptions[osId] || { name: osId, id: osId };
  };

  const getKubernetesDistributionById = (distId: string) => {
    // Return mock K8s distribution details
    const distributions: Record<string, any> = {
      'k3s': { name: 'K3s', id: 'k3s' },
      'rke': { name: 'Rancher Kubernetes Engine', id: 'rke' },
      'rke2': { name: 'RKE2', id: 'rke2' },
    };
    return distributions[distId] || { name: distId, id: distId };
  };

  const getKubernetesVersionById = (distId: string, versionId: string) => {
    // Return mock K8s version details
    return { name: versionId, id: versionId };
  };

  const getStorageEngineById = (engineId: string) => {
    // Return mock storage engine details
    const engines: Record<string, any> = {
      'longhorn': { name: 'Longhorn', id: 'longhorn' },
      'ceph': { name: 'Ceph', id: 'ceph' },
      'nfs': { name: 'NFS', id: 'nfs' },
      'CloudProvider': { name: 'Cloud Provider Storage', id: 'CloudProvider' },
    };
    return engines[engineId] || { name: engineId, id: engineId };
  };

  const getAddonById = (addonId: string) => {
    // Return mock addon details
    const addons: Record<string, any> = {
      'monitoring': { 
        name: 'Monitoring', 
        id: 'monitoring', 
        logoPath: '/abops/addons/prometheus.svg',
        category: 'Observability',
        description: 'Prometheus and Grafana for monitoring',
        versions: ['1.0.0', '1.1.0', '1.2.0']
      },
      'logging': { 
        name: 'Logging', 
        id: 'logging', 
        logoPath: '/abops/addons/elastic.svg',
        category: 'Observability',
        description: 'ELK stack for centralized logging',
        versions: ['7.10.0', '7.17.0', '8.0.0']
      },
      'istio': { 
        name: 'Istio', 
        id: 'istio', 
        logoPath: '/abops/addons/istio.svg',
        category: 'Service Mesh',
        description: 'Service mesh for microservices',
        versions: ['1.13.0', '1.14.0', '1.15.0']
      },
      'cert-manager': { 
        name: 'Cert Manager', 
        id: 'cert-manager', 
        logoPath: '/abops/addons/cert-manager.svg',
        category: 'Security',
        description: 'Certificate management for Kubernetes',
        versions: ['1.8.0', '1.9.0', '1.10.0']
      },
    };
    return addons[addonId] || { 
      name: addonId, 
      id: addonId, 
      logoPath: '/abops/addons/default.svg',
      category: 'Other',
      description: 'Custom addon',
      versions: ['latest']
    };
  };

  // Load entity details on component mount
  useEffect(() => {
    // This function only needs to run once on component mount
    const loadDetails = async () => {
      try {
        // Load provider details
        if (provider) {
          const providerData = getProviderById(provider);
          setProviderDetails(providerData);
        }

        // Load credential details
        if (credential) {
          const credentialData = await getCredentialById(credential);
          setCredentialDetails(credentialData);
        }

        // Load region details
        if (region) {
          const regionData = getRegionById(provider, region);
          setRegionDetails(regionData);
        }

        // Load OS details
        if (os) {
          const osData = getOSById(os);
          setOsDetails(osData);
        }

        // Load Kubernetes details
        if (k8sDistribution) {
          const distribution = getKubernetesDistributionById(k8sDistribution);
          setK8sDistributionDetails(distribution);
        }

        if (k8sVersion) {
          const version = getKubernetesVersionById(k8sDistribution, k8sVersion);
          setK8sVersionDetails(version);
        }

        // Load storage engine details
        if (storageEngine) {
          const engine = getStorageEngineById(storageEngine);
          setStorageEngineDetails(engine);
        }

        // Load Rancher server and credential details
        if (rancherServer) {
          const server = await getRancherServerById(rancherServer);
          setRancherServerDetails(server || null);

          if (rancherCredential) {
            const credentials = await getCredentialsForServer(rancherServer);
            const credential = credentials.find(cred => cred.id === rancherCredential);
            setRancherCredentialDetails(credential || null);
          }
        }

        // Load addon details
        if (addons && addons.length > 0) {
          const addonsList = addons.map((addon: AddonConfig) => {
            const addonDetails = getAddonById(addon.id);
            return {
              ...addonDetails,
              enabled: addon.enabled,
              version: addon.version,
              hasValuesFile: !!addon.valuesFile
            };
          }).filter(Boolean);
          setAddonDetails(addonsList);
        }
      } catch (error) {
        console.error("Error loading cluster configuration details:", error);
      }
    };

    loadDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this only runs once

  const handleBack = () => {
    router.back();
  };

  const handleSaveTemplate = () => {
    // Open the save template dialog
    setSaveDialogOpen(true);
    // Set default template name based on cluster name
    setTemplateName(name ? `${name}-template` : '');
    setTemplateDescription(`${getProviderById(provider).name} cluster with ${k8sDistribution} ${k8sVersion}`);
    setSaveError('');
  };

  const handleSaveTemplateConfirm = async () => {
    if (!templateName.trim()) {
      setSaveError('Template name is required');
      return;
    }

    setIsLoading(true);
    
    try {
      // Prepare template data - ensure we're not including complex objects that can't be serialized
      const simplifiedNodePools = Array.isArray(nodePools) ? nodePools.map((pool: any) => ({
        role: pool?.role || 'worker',
        count: pool?.count || 1,
        vmSize: pool?.vmSize || '',
        customSize: pool?.customSize ? {
          cpu: pool.customSize.cpu || 2,
          memory: pool.customSize.memory || 4,
          storage: pool.customSize.storage || 40
        } : null
      })) : [];

      const simplifiedAddons = Array.isArray(addons) ? addons
        .filter((addon: any) => addon?.enabled)
        .map((addon: any) => ({
          id: addon?.id,
          enabled: true,
          version: addon?.version || 'latest',
          hasCustomValues: !!addon?.valuesFile
        })) : [];

      const templateData = {
        name: templateName,
        description: templateDescription,
        provider,
        k8s_distribution: k8sDistribution,
        k8s_version: k8sVersion,
        region,
        os,
        os_version: osVersion,
        storage_engine: storageEngine,
        storage_version: storageVersion,
        node_pools: simplifiedNodePools,
        addons: simplifiedAddons,
        security_options: securityOptions,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Save template to Supabase
      const { data, error } = await supabase
        .from('cluster_templates')
        .insert([templateData])
        .select();

      if (error) {
        console.error('Error saving template:', error);
        setSaveError('Failed to save template: ' + error.message);
        setIsLoading(false);
        return;
      }

      // Close dialog and navigate to templates page
      setSaveDialogOpen(false);
      setIsLoading(false);
      router.push('/apps/abops/clusters/templates?saved=true');
    } catch (error) {
      console.error('Error saving template:', error);
      setSaveError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const handleDeploy = async () => {
    setIsLoading(true);
    // In a real app, this would trigger the cluster deployment
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to the manage page with a success message
      router.push("/apps/abops/clusters/manage?deployed=true");
    }, 1500);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Confirm Cluster Configuration</h1>
          <p className="text-muted-foreground">Review and confirm your cluster configuration before deployment</p>
        </div>
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Edit
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="summary">Configuration Summary</TabsTrigger>
          <TabsTrigger value="yaml">YAML Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="font-medium">Cluster Name</Label>
                  <p className="text-lg font-medium">{clusterConfig.name}</p>
                </div>
                
                <div>
                  <Label className="font-medium">Provider</Label>
                  <div className="flex items-center mt-1">
                    {providerDetails && (
                      <div className="relative h-8 w-8 mr-2">
                        <Image 
                          src={`${logoBaseDir}/${clusterConfig.provider}-96.png`} 
                          alt={providerDetails.name || clusterConfig.provider}
                          width={32}
                          height={32}
                          className="object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `${logoBaseDir}/${clusterConfig.provider}.svg`;
                          }}
                        />
                      </div>
                    )}
                    <p>{providerDetails?.name || clusterConfig.provider}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-medium">Credential</Label>
                    <p>{credentialDetails?.name || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Region</Label>
                    <p>{regionDetails?.name || clusterConfig.region}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Node Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Operating System & Node Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label className="font-medium">Operating System</Label>
                  <div className="flex items-center mt-1">
                    {osDetails && (
                      <div className="relative h-8 w-8 mr-2">
                        <Image 
                          src={osDetails.logoPath || `/abops/os/${clusterConfig.os}.svg`}
                          alt={osDetails.name || clusterConfig.os}
                          width={32}
                          height={32}
                          className="object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/abops/os/default.svg";
                          }}
                        />
                      </div>
                    )}
                    <p>{osDetails?.name || clusterConfig.os} {clusterConfig.osVersion}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="font-medium mb-2 block">Node Pools</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.isArray(clusterConfig.nodePools) ? clusterConfig.nodePools.map((pool: any, index: number) => (
                      <Card key={index} className="border border-muted">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">{pool?.role === 'control-plane' ? 'Control Plane' : 'Worker'} Nodes</h4>
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">{pool?.count || 0} node{(pool?.count || 0) !== 1 ? 's' : ''}</span>
                          </div>
                          {pool?.vmSize ? (
                            <p className="text-sm">Size: {pool.vmSize}</p>
                          ) : pool?.customSize ? (
                            <div className="text-sm space-y-1">
                              <p>CPU: {pool.customSize?.cpu || 0} vCores</p>
                              <p>Memory: {pool.customSize?.memory || 0} GB</p>
                              <p>Storage: {pool.customSize?.storage || 0} GB</p>
                            </div>
                          ) : null}
                        </CardContent>
                      </Card>
                    )) : <p>No node pools configured</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kubernetes Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Kubernetes Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-medium">Distribution</Label>
                    <p className="mt-1">{k8sDistributionDetails?.name || clusterConfig.k8sDistribution}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Version</Label>
                    <p className="mt-1">{clusterConfig.k8sVersion}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="font-medium">Storage Engine</Label>
                  <div className="flex items-center mt-1">
                    {storageEngineDetails && (
                      <div className="relative h-8 w-8 mr-2">
                        <Image 
                          src={`/abops/storage/${clusterConfig.storageEngine}.svg`}
                          alt={storageEngineDetails.name || clusterConfig.storageEngine}
                          width={32}
                          height={32}
                          className="object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/abops/storage/default.svg";
                          }}
                        />
                      </div>
                    )}
                    <div>
                      <p>{storageEngineDetails?.name || clusterConfig.storageEngine}</p>
                      {clusterConfig.storageEngine !== 'CloudProvider' && (
                        <p className="text-sm text-muted-foreground">Version: {clusterConfig.storageVersion}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add-ons */}
          {addonDetails.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Add-ons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Array.isArray(addonDetails) ? addonDetails.filter(addon => addon?.enabled).map((addon) => (
                    <Card key={addon?.id || Math.random().toString()} className="border border-primary">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="h-8 w-8 relative">
                            <Image 
                              src={addon?.logoPath || "/abops/addons/default.svg"} 
                              alt={addon?.name || 'Addon'} 
                              width={32}
                              height={32}
                              className="object-contain" 
                              onError={(e) => {
                                // Fallback if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.src = "/abops/addons/default.svg";
                              }}
                            />
                          </div>
                          <h4 className="font-medium">{addon?.name || 'Unknown Addon'}</h4>
                        </div>
                        <div className="text-sm">
                          <p>Version: {addon?.version || 'latest'}</p>
                          {addon?.hasValuesFile && (
                            <p className="text-xs text-muted-foreground">Custom values file provided</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )) : <p>No addons configured</p>}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rancher Management */}
          {clusterConfig.rancherServer && (
            <Card>
              <CardHeader>
                <CardTitle>Rancher Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="font-medium">Rancher Server</Label>
                    <p>{rancherServerDetails?.name || 'Not specified'}</p>
                    {rancherServerDetails?.address && (
                      <p className="text-sm text-muted-foreground">{rancherServerDetails.address}</p>
                    )}
                  </div>
                  <div>
                    <Label className="font-medium">Rancher Credential</Label>
                    <p>{rancherCredentialDetails?.username || 'Not specified'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Options */}
          {clusterConfig.securityOptions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Security Hardening</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(clusterConfig.securityOptions) ? clusterConfig.securityOptions.map((option: string) => (
                    <div key={option} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center">
                      <Check className="mr-1 h-3 w-3" /> {(option || '').toUpperCase()}
                    </div>
                  )) : <p>No security options configured</p>}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="yaml" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration YAML</CardTitle>
              <CardDescription>
                This is a preview of the YAML configuration that will be used to deploy your cluster
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[600px] text-sm">
                {`# Cluster Configuration
name: ${clusterConfig.name}
provider: ${clusterConfig.provider}
region: ${clusterConfig.region}

# Credentials
providerCredential: ${clusterConfig.credential}
${clusterConfig.rancherServer ? `rancherServer: ${clusterConfig.rancherServer}
rancherCredential: ${clusterConfig.rancherCredential}` : '# No Rancher management configured'}

# Node Configuration
operatingSystem: ${clusterConfig.os}
osVersion: ${clusterConfig.osVersion}
nodePools:
${Array.isArray(clusterConfig.nodePools) ? clusterConfig.nodePools.map((pool: any) => `  - role: ${pool?.role || 'worker'}
    count: ${pool?.count || 1}
    ${pool?.vmSize ? `vmSize: ${pool.vmSize}` : `customSize:
      cpu: ${pool?.customSize?.cpu || 2}
      memory: ${pool?.customSize?.memory || 4}
      storage: ${pool?.customSize?.storage || 40}`}`).join('\n') : '  # No node pools configured'}

# Kubernetes Configuration
kubernetesDistribution: ${clusterConfig.k8sDistribution}
kubernetesVersion: ${clusterConfig.k8sVersion}
storageEngine: ${clusterConfig.storageEngine}
${clusterConfig.storageEngine !== 'CloudProvider' ? `storageVersion: ${clusterConfig.storageVersion}` : '# Using cloud provider native storage'}

# Add-ons
${Array.isArray(addonDetails) && addonDetails.filter(addon => addon?.enabled).length > 0 ? `addons:
${addonDetails.filter(addon => addon?.enabled).map(addon => `  - name: ${addon?.name || 'Unknown'}
    version: ${addon?.version || 'latest'}
    customValues: ${addon?.hasValuesFile ? 'true' : 'false'}`).join('\n')}` : '# No add-ons configured'}

# Security Hardening
${Array.isArray(clusterConfig.securityOptions) && clusterConfig.securityOptions.length > 0 ? `securityOptions:
${clusterConfig.securityOptions.map((option: string) => `  - ${option || 'unknown'}`).join('\n')}` : '# No security hardening configured'}
`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handleBack} disabled={isLoading}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="space-x-4">
          <Button 
            variant="outline" 
            onClick={handleSaveTemplate} 
            disabled={isLoading}
          >
            <Save className="mr-2 h-4 w-4" /> Save as Template
          </Button>
          <Button 
            onClick={handleDeploy} 
            disabled={isLoading}
          >
            <Server className="mr-2 h-4 w-4" /> Deploy Cluster
          </Button>
        </div>
      </div>

      {/* Save Template Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Cluster Template</DialogTitle>
            <DialogDescription>
              Save this cluster configuration as a template for future use.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Enter a name for this template"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-description">Description</Label>
              <Input
                id="template-description"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="Briefly describe this template"
              />
            </div>
            {saveError && (
              <p className="text-sm text-red-500">{saveError}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSaveDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveTemplateConfirm}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
