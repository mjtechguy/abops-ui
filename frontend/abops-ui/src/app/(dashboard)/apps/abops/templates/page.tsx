"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";

export default function Templates() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">Cluster Templates</h1>
        <p className="text-muted-foreground">
          Create and manage templates for quickly deploying standardized Kubernetes clusters.
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          Create Template
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Templates</CardTitle>
          <CardDescription>
            This page is under development. You will be able to manage your cluster templates here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
            <div className="text-center">
              <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">No Templates Yet</h3>
              <p className="text-sm text-muted-foreground">
                Create your first template to standardize cluster deployments.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
