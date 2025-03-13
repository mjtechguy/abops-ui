"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Server, 
  Cpu, 
  HardDrive, 
  Database,
  CloudRain,
  Cloud,
  Box
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { clusters, clusterStats } from "@/data/clusters";



export default function ClusterDashboard() {
  const [activeTab, setActiveTab] = useState("all");
  
  // Filter clusters based on active tab
  const filteredClusters = activeTab === "all" 
    ? clusters 
    : clusters.filter(cluster => cluster.status === activeTab);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">ABOps Cluster Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage your Kubernetes clusters across different providers.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clusters</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clusterStats.total}</div>
            <p className="text-xs text-muted-foreground">
              Across multiple providers and regions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clusterStats.healthy}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((clusterStats.healthy / clusterStats.total) * 100)}% of total clusters
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warning</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clusterStats.warning}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((clusterStats.warning / clusterStats.total) * 100)}% of total clusters
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unhealthy</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clusterStats.unhealthy}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((clusterStats.unhealthy / clusterStats.total) * 100)}% of total clusters
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Resource Usage</CardTitle>
            <CardDescription>
              Average resource utilization across all clusters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Cpu className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>CPU Usage</span>
                </div>
                <span className="font-medium">{clusterStats.resourceUsage.cpu}%</span>
              </div>
              <Progress value={clusterStats.resourceUsage.cpu} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Database className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Memory Usage</span>
                </div>
                <span className="font-medium">{clusterStats.resourceUsage.memory}%</span>
              </div>
              <Progress value={clusterStats.resourceUsage.memory} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <HardDrive className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Storage Usage</span>
                </div>
                <span className="font-medium">{clusterStats.resourceUsage.storage}%</span>
              </div>
              <Progress value={clusterStats.resourceUsage.storage} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Cluster Distribution</CardTitle>
            <CardDescription>
              By provider and type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 text-sm font-medium">By Provider</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span className="text-xs">AWS ({clusters.filter(c => c.provider === 'aws').length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-xs">GCP ({clusters.filter(c => c.provider === 'gcp').length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    <span className="text-xs">Harvester ({clusters.filter(c => c.provider === 'harvester').length})</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="mb-2 text-sm font-medium">By Type</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                    <span className="text-xs">RKE2 ({clusters.filter(c => c.type === 'rke2').length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <span className="text-xs">K3s ({clusters.filter(c => c.type === 'k3s').length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <span className="text-xs">Vanilla ({clusters.filter(c => c.type === 'vanilla').length})</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Kubernetes Clusters</CardTitle>
          <CardDescription>
            List of all your Kubernetes clusters across different providers
          </CardDescription>
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 lg:w-auto">
              <TabsTrigger value="all">All ({clusters.length})</TabsTrigger>
              <TabsTrigger value="healthy">Healthy ({clusters.filter(c => c.status === 'healthy').length})</TabsTrigger>
              <TabsTrigger value="warning">Warning ({clusters.filter(c => c.status === 'warning').length})</TabsTrigger>
              <TabsTrigger value="unhealthy">Unhealthy ({clusters.filter(c => c.status === 'unhealthy').length})</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2.5 text-xs font-medium">
              <div className="col-span-3">Name</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Provider</div>
              <div className="col-span-1">Type</div>
              <div className="col-span-1">Nodes</div>
              <div className="col-span-3">Resource Usage</div>
            </div>
            <div className="divide-y">
              {filteredClusters.map(cluster => (
                <div key={cluster.id} className="grid grid-cols-12 items-center px-4 py-3">
                  <div className="col-span-3 font-medium">{cluster.name}</div>
                  <div className="col-span-2">
                    {cluster.status === 'healthy' && (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        <CheckCircle className="mr-1 h-3 w-3" /> Healthy
                      </Badge>
                    )}
                    {cluster.status === 'warning' && (
                      <Badge className="bg-yellow-500 hover:bg-yellow-600">
                        <AlertTriangle className="mr-1 h-3 w-3" /> Warning
                      </Badge>
                    )}
                    {cluster.status === 'unhealthy' && (
                      <Badge className="bg-red-500 hover:bg-red-600">
                        <XCircle className="mr-1 h-3 w-3" /> Unhealthy
                      </Badge>
                    )}
                    {!['healthy', 'warning', 'unhealthy'].includes(cluster.status) && (
                      <Badge>
                        <span className="capitalize">{cluster.status}</span>
                      </Badge>
                    )}
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5">
                    {cluster.provider === 'aws' && <Cloud className="h-4 w-4 text-blue-500" />}
                    {cluster.provider === 'gcp' && <CloudRain className="h-4 w-4 text-green-500" />}
                    {cluster.provider === 'harvester' && <Box className="h-4 w-4 text-purple-500" />}
                    <span className="capitalize">{cluster.provider}</span>
                  </div>
                  <div className="col-span-1">
                    <span className="capitalize">{cluster.type}</span>
                  </div>
                  <div className="col-span-1">{cluster.nodes}</div>
                  <div className="col-span-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">CPU:</span>
                      <Progress value={cluster.cpu} className="h-1.5 flex-1" />
                      <span className="text-xs">{cluster.cpu}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
