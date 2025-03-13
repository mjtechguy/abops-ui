"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Plus, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Edit,
  Trash2,
  MoreVertical
} from "lucide-react";
import { clusters } from "@/data/clusters";

export default function ManageClusters() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter clusters based on active tab and search query
  const filteredClusters = clusters.filter(cluster => {
    const matchesTab = activeTab === "all" || cluster.status === activeTab;
    const matchesSearch = cluster.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cluster.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cluster.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Helper function to render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="mr-1 h-3 w-3" /> Healthy</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600"><AlertTriangle className="mr-1 h-3 w-3" /> Warning</Badge>;
      case "unhealthy":
        return <Badge className="bg-red-500 hover:bg-red-600"><XCircle className="mr-1 h-3 w-3" /> Unhealthy</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">Manage Clusters</h1>
        <p className="text-muted-foreground">
          Create, update, and delete Kubernetes clusters across different providers.
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clusters..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="gap-1" onClick={() => window.location.href = "/apps/abops/clusters/create"}>
          <Plus className="h-4 w-4" />
          Create Cluster
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle>Kubernetes Clusters</CardTitle>
              <CardDescription>
                Manage your Kubernetes clusters across different cloud providers.
              </CardDescription>
            </div>
            <Tabs defaultValue="all" className="w-[400px]" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Clusters</TabsTrigger>
                <TabsTrigger value="healthy">Healthy</TabsTrigger>
                <TabsTrigger value="warning">Warning</TabsTrigger>
                <TabsTrigger value="unhealthy">Unhealthy</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Nodes</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Resource Usage</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClusters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No clusters found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredClusters.map((cluster) => (
                  <TableRow key={cluster.id}>
                    <TableCell className="font-medium">{cluster.name}</TableCell>
                    <TableCell>{renderStatusBadge(cluster.status)}</TableCell>
                    <TableCell className="capitalize">{cluster.provider}</TableCell>
                    <TableCell className="uppercase">{cluster.type}</TableCell>
                    <TableCell>{cluster.nodes}</TableCell>
                    <TableCell>{cluster.region}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-10">CPU</span>
                        <Progress value={cluster.cpu} className="h-2 w-24" />
                        <span className="text-xs">{cluster.cpu}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
