'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertCircle, 
  Check, 
  Copy, 
  Edit, 
  MoreHorizontal, 
  Plus, 
  Server, 
  Trash2 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase/client';

// Define template interface
interface ClusterTemplate {
  id: string;
  name: string;
  description?: string;
  provider: string;
  k8s_distribution: string;
  k8s_version: string;
  region: string;
  os: string;
  os_version: string;
  storage_engine: string;
  storage_version: string;
  node_pools: Array<any>; // Could be more specific based on your node pool structure
  addons: Array<any>; // Could be more specific based on your addon structure
  security_options?: any;
  created_at: string;
  updated_at: string;
}

export default function ClusterTemplatesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [templates, setTemplates] = useState<ClusterTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSavedAlert, setShowSavedAlert] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<ClusterTemplate | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [templateToRename, setTemplateToRename] = useState<ClusterTemplate | null>(null);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDescription, setNewTemplateDescription] = useState('');
  const [renameError, setRenameError] = useState('');
  const [renameLoading, setRenameLoading] = useState(false);

  useEffect(() => {
    // Check if we just saved a template
    if (searchParams.get('saved') === 'true') {
      setShowSavedAlert(true);
      // Remove the query parameter without refreshing the page
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      
      // Hide the alert after 5 seconds
      setTimeout(() => {
        setShowSavedAlert(false);
      }, 5000);
    }
    
    fetchTemplates();
  }, [searchParams]);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cluster_templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setError('Failed to load templates. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    router.push('/apps/abops/clusters/create');
  };

  const handleUseTemplate = (template: ClusterTemplate) => {
    // In a real app, this would pre-fill the create form with template values
    router.push(`/apps/abops/clusters/create?template=${template.id}`);
  };

  const handleEditTemplate = (template: ClusterTemplate) => {
    // Navigate to edit template page
    router.push(`/apps/abops/clusters/templates/edit/${template.id}`);
  };

  const openDeleteDialog = (template: ClusterTemplate) => {
    setTemplateToDelete(template);
    setDeleteDialogOpen(true);
    setDeleteError('');
  };

  const handleDeleteTemplate = async () => {
    if (!templateToDelete) return;
    
    setDeleteLoading(true);
    try {
      const { error } = await supabase
        .from('cluster_templates')
        .delete()
        .eq('id', templateToDelete.id);
      
      if (error) {
        throw error;
      }
      
      // Close dialog and refresh templates
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      setDeleteError('Failed to delete template. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openRenameDialog = (template: ClusterTemplate) => {
    setTemplateToRename(template);
    setNewTemplateName(template.name);
    setNewTemplateDescription(template.description || '');
    setRenameDialogOpen(true);
    setRenameError('');
  };

  const handleRenameTemplate = async () => {
    if (!templateToRename) return;
    
    if (!newTemplateName.trim()) {
      setRenameError('Template name is required');
      return;
    }
    
    setRenameLoading(true);
    try {
      const { error } = await supabase
        .from('cluster_templates')
        .update({ 
          name: newTemplateName,
          description: newTemplateDescription,
          updated_at: new Date().toISOString()
        })
        .eq('id', templateToRename.id);
      
      if (error) {
        throw error;
      }
      
      // Close dialog and refresh templates
      setRenameDialogOpen(false);
      setTemplateToRename(null);
      fetchTemplates();
    } catch (error) {
      console.error('Error updating template:', error);
      setRenameError('Failed to update template. Please try again.');
    } finally {
      setRenameLoading(false);
    }
  };

  const getProviderLabel = (providerId: string) => {
    const providers: Record<string, string> = {
      aws: 'AWS',
      gcp: 'GCP',
      azure: 'Azure',
      digitalocean: 'DigitalOcean',
      linode: 'Linode',
      vultr: 'Vultr',
      openstack: 'OpenStack',
      onprem: 'On-Premise'
    };
    return providers[providerId] || providerId;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Cluster Templates</h1>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" /> Create New Cluster
        </Button>
      </div>

      {showSavedAlert && (
        <Alert className="bg-green-50 border-green-500">
          <Check className="h-4 w-4 text-green-500" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Template saved successfully.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : templates.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center p-6 h-64">
            <p className="text-muted-foreground mb-4">No templates found</p>
            <Button onClick={handleCreateNew}>
              <Plus className="mr-2 h-4 w-4" /> Create Your First Cluster
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{template.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {template.description || 'No description provided'}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleUseTemplate(template)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Use Template
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openRenameDialog(template)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openDeleteDialog(template)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="bg-blue-50">
                    {getProviderLabel(template.provider)}
                  </Badge>
                  <Badge variant="outline" className="bg-green-50">
                    {template.k8s_distribution} {template.k8s_version}
                  </Badge>
                  {template.node_pools && (
                    <Badge variant="outline" className="bg-purple-50">
                      {template.node_pools.length} Node Pool{template.node_pools.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Created {new Date(template.created_at).toLocaleDateString()}
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleUseTemplate(template)}
                >
                  <Server className="mr-2 h-4 w-4" /> Use Template
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{templateToDelete?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deleteError && (
            <p className="text-sm text-red-500">{deleteError}</p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTemplate}
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Deleting...' : 'Delete Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Template Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>
              Update the name and description for this template.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rename-template-name">Template Name</Label>
              <Input
                id="rename-template-name"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                placeholder="Enter a name for this template"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rename-template-description">Description</Label>
              <Input
                id="rename-template-description"
                value={newTemplateDescription}
                onChange={(e) => setNewTemplateDescription(e.target.value)}
                placeholder="Briefly describe this template"
              />
            </div>
            {renameError && (
              <p className="text-sm text-red-500">{renameError}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRenameDialogOpen(false)}
              disabled={renameLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRenameTemplate}
              disabled={renameLoading}
            >
              {renameLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
