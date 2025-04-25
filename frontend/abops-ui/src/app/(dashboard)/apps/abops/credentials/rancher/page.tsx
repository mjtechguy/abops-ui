"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { rancherServersService, rancherCredentialsService } from "@/services/credentials";
import { toast } from "sonner";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
// Define types for our Rancher servers and credentials
interface RancherServer {
  id: string;
  name: string;
  address: string;
  description?: string;
  createdAt: string;
}

interface RancherCredential {
  id: string;
  serverId: string;
  username: string;
  password?: string;
  token?: string;
  isDefault: boolean;
  createdAt: string;
}
import { PlusCircle, Trash2, Edit, Eye, EyeOff, Server, Key } from "lucide-react";

export default function RancherCredentialsPage() {
  const router = useRouter();
  const [servers, setServers] = useState<RancherServer[]>([]);
  const [credentials, setCredentials] = useState<RancherCredential[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Function to get server by ID
  const getRancherServerById = (id: string): RancherServer | undefined => {
    return servers.find(server => server.id === id);
  };
  
  // Fetch Rancher servers and credentials from the database
  useEffect(() => {
    const fetchRancherData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch Rancher servers
        const serversData = await rancherServersService.getAll();
        
        // Transform the servers data
        const transformedServers = serversData.map((server: any) => ({
          id: server.id || '',
          name: server.name,
          address: server.address,
          description: server.description,
          createdAt: server.created_at || new Date().toISOString()
        }));
        
        setServers(transformedServers);
        
        // Fetch Rancher credentials
        const credentialsData = await rancherCredentialsService.getAll();
        
        // Transform the credentials data
        const transformedCredentials = credentialsData.map((cred: any) => ({
          id: cred.id || '',
          serverId: cred.server_id,
          username: cred.username,
          password: cred.password,
          token: cred.token,
          isDefault: cred.is_default || false,
          createdAt: cred.created_at || new Date().toISOString()
        }));
        
        setCredentials(transformedCredentials);
      } catch (err: any) {
        console.error('Error fetching Rancher data:', err);
        // Only set error for actual errors, not for empty data
        if (err?.message !== 'No data returned from the query.') {
          setError('Failed to load Rancher servers and credentials');
          toast.error('Failed to load Rancher servers and credentials');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchRancherData();
  }, []);
  
  // New server form state
  const [isAddingServer, setIsAddingServer] = useState(false);
  const [newServer, setNewServer] = useState({
    name: "",
    address: "",
    description: ""
  });
  
  // New credential form state
  const [isAddingCredential, setIsAddingCredential] = useState(false);
  const [newCredential, setNewCredential] = useState({
    serverId: "",
    username: "",
    password: "",
    token: "",
    isDefault: true
  });
  
  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [showToken, setShowToken] = useState(false);
  
  // Delete confirmation state
  const [serverToDelete, setServerToDelete] = useState<string | null>(null);
  const [credentialToDelete, setCredentialToDelete] = useState<string | null>(null);
  
  // Handle server form input changes
  const handleServerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewServer(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle credential form input changes
  const handleCredentialInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewCredential(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewCredential(prev => ({ ...prev, [name]: checked }));
  };
  
  // Add new server
  const handleAddServer = () => {
    // Validate form
    if (!newServer.name || !newServer.address) {
      alert("Server name and address are required");
      return;
    }
    
    // Create new server
    const server: RancherServer = {
      id: `rancher-${Date.now()}`,
      name: newServer.name,
      address: newServer.address,
      description: newServer.description,
      createdAt: new Date().toISOString()
    };
    
    // Add to state
    setServers(prev => [...prev, server]);
    
    // Reset form
    setNewServer({
      name: "",
      address: "",
      description: ""
    });
    setIsAddingServer(false);
  };
  
  // Add new credential
  const handleAddCredential = () => {
    // Validate form
    if (!newCredential.serverId) {
      alert("Please select a server");
      return;
    }
    
    if (!newCredential.username || (!newCredential.password && !newCredential.token)) {
      alert("Username and either password or token are required");
      return;
    }
    
    // Create new credential
    const credential: RancherCredential = {
      id: `rancher-cred-${Date.now()}`,
      serverId: newCredential.serverId,
      username: newCredential.username,
      password: newCredential.password || undefined,
      token: newCredential.token || undefined,
      isDefault: newCredential.isDefault,
      createdAt: new Date().toISOString()
    };
    
    // If this is set as default, update other credentials for this server
    let updatedCredentials = [...credentials];
    if (credential.isDefault) {
      updatedCredentials = updatedCredentials.map(cred => 
        cred.serverId === credential.serverId 
          ? { ...cred, isDefault: false } 
          : cred
      );
    }
    
    // Add to state
    setCredentials([...updatedCredentials, credential]);
    
    // Reset form
    setNewCredential({
      serverId: "",
      username: "",
      password: "",
      token: "",
      isDefault: true
    });
    setIsAddingCredential(false);
  };
  
  // Delete server
  const deleteServer = (serverId: string) => {
    // Remove server
    setServers(prev => prev.filter(server => server.id !== serverId));
    
    // Remove associated credentials
    setCredentials(prev => prev.filter(cred => cred.serverId !== serverId));
    
    // Reset state
    setServerToDelete(null);
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
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rancher Management Servers</h1>
      </div>
      
      <Tabs defaultValue="servers" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="servers">Servers</TabsTrigger>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
        </TabsList>
        
        {/* Servers Tab */}
        <TabsContent value="servers">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Rancher Servers</CardTitle>
                <Button onClick={() => setIsAddingServer(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Server
                </Button>
              </div>
              <CardDescription>
                Manage your Rancher management server connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                          <p>Loading Rancher servers...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : servers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-12">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <div className="rounded-full bg-muted p-3">
                            <Server className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <h3 className="text-lg font-medium">No Rancher servers yet</h3>
                          <p className="text-sm text-muted-foreground text-center max-w-sm">
                            You haven't added any Rancher servers yet. Add your first Rancher server to start managing clusters.
                          </p>
                          <Button onClick={() => setIsAddingServer(true)} className="mt-2">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Rancher Server
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    servers.map(server => (
                      <TableRow key={server.id}>
                        <TableCell className="font-medium">{server.name}</TableCell>
                        <TableCell>{server.address}</TableCell>
                        <TableCell>{server.description || "-"}</TableCell>
                        <TableCell>{formatDate(server.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => setServerToDelete(server.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Server</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{server.name}"? This will also delete all associated credentials.
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setServerToDelete(null)}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteServer(server.id)}>
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
          </Card>
          
          {/* Add Server Dialog */}
          <Dialog open={isAddingServer} onOpenChange={setIsAddingServer}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Rancher Server</DialogTitle>
                <DialogDescription>
                  Enter the details for your Rancher management server
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Server Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Production Rancher"
                    value={newServer.name}
                    onChange={handleServerInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Server Address</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="https://rancher.example.com"
                    value={newServer.address}
                    onChange={handleServerInputChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Include the full URL with protocol (https://)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="Production environment Rancher server"
                    value={newServer.description}
                    onChange={handleServerInputChange}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingServer(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddServer}>
                  Add Server
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        {/* Credentials Tab */}
        <TabsContent value="credentials">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Rancher Credentials</CardTitle>
                <Button 
                  onClick={() => setIsAddingCredential(true)}
                  disabled={servers.length === 0}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Credentials
                </Button>
              </div>
              <CardDescription>
                Manage authentication credentials for your Rancher servers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Server</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Authentication</TableHead>
                    <TableHead>Default</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                          <p>Loading Rancher credentials...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : credentials.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-12">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <div className="rounded-full bg-muted p-3">
                            <Key className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <h3 className="text-lg font-medium">No Rancher credentials yet</h3>
                          <p className="text-sm text-muted-foreground text-center max-w-sm">
                            You haven't added any Rancher credentials yet. Add credentials to authenticate with your Rancher servers.
                          </p>
                          <Button 
                            onClick={() => setIsAddingCredential(true)} 
                            className="mt-2"
                            disabled={servers.length === 0}
                          >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Rancher Credential
                          </Button>
                          {servers.length === 0 && (
                            <p className="text-xs text-muted-foreground mt-2">
                              You need to add a Rancher server first before adding credentials.
                            </p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    credentials.map(cred => {
                      const server = getRancherServerById(cred.serverId);
                      return (
                        <TableRow key={cred.id}>
                          <TableCell className="font-medium">{server?.name || "Unknown Server"}</TableCell>
                          <TableCell>{cred.username}</TableCell>
                          <TableCell>{cred.password ? "Password" : cred.token ? "API Token" : "None"}</TableCell>
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
                                    Are you sure you want to delete these credentials for {server?.name || "Unknown Server"}?
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
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {/* Add Credential Dialog */}
          <Dialog open={isAddingCredential} onOpenChange={setIsAddingCredential}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Rancher Credentials</DialogTitle>
                <DialogDescription>
                  Enter authentication details for your Rancher server
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="serverId">Rancher Server</Label>
                  <select
                    id="serverId"
                    name="serverId"
                    className="w-full p-2 border rounded-md"
                    value={newCredential.serverId}
                    onChange={handleCredentialInputChange}
                  >
                    <option value="" disabled>Select a server</option>
                    {servers.map(server => (
                      <option key={server.id} value={server.id}>
                        {server.name} ({server.address})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="admin"
                    value={newCredential.username}
                    onChange={handleCredentialInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={newCredential.password}
                      onChange={handleCredentialInputChange}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
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
                  <Label htmlFor="token">API Token</Label>
                  <div className="relative">
                    <Input
                      id="token"
                      name="token"
                      type={showToken ? "text" : "password"}
                      placeholder="Enter API token"
                      value={newCredential.token}
                      onChange={handleCredentialInputChange}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowToken(!showToken)}
                    >
                      {showToken ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={newCredential.isDefault}
                    onChange={handleCheckboxChange}
                  />
                  <Label htmlFor="isDefault">Set as default for this server</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingCredential(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCredential}>
                  Add Credentials
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
}
