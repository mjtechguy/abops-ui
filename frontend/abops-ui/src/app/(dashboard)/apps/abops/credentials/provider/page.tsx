"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { providers } from "@/config/providers";
import { PlusCircle, Trash2, Edit, Eye, EyeOff, Cloud } from "lucide-react";

// Types for provider credentials
interface ProviderCredential {
  id: string;
  name: string;
  provider: string;
  type: string;
  isDefault: boolean;
  createdAt: string;
  // Credentials data varies by provider
  data: {
    [key: string]: string;
  };
}

// Mock data for provider credentials
const initialCredentials: ProviderCredential[] = [
  {
    id: "aws-prod-1",
    name: "AWS Production",
    provider: "aws",
    type: "access_key",
    isDefault: true,
    createdAt: "2025-01-10T08:00:00Z",
    data: {
      accessKey: "AKIA123456789EXAMPLE",
      secretKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
    }
  },
  {
    id: "azure-dev-1",
    name: "Azure Development",
    provider: "azure",
    type: "service_principal",
    isDefault: true,
    createdAt: "2025-01-15T10:30:00Z",
    data: {
      clientId: "11111111-1111-1111-1111-111111111111",
      clientSecret: "abcdefghijklmnopqrstuvwxyz123456789",
      subscriptionId: "22222222-2222-2222-2222-222222222222",
      tenantId: "33333333-3333-3333-3333-333333333333"
    }
  },
  {
    id: "gcp-staging-1",
    name: "GCP Staging",
    provider: "gcp",
    type: "service_account",
    isDefault: true,
    createdAt: "2025-01-20T14:15:00Z",
    data: {
      projectId: "my-gcp-project",
      keyJson: "{\"type\":\"service_account\",\"project_id\":\"my-gcp-project\"}"
    }
  }
];

export default function ProviderCredentialsPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState<ProviderCredential[]>(initialCredentials);
  const [isAddingCredential, setIsAddingCredential] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [credentialToDelete, setCredentialToDelete] = useState<string | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  
  // New credential form state
  const [newCredential, setNewCredential] = useState({
    name: "",
    provider: "",
    isDefault: true,
    // AWS fields
    awsAccessKey: "",
    awsSecretKey: "",
    // Azure fields
    azureClientId: "",
    azureClientSecret: "",
    azureSubscriptionId: "",
    azureTenantId: "",
    // GCP fields
    gcpProjectId: "",
    gcpKeyJson: "",
    // VMware fields
    vmwareServer: "",
    vmwareUsername: "",
    vmwarePassword: "",
    // Proxmox fields
    proxmoxServer: "",
    proxmoxUsername: "",
    proxmoxPassword: "",
    proxmoxToken: "",
    // Harvester fields
    harvesterServer: "",
    harvesterUsername: "",
    harvesterPassword: "",
    harvesterToken: ""
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCredential(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewCredential(prev => ({ ...prev, [name]: checked }));
  };
  
  // Toggle secret visibility
  const toggleSecretVisibility = (id: string) => {
    setShowSecrets(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  // Provider selection handler
  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvider(e.target.value);
    setNewCredential(prev => ({ ...prev, provider: e.target.value }));
  };
  
  // Add new credential
  const handleAddCredential = () => {
    // Validate form
    if (!newCredential.name || !newCredential.provider) {
      alert("Credential name and provider are required");
      return;
    }
    
    // Create credential data based on provider
    let credentialData: Record<string, string> = {};
    let credentialType = "";
    
    switch (newCredential.provider) {
      case "aws":
        if (!newCredential.awsAccessKey || !newCredential.awsSecretKey) {
          alert("AWS Access Key and Secret Key are required");
          return;
        }
        credentialData = {
          accessKey: newCredential.awsAccessKey,
          secretKey: newCredential.awsSecretKey
        };
        credentialType = "access_key";
        break;
        
      case "azure":
        if (!newCredential.azureClientId || !newCredential.azureClientSecret || 
            !newCredential.azureSubscriptionId || !newCredential.azureTenantId) {
          alert("All Azure fields are required");
          return;
        }
        credentialData = {
          clientId: newCredential.azureClientId,
          clientSecret: newCredential.azureClientSecret,
          subscriptionId: newCredential.azureSubscriptionId,
          tenantId: newCredential.azureTenantId
        };
        credentialType = "service_principal";
        break;
        
      case "gcp":
        if (!newCredential.gcpProjectId || !newCredential.gcpKeyJson) {
          alert("GCP Project ID and Key JSON are required");
          return;
        }
        credentialData = {
          projectId: newCredential.gcpProjectId,
          keyJson: newCredential.gcpKeyJson
        };
        credentialType = "service_account";
        break;
        
      case "vmware":
        if (!newCredential.vmwareServer || !newCredential.vmwareUsername || !newCredential.vmwarePassword) {
          alert("VMware Server, Username, and Password are required");
          return;
        }
        credentialData = {
          server: newCredential.vmwareServer,
          username: newCredential.vmwareUsername,
          password: newCredential.vmwarePassword
        };
        credentialType = "basic_auth";
        break;
        
      case "proxmox":
        if (!newCredential.proxmoxServer || !newCredential.proxmoxUsername || 
            (!newCredential.proxmoxPassword && !newCredential.proxmoxToken)) {
          alert("Proxmox Server, Username, and either Password or API Token are required");
          return;
        }
        credentialData = {
          server: newCredential.proxmoxServer,
          username: newCredential.proxmoxUsername
        };
        if (newCredential.proxmoxPassword) {
          credentialData.password = newCredential.proxmoxPassword;
          credentialType = "basic_auth";
        } else {
          credentialData.token = newCredential.proxmoxToken;
          credentialType = "api_token";
        }
        break;
        
      case "harvester":
        if (!newCredential.harvesterServer || !newCredential.harvesterUsername || 
            (!newCredential.harvesterPassword && !newCredential.harvesterToken)) {
          alert("Harvester Server, Username, and either Password or API Token are required");
          return;
        }
        credentialData = {
          server: newCredential.harvesterServer,
          username: newCredential.harvesterUsername
        };
        if (newCredential.harvesterPassword) {
          credentialData.password = newCredential.harvesterPassword;
          credentialType = "basic_auth";
        } else {
          credentialData.token = newCredential.harvesterToken;
          credentialType = "api_token";
        }
        break;
        
      default:
        alert("Invalid provider selected");
        return;
    }
    
    // Create new credential
    const credential: ProviderCredential = {
      id: `${newCredential.provider}-${Date.now()}`,
      name: newCredential.name,
      provider: newCredential.provider,
      type: credentialType,
      isDefault: newCredential.isDefault,
      createdAt: new Date().toISOString(),
      data: credentialData
    };
    
    // If this is set as default, update other credentials for this provider
    let updatedCredentials = [...credentials];
    if (credential.isDefault) {
      updatedCredentials = updatedCredentials.map(cred => 
        cred.provider === credential.provider 
          ? { ...cred, isDefault: false } 
          : cred
      );
    }
    
    // Add to state
    setCredentials([...updatedCredentials, credential]);
    
    // Reset form and close dialog
    resetForm();
    setIsAddingCredential(false);
  };
  
  // Reset form
  const resetForm = () => {
    setNewCredential({
      name: "",
      provider: "",
      isDefault: true,
      awsAccessKey: "",
      awsSecretKey: "",
      azureClientId: "",
      azureClientSecret: "",
      azureSubscriptionId: "",
      azureTenantId: "",
      gcpProjectId: "",
      gcpKeyJson: "",
      vmwareServer: "",
      vmwareUsername: "",
      vmwarePassword: "",
      proxmoxServer: "",
      proxmoxUsername: "",
      proxmoxPassword: "",
      proxmoxToken: "",
      harvesterServer: "",
      harvesterUsername: "",
      harvesterPassword: "",
      harvesterToken: ""
    });
    setSelectedProvider("");
  };
  
  // Delete credential
  const deleteCredential = (credentialId: string) => {
    setCredentials(prev => prev.filter(cred => cred.id !== credentialId));
    setCredentialToDelete(null);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  // Get provider name
  const getProviderName = (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    return provider ? provider.name : providerId;
  };
  
  // Get provider logo
  const getProviderLogo = (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    return provider ? provider.logoPath : null;
  };
  
  // Render credential form fields based on selected provider
  const renderCredentialFields = () => {
    switch (selectedProvider) {
      case "aws":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="awsAccessKey">AWS Access Key</Label>
              <Input
                id="awsAccessKey"
                name="awsAccessKey"
                placeholder="AKIA..."
                value={newCredential.awsAccessKey}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="awsSecretKey">AWS Secret Key</Label>
              <div className="relative">
                <Input
                  id="awsSecretKey"
                  name="awsSecretKey"
                  type={showSecrets.awsSecret ? "text" : "password"}
                  placeholder="Enter AWS Secret Key"
                  value={newCredential.awsSecretKey}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => toggleSecretVisibility("awsSecret")}
                >
                  {showSecrets.awsSecret ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          </>
        );
        
      case "azure":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="azureClientId">Client ID</Label>
              <Input
                id="azureClientId"
                name="azureClientId"
                placeholder="11111111-1111-1111-1111-111111111111"
                value={newCredential.azureClientId}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="azureClientSecret">Client Secret</Label>
              <div className="relative">
                <Input
                  id="azureClientSecret"
                  name="azureClientSecret"
                  type={showSecrets.azureSecret ? "text" : "password"}
                  placeholder="Enter Client Secret"
                  value={newCredential.azureClientSecret}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => toggleSecretVisibility("azureSecret")}
                >
                  {showSecrets.azureSecret ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="azureSubscriptionId">Subscription ID</Label>
              <Input
                id="azureSubscriptionId"
                name="azureSubscriptionId"
                placeholder="22222222-2222-2222-2222-222222222222"
                value={newCredential.azureSubscriptionId}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="azureTenantId">Tenant ID</Label>
              <Input
                id="azureTenantId"
                name="azureTenantId"
                placeholder="33333333-3333-3333-3333-333333333333"
                value={newCredential.azureTenantId}
                onChange={handleInputChange}
              />
            </div>
          </>
        );
        
      case "gcp":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="gcpProjectId">Project ID</Label>
              <Input
                id="gcpProjectId"
                name="gcpProjectId"
                placeholder="my-gcp-project"
                value={newCredential.gcpProjectId}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gcpKeyJson">Service Account Key (JSON)</Label>
              <textarea
                id="gcpKeyJson"
                name="gcpKeyJson"
                className="w-full p-2 border rounded-md min-h-[150px]"
                placeholder="Paste your service account key JSON here"
                value={newCredential.gcpKeyJson}
                onChange={handleInputChange}
              />
            </div>
          </>
        );
        
      case "vmware":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="vmwareServer">vCenter Server</Label>
              <Input
                id="vmwareServer"
                name="vmwareServer"
                placeholder="https://vcenter.example.com"
                value={newCredential.vmwareServer}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vmwareUsername">Username</Label>
              <Input
                id="vmwareUsername"
                name="vmwareUsername"
                placeholder="administrator@vsphere.local"
                value={newCredential.vmwareUsername}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vmwarePassword">Password</Label>
              <div className="relative">
                <Input
                  id="vmwarePassword"
                  name="vmwarePassword"
                  type={showSecrets.vmwarePassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={newCredential.vmwarePassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => toggleSecretVisibility("vmwarePassword")}
                >
                  {showSecrets.vmwarePassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          </>
        );
        
      case "proxmox":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="proxmoxServer">Proxmox Server</Label>
              <Input
                id="proxmoxServer"
                name="proxmoxServer"
                placeholder="https://proxmox.example.com:8006"
                value={newCredential.proxmoxServer}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="proxmoxUsername">Username</Label>
              <Input
                id="proxmoxUsername"
                name="proxmoxUsername"
                placeholder="root@pam"
                value={newCredential.proxmoxUsername}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="proxmoxPassword">Password</Label>
              <div className="relative">
                <Input
                  id="proxmoxPassword"
                  name="proxmoxPassword"
                  type={showSecrets.proxmoxPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={newCredential.proxmoxPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => toggleSecretVisibility("proxmoxPassword")}
                >
                  {showSecrets.proxmoxPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter either a password or an API token
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="proxmoxToken">API Token</Label>
              <div className="relative">
                <Input
                  id="proxmoxToken"
                  name="proxmoxToken"
                  type={showSecrets.proxmoxToken ? "text" : "password"}
                  placeholder="Enter API token"
                  value={newCredential.proxmoxToken}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => toggleSecretVisibility("proxmoxToken")}
                >
                  {showSecrets.proxmoxToken ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          </>
        );
        
      case "harvester":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="harvesterServer">Harvester Server</Label>
              <Input
                id="harvesterServer"
                name="harvesterServer"
                placeholder="https://harvester.example.com"
                value={newCredential.harvesterServer}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="harvesterUsername">Username</Label>
              <Input
                id="harvesterUsername"
                name="harvesterUsername"
                placeholder="admin"
                value={newCredential.harvesterUsername}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="harvesterPassword">Password</Label>
              <div className="relative">
                <Input
                  id="harvesterPassword"
                  name="harvesterPassword"
                  type={showSecrets.harvesterPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={newCredential.harvesterPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => toggleSecretVisibility("harvesterPassword")}
                >
                  {showSecrets.harvesterPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter either a password or an API token
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="harvesterToken">API Token</Label>
              <div className="relative">
                <Input
                  id="harvesterToken"
                  name="harvesterToken"
                  type={showSecrets.harvesterToken ? "text" : "password"}
                  placeholder="Enter API token"
                  value={newCredential.harvesterToken}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => toggleSecretVisibility("harvesterToken")}
                >
                  {showSecrets.harvesterToken ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          </>
        );
        
      default:
        return (
          <div className="py-4 text-center text-muted-foreground">
            Please select a provider to see credential fields
          </div>
        );
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Provider Credentials</CardTitle>
          <Button onClick={() => setIsAddingCredential(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Credentials
          </Button>
        </div>
        <CardDescription>
          Manage your cloud and infrastructure provider credentials
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Default</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {credentials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No credentials configured. Add provider credentials to get started.
                </TableCell>
              </TableRow>
            ) : (
              credentials.map(cred => (
                <TableRow key={cred.id}>
                  <TableCell className="font-medium">{cred.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getProviderLogo(cred.provider) && (
                        <img 
                          src={getProviderLogo(cred.provider) || ''} 
                          alt={getProviderName(cred.provider)} 
                          className="h-5 w-5"
                        />
                      )}
                      <span>{getProviderName(cred.provider)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {cred.type === "access_key" && "Access Key"}
                    {cred.type === "service_principal" && "Service Principal"}
                    {cred.type === "service_account" && "Service Account"}
                    {cred.type === "basic_auth" && "Username/Password"}
                    {cred.type === "api_token" && "API Token"}
                  </TableCell>
                  <TableCell>{cred.isDefault ? "Yes" : "No"}</TableCell>
                  <TableCell>{formatDate(cred.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => setCredentialToDelete(cred.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Credentials</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{cred.name}"?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setCredentialToDelete(null)}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteCredential(cred.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      
      {/* Add Credential Dialog */}
      <Dialog open={isAddingCredential} onOpenChange={setIsAddingCredential}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Provider Credentials</DialogTitle>
            <DialogDescription>
              Enter authentication details for your cloud or infrastructure provider
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Credential Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Production AWS"
                value={newCredential.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <select
                id="provider"
                name="provider"
                className="w-full p-2 border rounded-md"
                value={selectedProvider}
                onChange={handleProviderChange}
              >
                <option value="" disabled>Select a provider</option>
                {providers.map(provider => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>
            
            {renderCredentialFields()}
            
            <div className="flex items-center space-x-2 mt-4">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                className="h-4 w-4 rounded border-gray-300"
                checked={newCredential.isDefault}
                onChange={handleCheckboxChange}
              />
              <Label htmlFor="isDefault">Set as default for this provider</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetForm();
              setIsAddingCredential(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddCredential}>
              Add Credentials
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
