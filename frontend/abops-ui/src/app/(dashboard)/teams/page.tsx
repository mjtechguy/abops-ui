"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { dataService } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Plus, Pencil, Trash2 } from "lucide-react";

interface Team {
  id: string;
  name: string;
  description: string | null;
  organization_id: string;
  organization_name: string;
  created_at: string;
  updated_at: string;
}

interface Organization {
  id: string;
  name: string;
}

export default function TeamsPage() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchOrganizations = async () => {
      if (!user) return;

      try {
        // Get organizations from mock data service
        // Check Supabase connection first
        const { connected, error: connectionError } = await dataService.checkConnection();
        
        if (!connected) {
            console.error("Database connection error:", connectionError);
            toast.error(connectionError?.message || 'Failed to connect to database');
            setIsLoading(false);
            return;
        }
        
        const { data: orgsData, error } = await dataService.getOrganizations();
        
        if (error) throw error;
        
        // Transform to just include id and name
        const simplifiedOrgs = orgsData.map(org => ({
          id: org.id,
          name: org.name
        }));
        
        setOrganizations(simplifiedOrgs || []);
        
        // Set the first organization as selected by default
        if (simplifiedOrgs.length > 0 && !selectedOrgId) {
          setSelectedOrgId(simplifiedOrgs[0].id);
        }
      } catch (error) {
        console.error("Error fetching organizations:", error);
        toast.error("Failed to load organizations");
      }
    };

    fetchOrganizations();
  }, [user, selectedOrgId]);

  useEffect(() => {
    const fetchTeams = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // Check Supabase connection first
        const { connected, error: connectionError } = await dataService.checkConnection();
        
        if (!connected) {
            console.error("Database connection error:", connectionError);
            toast.error(connectionError?.message || "Failed to connect to database");
            setIsLoading(false);
            return;
        }

        // Get teams from data service
        const { data: allTeams, error } = await dataService.getTeams();
        
        if (error) throw error;
        
        // Get organization names for each team
        const { data: orgs } = await dataService.getOrganizations();
        
        // Transform the data to include organization name
        const transformedTeams = allTeams.map((team) => {
          const org = orgs.find(o => o.id === team.organization_id);
          return {
            ...team,
            organization_name: org ? org.name : 'Unknown Organization'
          };
        });
        
        // Filter by selected organization if one is selected
        const filteredTeams = selectedOrgId 
          ? transformedTeams.filter(team => team.organization_id === selectedOrgId)
          : transformedTeams;
          
        setTeams(filteredTeams);
      } catch (error) {
        console.error("Error fetching teams:", error);
        toast.error("Failed to load teams");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, [user, selectedOrgId]);

  const handleCreateTeam = async () => {
    if (!user || !selectedOrgId) {
      toast.error("Please select an organization");
      return;
    }
    
    if (!newTeamName.trim()) {
      toast.error("Team name is required");
      return;
    }

    setIsCreating(true);
    try {
      // For development, create a mock team with a random ID
      const org = organizations.find((o) => o.id === selectedOrgId);
      
      const newTeam = {
        id: Math.random().toString(36).substring(2, 11),
        name: newTeamName.trim(),
        description: newTeamDescription.trim() || null,
        organization_id: selectedOrgId,
        organization_name: org ? org.name : "Unknown",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setTeams([...teams, newTeam]);
      setNewTeamName("");
      setNewTeamDescription("");
      setShowCreateDialog(false);
      toast.success("Team created successfully");
    } catch (error) {
      console.error("Error creating team:", error);
      toast.error("Failed to create team");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!selectedTeam) return;

    setIsDeleting(true);
    try {
      // For development, just remove the team from the local state
      setTeams(teams.filter((team) => team.id !== selectedTeam.id));
      setSelectedTeam(null);
      setShowDeleteDialog(false);
      toast.success("Team deleted successfully");
    } catch (error) {
      console.error("Error deleting team:", error);
      toast.error("Failed to delete team");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground">
            Manage your teams and their members.
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Team</DialogTitle>
              <DialogDescription>
                Add a new team to your organization.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Select
                  value={selectedOrgId}
                  onValueChange={setSelectedOrgId}
                >
                  <SelectTrigger id="organization">
                    <SelectValue placeholder="Select an organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Team name"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  id="description"
                  placeholder="Brief description"
                  value={newTeamDescription}
                  onChange={(e) => setNewTeamDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateTeam} disabled={isCreating}>
                {isCreating ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {organizations.length > 0 && (
          <div>
            <Label htmlFor="filter-organization">Filter by Organization</Label>
            <Select
              value={selectedOrgId}
              onValueChange={setSelectedOrgId}
            >
              <SelectTrigger id="filter-organization" className="w-[250px]">
                <SelectValue placeholder="Select an organization" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-lg bg-muted"></div>
            ))}
          </div>
        ) : teams.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Teams</CardTitle>
              <CardDescription>
                You don't have any teams yet. Create your first team to get started.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Team
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Your Teams</CardTitle>
              <CardDescription>
                Teams you are a member of.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{team.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{team.organization_name}</TableCell>
                      <TableCell>{team.description || "-"}</TableCell>
                      <TableCell>
                        {new Date(team.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/teams/${team.id}`}>
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedTeam(team);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Team</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this team? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>
              <strong>Team:</strong> {selectedTeam?.name}
            </p>
            <p>
              <strong>Organization:</strong> {selectedTeam?.organization_name}
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTeam}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
