"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Check, Plus, Minus, Upload, X } from "lucide-react";
import Link from "next/link";

import { providers, getProvidersByType, ProviderType } from "@/config/providers";
import { VMSize, NodePool, getVMSizesForProvider, getDefaultNodePools } from "@/config/vm-sizes";
import { 
  KubernetesDistribution,
  KubernetesDistributionOption,
  KubernetesVersion,
  getDistributionsForProvider,
  getDefaultDistributionForProvider,
  getVersionsForDistribution,
  getDefaultVersionForDistribution
} from "@/config/kubernetes-versions";
import {
  StorageEngineType,
  StorageEngine,
  getAvailableStorageEngines,
  getDefaultStorageEngine,
  getStorageEngineVersions,
  getDefaultStorageEngineVersion
} from "@/config/storage-engines";
import {
  Addon,
  AddonType,
  addons,
  getAddonsByCategory,
  getAddonCategories
} from "@/config/addons";
import {
  Credential,
  CredentialType,
  getCredentialsByType,
  getDefaultCredentialForType,
  getCredentialById
} from "@/config/credentials";
import {
  RegionType,
  getRegionsForProvider,
  getDefaultRegionForProvider
} from "@/config/regions";
import {
  OSType,
  OperatingSystem,
  OSVersion,
  getOperatingSystemsForProvider,
  getDefaultOperatingSystemForProvider,
  getOSVersions,
  getDefaultOSVersion
} from "@/config/operating-systems";
import {
  RancherServer,
  RancherCredential,
  rancherServers,
  getRancherServerById,
  getCredentialsForServer,
  getDefaultCredentialForServer
} from "@/config/rancher-servers";

interface AddonConfig {
  id: AddonType;
  enabled: boolean;
  version: string;
  valuesFile: File | null;
}

export default function CreateCluster() {
  const router = useRouter();
  const fileInputRefs = useRef<Record<string, HTMLInputElement>>({});
  const [deploymentName, setDeploymentName] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [nameError, setNameError] = useState("");
  
  // Credential and region state
  const [availableCredentials, setAvailableCredentials] = useState<Credential[]>([]);
  const [selectedCredential, setSelectedCredential] = useState<string>("");
  const [availableRegions, setAvailableRegions] = useState<RegionType[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  
  // Base OS state
  const [availableOperatingSystems, setAvailableOperatingSystems] = useState<OperatingSystem[]>([]);
  const [selectedOS, setSelectedOS] = useState<OSType | null>(null);
  const [osVersions, setOSVersions] = useState<OSVersion[]>([]);
  const [selectedOSVersion, setSelectedOSVersion] = useState<string>("");
  const [showOSConfig, setShowOSConfig] = useState(false);
  
  const [nodePools, setNodePools] = useState<NodePool[]>([]);
  const [showPoolConfig, setShowPoolConfig] = useState(false);
  const [vmSizes, setVmSizes] = useState<VMSize[]>([]);
  const [k8sDistributions, setK8sDistributions] = useState<KubernetesDistributionOption[]>([]);
  const [selectedK8sDistribution, setSelectedK8sDistribution] = useState<KubernetesDistribution | null>(null);
  const [k8sVersions, setK8sVersions] = useState<KubernetesVersion[]>([]);
  const [selectedK8sVersion, setSelectedK8sVersion] = useState<string>("");
  const [showK8sConfig, setShowK8sConfig] = useState(false);
  const [storageEngines, setStorageEngines] = useState<StorageEngine[]>([]);
  const [selectedStorageEngine, setSelectedStorageEngine] = useState<StorageEngineType | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<AddonConfig[]>([]);
  const [showAddonsConfig, setShowAddonsConfig] = useState(false);
  const [storageEngineVersions, setStorageEngineVersions] = useState<string[]>([]);
  const [selectedStorageVersion, setSelectedStorageVersion] = useState<string>("");
  const [showStorageConfig, setShowStorageConfig] = useState(false);
  
  // Security hardening options state
  const [securityOptions, setSecurityOptions] = useState<string[]>([]);
  
  // Rancher management server state
  const [selectedRancherServer, setSelectedRancherServer] = useState<string>("");
  const [showRancherServerAddress, setShowRancherServerAddress] = useState<boolean>(false);
  const [availableRancherCredentials, setAvailableRancherCredentials] = useState<RancherCredential[]>([]);
  const [selectedRancherCredential, setSelectedRancherCredential] = useState<string>("");
  const [selectedRancherServerDetails, setSelectedRancherServerDetails] = useState<RancherServer | null>(null);

  // Handle deployment name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDeploymentName(value);
    
    // Validate name
    if (value.trim() === "") {
      setNameError("Deployment name is required");
    } else if (!/^[a-z0-9-]+$/.test(value)) {
      setNameError("Name can only contain lowercase letters, numbers, and hyphens");
    } else {
      setNameError("");
    }
  };

  // Handle provider selection
  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
    
    // Load credentials for this provider
    getCredentialsByType(providerId as CredentialType)
      .then(credentials => {
        setAvailableCredentials(credentials);
        
        // Set default credential if available
        getDefaultCredentialForType(providerId as CredentialType)
          .then(defaultCredential => {
            if (defaultCredential) {
              setSelectedCredential(defaultCredential.id);
            } else if (credentials.length > 0) {
              setSelectedCredential(credentials[0].id);
            } else {
              setSelectedCredential("");
            }
          })
          .catch(error => {
            console.error("Error getting default credential:", error);
            if (credentials.length > 0) {
              setSelectedCredential(credentials[0].id);
            } else {
              setSelectedCredential("");
            }
          });
      })
      .catch(error => {
        console.error("Error loading credentials:", error);
        setAvailableCredentials([]);
        setSelectedCredential("");
      });
    
    // Load regions for this provider (only for cloud providers)
    const isHCI = ['harvester', 'vmware', 'proxmox'].includes(providerId);
    
    if (!isHCI) {
      const regions = getRegionsForProvider(providerId);
      setAvailableRegions(regions);
      
      // Set default region if available
      const defaultRegion = getDefaultRegionForProvider(providerId);
      if (defaultRegion) {
        setSelectedRegion(defaultRegion.id);
      } else if (regions.length > 0) {
        setSelectedRegion(regions[0].id);
      } else {
        setSelectedRegion("");
      }
    } else {
      // Clear regions for HCI providers
      setAvailableRegions([]);
      setSelectedRegion("");
    }
    
    // Load operating systems for this provider
    const operatingSystems = getOperatingSystemsForProvider(providerId);
    setAvailableOperatingSystems(operatingSystems);
    
    // Set default OS and version
    const defaultOS = getDefaultOperatingSystemForProvider(providerId);
    if (defaultOS) {
      setSelectedOS(defaultOS.id);
      
      // Get versions for the selected OS
      const versions = getOSVersions(defaultOS.id);
      setOSVersions(versions);
      
      // Set default version
      const defaultVersion = getDefaultOSVersion(defaultOS.id);
      setSelectedOSVersion(defaultVersion);
    } else {
      setSelectedOS(null);
      setOSVersions([]);
      setSelectedOSVersion("");
    }
    
    // Show OS configuration section
    setShowOSConfig(true);
    
    // Reset node pools with default configuration for the selected provider
    const defaultPools = getDefaultNodePools(providerId);
    setNodePools(defaultPools);
    // Get VM sizes for the selected provider
    const sizes = getVMSizesForProvider(providerId);
    setVmSizes(sizes);
    // Show pool configuration section
    setShowPoolConfig(true);
    
    // Get Kubernetes distributions for the selected provider
    const distributions = getDistributionsForProvider(providerId);
    setK8sDistributions(distributions);
    
    // Set default distribution and version
    const defaultDistribution = getDefaultDistributionForProvider(providerId);
    if (defaultDistribution) {
      setSelectedK8sDistribution(defaultDistribution.id);
      
      // Get versions for the selected distribution
      const versions = getVersionsForDistribution(providerId, defaultDistribution.id);
      setK8sVersions(versions);
      
      // Set default version
      const defaultVersion = getDefaultVersionForDistribution(providerId, defaultDistribution.id);
      setSelectedK8sVersion(defaultVersion);
      
      // Update available storage engines based on provider and K8s distribution
      updateStorageEngines(providerId, defaultDistribution.id);
    } else {
      setSelectedK8sDistribution(null);
      setK8sVersions([]);
      setSelectedK8sVersion("");
    }
    
    // Show Kubernetes configuration section
    setShowK8sConfig(true);
  };
  
  // Handle node count change
  const handleNodeCountChange = (poolIndex: number, count: number) => {
    const updatedPools = [...nodePools];
    updatedPools[poolIndex].count = count;
    setNodePools(updatedPools);
  };
  
  // Handle VM size change
  const handleVmSizeChange = (poolIndex: number, sizeId: string) => {
    const updatedPools = [...nodePools];
    updatedPools[poolIndex].vmSize = sizeId;
    setNodePools(updatedPools);
  };
  
  // Handle custom size change for HCI providers
  const handleCustomSizeChange = (poolIndex: number, field: 'cpu' | 'memory' | 'storage', value: number) => {
    const updatedPools = [...nodePools];
    if (!updatedPools[poolIndex].customSize) {
      updatedPools[poolIndex].customSize = { cpu: 2, memory: 4, storage: 40 };
    }
    updatedPools[poolIndex].customSize![field] = value;
    setNodePools(updatedPools);
  };
  
  // Handle Kubernetes distribution selection
  const handleK8sDistributionChange = (distributionId: KubernetesDistribution) => {
    setSelectedK8sDistribution(distributionId);
    
    if (selectedProvider) {
      // Get versions for the selected distribution
      const versions = getVersionsForDistribution(selectedProvider, distributionId);
      setK8sVersions(versions);
      
      // Set default version
      const defaultVersion = getDefaultVersionForDistribution(selectedProvider, distributionId);
      setSelectedK8sVersion(defaultVersion);
      
      // Update available storage engines based on provider and K8s distribution
      updateStorageEngines(selectedProvider, distributionId);
    }
  };
  
  // Update available storage engines
  const updateStorageEngines = (providerId: string, distributionId: KubernetesDistribution) => {
    // Get available storage engines for the selected provider and K8s distribution
    const availableEngines = getAvailableStorageEngines(providerId, distributionId);
    setStorageEngines(availableEngines);
    
    // Set default storage engine
    const defaultEngine = getDefaultStorageEngine(providerId, distributionId);
    if (defaultEngine) {
      setSelectedStorageEngine(defaultEngine.id);
      
      // Get versions for the selected storage engine
      const versions = getStorageEngineVersions(defaultEngine.id);
      setStorageEngineVersions(versions);
      
      // Set default version
      const defaultVersion = getDefaultStorageEngineVersion(defaultEngine.id);
      setSelectedStorageVersion(defaultVersion);
    } else {
      setSelectedStorageEngine(null);
      setStorageEngineVersions([]);
      setSelectedStorageVersion("");
    }
    
    // Show storage configuration section
    setShowStorageConfig(true);
  };
  
  // Handle Kubernetes version selection
  const handleK8sVersionChange = (version: string) => {
    setSelectedK8sVersion(version);
  };
  
  // Handle storage engine selection
  const handleStorageEngineChange = (engineId: StorageEngineType) => {
    setSelectedStorageEngine(engineId);
    
    // Get versions for the selected storage engine
    const versions = getStorageEngineVersions(engineId);
    setStorageEngineVersions(versions);
    
    // Set default version
    const defaultVersion = getDefaultStorageEngineVersion(engineId);
    setSelectedStorageVersion(defaultVersion);
  };
  
  // Handle storage engine version selection
  const handleStorageVersionChange = (version: string) => {
    setSelectedStorageVersion(version);
  };
  
  // Handle credential selection
  const handleCredentialChange = (credentialId: string) => {
    setSelectedCredential(credentialId);
  };
  
  // Handle region selection
  const handleRegionChange = (regionId: string) => {
    setSelectedRegion(regionId);
  };
  
  // Handle OS selection
  const handleOSChange = (osId: OSType) => {
    setSelectedOS(osId);
    
    // Get versions for the selected OS
    const versions = getOSVersions(osId);
    setOSVersions(versions);
    
    // Set default version
    const defaultVersion = getDefaultOSVersion(osId);
    setSelectedOSVersion(defaultVersion);
  };
  
  // Handle OS version selection
  const handleOSVersionChange = (version: string) => {
    setSelectedOSVersion(version);
  };

  // Add-on handlers
  const handleAddonToggle = (addonId: AddonType) => {
    setSelectedAddons(prev => {
      const existingIndex = prev.findIndex(a => a.id === addonId);
      if (existingIndex >= 0) {
        // Toggle existing addon
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          enabled: !updated[existingIndex].enabled
        };
        return updated;
      } else {
        // Add new addon with default values
        const addon = addons.find(a => a.id === addonId);
        if (!addon) return prev;
        return [...prev, {
          id: addonId,
          enabled: true,
          version: addon.version,
          valuesFile: null
        }];
      }
    });
  };

  const handleAddonVersionChange = (addonId: AddonType, version: string) => {
    setSelectedAddons(prev => {
      const existingIndex = prev.findIndex(a => a.id === addonId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          version
        };
        return updated;
      }
      return prev;
    });
  };

  const handleValuesFileUpload = (addonId: AddonType, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedAddons(prev => {
      const existingIndex = prev.findIndex(a => a.id === addonId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          valuesFile: file
        };
        return updated;
      }
      return prev;
    });
  };

  const triggerFileInput = (addonId: AddonType) => {
    const inputElement = fileInputRefs.current[addonId];
    if (inputElement) {
      inputElement.click();
    }
  };

  const removeValuesFile = (addonId: AddonType) => {
    setSelectedAddons(prev => {
      const existingIndex = prev.findIndex(a => a.id === addonId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          valuesFile: null
        };
        return updated;
      }
      return prev;
    });
  };

  const isAddonEnabled = (addonId: AddonType): boolean => {
    const addon = selectedAddons.find(a => a.id === addonId);
    return addon ? addon.enabled : false;
  };

  const getAddonVersion = (addonId: AddonType): string => {
    const addon = selectedAddons.find(a => a.id === addonId);
    if (addon) return addon.version;
    
    const defaultAddon = addons.find(a => a.id === addonId);
    return defaultAddon ? defaultAddon.version : '';
  };

  const getAddonValuesFile = (addonId: AddonType): File | null => {
    const addon = selectedAddons.find(a => a.id === addonId);
    return addon ? addon.valuesFile : null;
  };

  // Handle next step
  const handleNext = async () => {
    // Validate required fields
    if (!deploymentName || !selectedProvider || !selectedCredential || !selectedRegion) {
      console.error("Missing required fields");
      return;
    }
    
    try {
      // Prepare URL parameters for the confirmation page
      const params = new URLSearchParams();
      
      // Basic information
      params.append('name', deploymentName);
      params.append('provider', selectedProvider);
      params.append('credential', selectedCredential);
      params.append('region', selectedRegion);
      
      // Node configuration
      params.append('os', selectedOS || '');
      params.append('osVersion', selectedOSVersion);
      
      // Kubernetes configuration
      params.append('k8sDistribution', selectedK8sDistribution || '');
      params.append('k8sVersion', selectedK8sVersion);
      
      // Storage configuration
      if (selectedStorageEngine) {
        params.append('storageEngine', selectedStorageEngine);
        params.append('storageVersion', selectedStorageVersion);
      }
      
      // Rancher management
      if (selectedRancherServer) {
        params.append('rancherServer', selectedRancherServer);
        if (selectedRancherCredential) {
          params.append('rancherCredential', selectedRancherCredential);
        }
      }
      
      // Node pools
      const nodePoolsConfig = [
        {
          role: 'control-plane',
          count: 1, // Default to 1 control plane node
          vmSize: nodePools.length > 0 ? nodePools[0].vmSize : null,
          customSize: nodePools.length > 0 ? nodePools[0].customSize : null
        },
        {
          role: 'worker',
          count: 2, // Default to 2 worker nodes
          vmSize: nodePools.length > 1 ? nodePools[1].vmSize : null,
          customSize: nodePools.length > 1 ? nodePools[1].customSize : null
        }
      ];
      params.append('nodePools', JSON.stringify(nodePoolsConfig));
      
      // Add-ons
      params.append('addons', JSON.stringify(selectedAddons));
      
      // Security options
      params.append('securityOptions', JSON.stringify(securityOptions));
      
      // Navigate to confirmation page
      router.push(`/apps/abops/clusters/create-confirm?${params.toString()}`);
    } catch (error) {
      console.error("Error preparing confirmation data:", error);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.push("/apps/abops/clusters/manage");
  };

  // Check if form is valid
  const isFormValid = deploymentName.trim() !== "" && !nameError && 
    selectedProvider !== null && 
    // Credential must be selected
    selectedCredential !== "" &&
    // Region must be selected for cloud providers, not required for HCI
    ((['harvester', 'vmware', 'proxmox'].includes(selectedProvider || '') || selectedRegion !== "")) &&
    // Base OS must be selected
    selectedOS !== null &&
    selectedOSVersion !== "" &&
    (nodePools.length === 0 || nodePools.every(pool => pool.count > 0 && 
      (pool.vmSize || (pool.customSize && pool.customSize.cpu > 0 && pool.customSize.memory > 0 && pool.customSize.storage > 0)))) &&
    selectedK8sDistribution !== null && 
    selectedK8sVersion !== "" &&
    selectedStorageEngine !== null &&
    selectedStorageVersion !== "" &&
    // If a Rancher server is selected, a Rancher credential must also be selected
    (selectedRancherServer === "" || (selectedRancherServer !== "" && selectedRancherCredential !== ""));
  
  // Check if the selected provider is an HCI provider
  const isHciProvider = selectedProvider && ['harvester', 'vmware', 'proxmox'].includes(selectedProvider);

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">Create ABOps Cluster</h1>
        <p className="text-muted-foreground">
          Configure and deploy a new Kubernetes cluster to your infrastructure.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Deployment Configuration</CardTitle>
          <CardDescription>
            Provide basic information about your new Kubernetes cluster.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Deployment Name */}
          <div className="space-y-2">
            <Label htmlFor="deployment-name">Deployment Name</Label>
            <Input
              id="deployment-name"
              placeholder="my-kubernetes-cluster"
              value={deploymentName}
              onChange={handleNameChange}
              className={nameError ? "border-red-500" : ""}
            />
            {nameError && (
              <p className="text-sm text-red-500">{nameError}</p>
            )}
            <p className="text-sm text-muted-foreground">
              The name will be used as a prefix for resources created for this cluster.
            </p>
          </div>
          
          {/* Provider Selection */}
          <div className="space-y-4">
            <Label>Select Provider</Label>
            
            {/* Cloud Providers */}
            <div>
              <h3 className="text-sm font-medium mb-3">Cloud Providers</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {getProvidersByType("cloud").map(provider => (
                    <div
                      key={provider.id}
                      className={`
                        flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all
                        ${selectedProvider === provider.id 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"}
                      `}
                      onClick={() => handleProviderSelect(provider.id)}
                    >
                      <div className="relative h-12 w-12 mb-2">
                        <div className="w-12 h-12 flex items-center justify-center">
                          <Image
                            src={provider.logoPath}
                            alt={provider.name}
                            width={40}
                            height={40}
                            className="object-contain"
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium">{provider.name}</span>
                      {selectedProvider === provider.id && (
                        <div className="absolute top-2 right-2">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
            
            {/* HCI Providers */}
            <div>
              <h3 className="text-sm font-medium mb-3">HCI Providers</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {getProvidersByType("hci").map(provider => (
                    <div
                      key={provider.id}
                      className={`
                        flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all
                        ${selectedProvider === provider.id 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"}
                      `}
                      onClick={() => handleProviderSelect(provider.id)}
                    >
                      <div className="relative h-12 w-12 mb-2">
                        <div className="w-12 h-12 flex items-center justify-center">
                          <Image
                            src={provider.logoPath}
                            alt={provider.name}
                            width={40}
                            height={40}
                            className="object-contain"
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium">{provider.name}</span>
                      {selectedProvider === provider.id && (
                        <div className="absolute top-2 right-2">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
          
          {/* Credential and Region Selection */}
          {selectedProvider && (
            <div className="space-y-4">
              {/* Credential Selection */}
              <div>
                <Label htmlFor="credential-select">Select Credential</Label>
                <div className="relative mt-2">
                  <select
                    id="credential-select"
                    value={selectedCredential}
                    onChange={(e) => handleCredentialChange(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="" disabled>
                      Select a credential
                    </option>
                    {availableCredentials.map((credential) => (
                      <option key={credential.id} value={credential.id}>
                        {credential.name} - {credential.description}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Select a credential to use for this deployment. You can manage credentials in the credentials section.
                </p>
              </div>
              
              {/* Region Selection - Only for cloud providers */}
              {availableRegions.length > 0 && (
                <div>
                  <Label htmlFor="region-select">Select Region</Label>
                  <div className="relative mt-2">
                    <select
                      id="region-select"
                      value={selectedRegion}
                      onChange={(e) => handleRegionChange(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      <option value="" disabled>
                        Select a region
                      </option>
                      {availableRegions.map((region) => (
                        <option key={region.id} value={region.id}>
                          {region.name} - {region.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select the region where you want to deploy your cluster.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Base OS Selection */}
          {showOSConfig && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Base Operating System</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Select the base operating system for your cluster nodes. The available options are based on your selected provider.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {availableOperatingSystems.map((os) => (
                  <div
                    key={os.id}
                    className={`
                      flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${selectedOS === os.id 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"}
                    `}
                    onClick={() => handleOSChange(os.id)}
                  >
                    <div className="relative h-12 w-12 mb-2">
                      <div className="w-12 h-12 flex items-center justify-center">
                        <img
                          src={os.logoPath}
                          alt={os.name}
                          width={40}
                          height={40}
                          className="object-contain"
                          onError={(e) => {
                            // Fallback if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.src = "/abops/os/default.svg";
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-center">{os.name}</span>
                    {selectedOS === os.id && (
                      <div className="absolute top-2 right-2">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* OS Version Selection */}
              {selectedOS && (
                <div className="mb-4">
                  <Label htmlFor="os-version-select">Select Version</Label>
                  <div className="relative mt-2">
                    <select
                      id="os-version-select"
                      value={selectedOSVersion}
                      onChange={(e) => handleOSVersionChange(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      <option value="" disabled>
                        Select a version
                      </option>
                      {osVersions.map((version) => (
                        <option key={version.id} value={version.id}>
                          {version.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select the version of the operating system to use for your cluster nodes.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Instance Pool Configuration Section */}
          {showPoolConfig && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Instance Pool Configuration</h2>
              
              {nodePools.map((pool, index) => (
                <Card key={pool.role} className="mb-6">
                  <CardHeader>
                    <h3 className="text-md font-medium">
                      {pool.role === 'control-plane' ? 'Control Plane' : 'Worker'} Nodes
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Node Count */}
                      <div>
                        <Label htmlFor={`${pool.role}-count`} className="mb-2 block">
                          Node Count
                        </Label>
                        <div className="flex items-center">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleNodeCountChange(index, Math.max(pool.count - 1, pool.role === 'control-plane' ? 1 : 0))}
                            disabled={pool.role === 'control-plane' && pool.count <= 1}
                          >
                            -
                          </Button>
                          <Input
                            id={`${pool.role}-count`}
                            type="number"
                            className="w-16 mx-2 text-center"
                            value={pool.count}
                            min={pool.role === 'control-plane' ? 1 : 0}
                            onChange={(e) => handleNodeCountChange(index, parseInt(e.target.value) || 0)}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleNodeCountChange(index, pool.count + 1)}
                          >
                            +
                          </Button>
                        </div>
                        {pool.role === 'control-plane' && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Minimum 1 control plane node required
                          </p>
                        )}
                      </div>
                      
                      {/* VM Size or Custom Size */}
                      {isHciProvider ? (
                        // Custom size configuration for HCI providers
                        <>
                          <div>
                            <Label htmlFor={`cpu-${index}`} className="mb-2 block">CPU (vCores)</Label>
                            <Input
                              id={`cpu-${index}`}
                              type="number"
                              min={1}
                              value={pool.customSize?.cpu || 2}
                              onChange={(e) => handleCustomSizeChange(index, 'cpu', parseInt(e.target.value) || 1)}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`memory-${index}`} className="mb-2 block">Memory (GB)</Label>
                            <Input
                              id={`memory-${index}`}
                              type="number"
                              min={2}
                              value={pool.customSize?.memory || 4}
                              onChange={(e) => handleCustomSizeChange(index, 'memory', parseInt(e.target.value) || 2)}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`storage-${index}`} className="mb-2 block">Storage (GB)</Label>
                            <Input
                              id={`storage-${index}`}
                              type="number"
                              min={20}
                              step={10}
                              value={pool.customSize?.storage || 40}
                              onChange={(e) => handleCustomSizeChange(index, 'storage', parseInt(e.target.value) || 20)}
                              className="w-full"
                            />
                          </div>
                        </>
                      ) : (
                        // VM size selection for cloud providers
                        <div className="col-span-2">
                          <Label htmlFor={`vm-size-${index}`} className="mb-2 block">VM Size</Label>
                          <select
                            id={`vm-size-${index}`}
                            className="w-full p-2 border rounded-md"
                            value={pool.vmSize || ''}
                            onChange={(e) => handleVmSizeChange(index, e.target.value)}
                          >
                            <option value="" disabled>Select a VM size</option>
                            {vmSizes.map((size) => (
                              <option key={size.id} value={size.id}>
                                {size.name} ({size.cpu} vCPU, {size.memory} GB RAM) - {size.description}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {/* Kubernetes Distribution Selection Section */}
          {showK8sConfig && (
            <div className="mt-8 mb-8">
              <h2 className="text-lg font-semibold mb-4">Kubernetes Configuration</h2>
              <Card>
                <CardHeader>
                  <h3 className="text-md font-medium">Distribution & Version</h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Distribution Selection */}
                    <div>
                      <Label htmlFor="k8s-distribution" className="mb-2 block">
                        Kubernetes Distribution
                      </Label>
                      <select
                        id="k8s-distribution"
                        className="w-full p-2 border rounded-md"
                        value={selectedK8sDistribution || ''}
                        onChange={(e) => handleK8sDistributionChange(e.target.value as KubernetesDistribution)}
                      >
                        <option value="" disabled>Select a distribution</option>
                        {k8sDistributions.map((dist) => (
                          <option key={dist.id} value={dist.id}>
                            {dist.name} - {dist.description}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedProvider === 'aws' && selectedK8sDistribution === 'EKS' && 'Amazon EKS is a managed Kubernetes service'}
                        {selectedProvider === 'azure' && selectedK8sDistribution === 'AKS' && 'Azure AKS is a managed Kubernetes service'}
                        {selectedProvider === 'gcp' && selectedK8sDistribution === 'GKE' && 'Google GKE is a managed Kubernetes service'}
                        {selectedK8sDistribution === 'RKE2' && 'RKE2 is Rancher\'s next-generation Kubernetes distribution'}
                        {selectedK8sDistribution === 'K3s' && 'K3s is a lightweight certified Kubernetes distribution'}
                        {selectedK8sDistribution === 'Vanilla' && 'Standard Kubernetes installed from upstream sources'}
                      </p>
                    </div>
                    
                    {/* Version Selection */}
                    <div>
                      <Label htmlFor="k8s-version" className="mb-2 block">
                        Kubernetes Version
                      </Label>
                      <select
                        id="k8s-version"
                        className="w-full p-2 border rounded-md"
                        value={selectedK8sVersion}
                        onChange={(e) => handleK8sVersionChange(e.target.value)}
                        disabled={!selectedK8sDistribution}
                      >
                        <option value="" disabled>Select a version</option>
                        {k8sVersions.map((version) => (
                          <option 
                            key={version.version} 
                            value={version.version}
                            disabled={version.deprecated}
                          >
                            {version.version}{version.isDefault ? ' (Default)' : ''}{version.deprecated ? ' (Deprecated)' : ''}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Select a supported Kubernetes version for your cluster
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Storage Engine Selection Section */}
          {showStorageConfig && (
            <div className="mt-8 mb-8">
              <h2 className="text-lg font-semibold mb-4">Storage Configuration</h2>
              <Card>
                <CardHeader>
                  <h3 className="text-md font-medium">Storage Engine</h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Storage Engine Selection */}
                    <div>
                      <Label htmlFor="storage-engine" className="mb-2 block">
                        Storage Engine
                      </Label>
                      <select
                        id="storage-engine"
                        className="w-full p-2 border rounded-md"
                        value={selectedStorageEngine || ''}
                        onChange={(e) => handleStorageEngineChange(e.target.value as StorageEngineType)}
                      >
                        <option value="" disabled>Select a storage engine</option>
                        {storageEngines.map((engine) => (
                          <option key={engine.id} value={engine.id}>
                            {engine.name} - {engine.description}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedStorageEngine === 'CloudProvider' && 'Uses the cloud provider\'s native storage services'}
                        {selectedStorageEngine === 'Longhorn' && 'Cloud-native distributed storage built for Kubernetes'}
                        {selectedStorageEngine === 'Portworx' && 'Enterprise-grade storage solution for containers'}
                        {selectedStorageEngine === 'OpenEBS' && 'Container attached storage with multiple storage engines'}
                        {selectedStorageEngine === 'Rook' && 'Storage orchestrator for Kubernetes integrating Ceph'}
                      </p>
                    </div>
                    
                    {/* Version Selection */}
                    <div>
                      <Label htmlFor="storage-version" className="mb-2 block">
                        Version
                      </Label>
                      <select
                        id="storage-version"
                        className="w-full p-2 border rounded-md"
                        value={selectedStorageVersion}
                        onChange={(e) => handleStorageVersionChange(e.target.value)}
                        disabled={!selectedStorageEngine || selectedStorageEngine === 'CloudProvider'}
                      >
                        <option value="" disabled>Select a version</option>
                        {storageEngineVersions.map((version) => (
                          <option key={version} value={version}>
                            {version}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedStorageEngine === 'CloudProvider' 
                          ? 'Cloud provider storage is managed automatically' 
                          : 'Select a version for your storage engine'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Add Ons Section */}
          <div className="mt-8 mb-8">
            <h2 className="text-lg font-semibold mb-4">Add Ons</h2>
            <Card>
              <CardHeader>
                <CardTitle className="text-md font-medium">Helm Charts</CardTitle>
                <CardDescription>
                  Select Helm charts to automatically deploy with your cluster
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {addons.map((addon) => {
                    const isEnabled = isAddonEnabled(addon.id);
                    const selectedVersion = getAddonVersion(addon.id);
                    const valuesFile = getAddonValuesFile(addon.id);
                    
                    return (
                      <Card 
                        key={addon.id} 
                        className={`border ${isEnabled ? 'border-primary' : 'border-muted'} cursor-pointer`}
                        onClick={() => handleAddonToggle(addon.id)}
                      >
                        <CardHeader className="p-4 pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="h-8 w-8 relative">
                                <Image 
                                  src={addon.logoPath} 
                                  alt={addon.name} 
                                  fill 
                                  className="object-contain" 
                                  onError={(e) => {
                                    // Fallback if image fails to load
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/abops/addons/default.svg";
                                  }}
                                />
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">{addon.name}</h4>
                                <p className="text-xs text-muted-foreground">{addon.category}</p>
                              </div>
                            </div>
                            <div className="h-4 w-4 rounded-sm border border-primary flex items-center justify-center">
                              {isEnabled && <Check className="h-3 w-3" />}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <p className="text-xs mb-4">{addon.description}</p>
                          
                          {isEnabled && (
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor={`${addon.id}-version`} className="text-xs mb-1 block">
                                  Version
                                </Label>
                                <select
                                  id={`${addon.id}-version`}
                                  className="w-full p-1 text-xs border rounded-md"
                                  value={selectedVersion}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handleAddonVersionChange(addon.id, e.target.value);
                                  }}
                                >
                                  {addon.versions.map((version) => (
                                    <option key={version} value={version}>
                                      {version}{version === addon.version ? ' (Default)' : ''}
                                    </option>
                                  ))}
                                </select>
                                {addon.link && (
                                  <div className="mt-1">
                                    <a href={addon.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">
                                      View documentation
                                    </a>
                                  </div>
                                )}
                              </div>
                              
                              <div>
                                <Label className="text-xs mb-1 block">
                                  Custom Values File
                                </Label>
                                <input
                                  type="file"
                                  id={`file-${addon.id}`}
                                  className="hidden"
                                  accept=".yaml,.yml"
                                  ref={(el) => {
                                    if (el) fileInputRefs.current[addon.id] = el;
                                  }}
                                  onChange={(e) => handleValuesFileUpload(addon.id, e)}
                                />
                                
                                {valuesFile ? (
                                  <div className="flex items-center justify-between text-xs p-1 border rounded-md">
                                    <span className="truncate max-w-[120px]">{valuesFile.name}</span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeValuesFile(addon.id);
                                      }}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      triggerFileInput(addon.id);
                                    }}
                                  >
                                    <Upload className="mr-1 h-3 w-3" /> Upload values.yaml
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Security Hardening Section */}
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Hardening</CardTitle>
                <CardDescription>
                  Select security compliance frameworks to apply to your cluster. Multiple options can be selected.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      id: 'cis', 
                      name: 'CIS', 
                      description: 'Center for Internet Security Benchmarks',
                      link: 'https://www.cisecurity.org/benchmark/kubernetes'
                    },
                    { 
                      id: 'disa-stig', 
                      name: 'DISA STIG', 
                      description: 'Defense Information Systems Agency Security Technical Implementation Guides',
                      link: 'https://public.cyber.mil/stigs/downloads/'
                    },
                    { 
                      id: 'nist-800-53', 
                      name: 'NIST 800-53', 
                      description: 'Security and Privacy Controls for Information Systems and Organizations',
                      link: 'https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final'
                    },
                    { 
                      id: 'nist-800-190', 
                      name: 'NIST 800-190', 
                      description: 'Application Container Security Guide',
                      link: 'https://csrc.nist.gov/publications/detail/sp/800-190/final'
                    },
                    { 
                      id: 'hipaa', 
                      name: 'HIPAA', 
                      description: 'Health Insurance Portability and Accountability Act',
                      link: 'https://www.hhs.gov/hipaa/for-professionals/security/index.html'
                    },
                  ].map((option) => (
                    <div key={option.id} className="flex items-start space-x-3">
                      <div className="flex h-5 items-center">
                        <input
                          type="checkbox"
                          id={`security-${option.id}`}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          onChange={(e) => {
                            // Handle security option selection
                            const isChecked = e.target.checked;
                            setSecurityOptions((prev: string[]) => {
                              if (isChecked) {
                                return [...prev, option.id];
                              } else {
                                return prev.filter((id: string) => id !== option.id);
                              }
                            });
                          }}
                        />
                      </div>
                      <div className="text-sm leading-6">
                        <label htmlFor={`security-${option.id}`} className="font-medium text-gray-900">
                          {option.name}
                        </label>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                        {option.link && (
                          <a 
                            href={option.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs text-primary underline mt-1 block"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View documentation
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Rancher Management Server Section */}
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Rancher Management Server</CardTitle>
                <CardDescription>
                  Select a Rancher management server to join this cluster to
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="rancher-server" className="mb-2 block">
                      Rancher Server
                    </Label>
                    <select
                      id="rancher-server"
                      className="w-full p-2 border rounded-md"
                      value={selectedRancherServer}
                      onChange={(e) => {
                        const serverId = e.target.value;
                        setSelectedRancherServer(serverId);
                        setShowRancherServerAddress(serverId !== "");
                        
                        // Load credentials for this Rancher server
                        if (serverId) {
                          // Load server details
                          getRancherServerById(serverId)
                            .then(server => {
                              if (server) {
                                setSelectedRancherServerDetails(server);
                              } else {
                                setSelectedRancherServerDetails(null);
                              }
                            })
                            .catch(error => {
                              console.error("Error loading Rancher server details:", error);
                              setSelectedRancherServerDetails(null);
                            });
                          
                          // Load credentials
                          getCredentialsForServer(serverId)
                            .then(credentials => {
                              setAvailableRancherCredentials(credentials);
                              
                              // Set default credential if available
                              getDefaultCredentialForServer(serverId)
                                .then(defaultCredential => {
                                  if (defaultCredential) {
                                    setSelectedRancherCredential(defaultCredential.id);
                                  } else if (credentials.length > 0) {
                                    setSelectedRancherCredential(credentials[0].id);
                                  } else {
                                    setSelectedRancherCredential("");
                                  }
                                })
                                .catch(error => {
                                  console.error("Error getting default Rancher credential:", error);
                                  if (credentials.length > 0) {
                                    setSelectedRancherCredential(credentials[0].id);
                                  } else {
                                    setSelectedRancherCredential("");
                                  }
                                });
                            })
                            .catch(error => {
                              console.error("Error loading Rancher credentials:", error);
                              setAvailableRancherCredentials([]);
                              setSelectedRancherCredential("");
                            });
                        } else {
                          setAvailableRancherCredentials([]);
                          setSelectedRancherCredential("");
                          setSelectedRancherServerDetails(null);
                        }
                      }}
                    >
                      <option value="">None (Standalone cluster)</option>
                      {rancherServers.map((server) => (
                        <option key={server.id} value={server.id}>
                          {server.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {showRancherServerAddress && selectedRancherServer && (
                    <>
                      <div className="mt-4 p-4 bg-muted rounded-md">
                        <h4 className="font-medium mb-2">Selected Rancher Server Details</h4>
                        <div className="text-sm">
                          {/* Use state to store server details */}
                          {selectedRancherServerDetails ? (
                            <>
                              <p><span className="font-medium">Address:</span> {selectedRancherServerDetails.address}</p>
                              {selectedRancherServerDetails.description && (
                                <p className="mt-1"><span className="font-medium">Description:</span> {selectedRancherServerDetails.description}</p>
                              )}
                            </>
                          ) : (
                            <p>Loading server details...</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Rancher Credentials Selection */}
                      <div className="mt-4">
                        <Label htmlFor="rancher-credential" className="mb-2 block">
                          Rancher Credentials
                        </Label>
                        {availableRancherCredentials.length > 0 ? (
                          <select
                            id="rancher-credential"
                            className="w-full p-2 border rounded-md"
                            value={selectedRancherCredential}
                            onChange={(e) => setSelectedRancherCredential(e.target.value)}
                          >
                            {availableRancherCredentials.map((cred: RancherCredential) => (
                              <option key={cred.id} value={cred.id}>
                                {cred.username} {cred.isDefault ? "(Default)" : ""}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            No credentials available for this Rancher server.
                            <Link href="/apps/abops/credentials/rancher" className="ml-2 text-primary hover:underline">
                              Add credentials
                            </Link>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleCancel}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleNext} disabled={!isFormValid}>
            Next Step
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
