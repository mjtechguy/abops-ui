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
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <Link href="/apps/abops/credentials/provider" passHref>
              <TabsTrigger value="provider" className="flex items-center" data-state={isProviderActive ? "active" : ""}>
                <Cloud className="mr-2 h-4 w-4" />
                Provider Credentials
              </TabsTrigger>
            </Link>
            <Link href="/apps/abops/credentials/rancher" passHref>
              <TabsTrigger value="rancher" className="flex items-center" data-state={isRancherActive ? "active" : ""}>
                <Server className="mr-2 h-4 w-4" />
                Rancher Credentials
              </TabsTrigger>
            </Link>
          </TabsList>
          
          {children}
        </Tabs>
      </div>
    </div>
  );
}
