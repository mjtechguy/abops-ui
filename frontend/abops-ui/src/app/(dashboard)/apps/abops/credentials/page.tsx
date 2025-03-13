"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Key } from "lucide-react";

export default function Credentials() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">Cloud Credentials</h1>
        <p className="text-muted-foreground">
          Manage your cloud provider credentials for deploying and managing Kubernetes clusters.
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          Add Credentials
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Provider Credentials</CardTitle>
          <CardDescription>
            This page is under development. You will be able to manage your cloud provider credentials here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
            <div className="text-center">
              <Key className="mx-auto h-10 w-10 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">No Credentials Yet</h3>
              <p className="text-sm text-muted-foreground">
                Add your first cloud provider credentials to start deploying clusters.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
