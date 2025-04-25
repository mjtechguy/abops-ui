"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cloud, Server } from "lucide-react";

export default function CredentialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isProviderActive = pathname === "/apps/abops/credentials/provider";
  const isRancherActive = pathname === "/apps/abops/credentials/rancher";
  
  // Default to provider tab if neither is active
  const defaultTab = isRancherActive ? "rancher" : "provider";

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Credentials Management</h1>
        </div>
        
        <Tabs defaultValue={defaultTab} className="w-full">
          <div className="border-b mb-8">
            <div className="flex justify-between items-center mb-4">
              <TabsList className="bg-background border border-input shadow-sm hover:shadow-md transition-shadow">
                <Link href="/apps/abops/credentials/provider" passHref className="w-full">
                  <TabsTrigger 
                    value="provider" 
                    className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none relative px-6 py-2.5"
                    data-state={isProviderActive ? "active" : ""}
                  >
                    <Cloud className="h-5 w-5" />
                    <span className="font-medium">Provider Credentials</span>
                  </TabsTrigger>
                </Link>
                <Link href="/apps/abops/credentials/rancher" passHref className="w-full">
                  <TabsTrigger 
                    value="rancher" 
                    className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none relative px-6 py-2.5"
                    data-state={isRancherActive ? "active" : ""}
                  >
                    <Server className="h-5 w-5" />
                    <span className="font-medium">Rancher Credentials</span>
                  </TabsTrigger>
                </Link>
              </TabsList>
              
              {isProviderActive && (
                <Button className="gap-1">
                  <Cloud className="h-4 w-4" /> Add Provider Credential
                </Button>
              )}
              
              {isRancherActive && (
                <Button className="gap-1">
                  <Server className="h-4 w-4" /> Add Rancher Credential
                </Button>
              )}
            </div>
          </div>
          
          {children}
        </Tabs>
      </div>
    </div>
  );
}
