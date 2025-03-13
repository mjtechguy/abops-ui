"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Image, Palette, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useBranding } from "@/contexts/env-branding-context";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
// Import alert components with the correct path
import { Alert, AlertDescription, AlertTitle } from "../../../../components/ui/alert";

export function BrandingSettings() {
  const { branding, isLoading: contextLoading, updateSiteName, uploadLogo, uploadFavicon, updateColors, resetLogo, resetFavicon } = useBranding();
  
  const [siteName, setSiteName] = useState(branding.siteName);
  const [logo, setLogo] = useState<File | null>(null);
  const [favicon, setFavicon] = useState<File | null>(null);
  const [primaryColor, setPrimaryColor] = useState(branding.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(branding.secondaryColor);
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(branding.logoUrl);
  const [faviconPreviewUrl, setFaviconPreviewUrl] = useState<string | null>(branding.faviconUrl);
  const [error, setError] = useState<string | null>(null);
  const [storageStatus, setStorageStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  
  // Update local state when branding context changes
  useEffect(() => {
    setSiteName(branding.siteName);
    setPrimaryColor(branding.primaryColor);
    setSecondaryColor(branding.secondaryColor);
    setLogoPreviewUrl(branding.logoUrl);
    setFaviconPreviewUrl(branding.faviconUrl);
  }, [branding]);
  
  // Set storage status to OK since we're using local file system
  useEffect(() => {
    setStorageStatus('ok');
    console.log("Using local file system for branding assets");
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(file);
      // Create a preview URL
      setLogoPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFavicon(file);
      // Create a preview URL
      setFaviconPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleResetLogo = async () => {
    try {
      setIsLoading(true);
      await resetLogo();
      setLogo(null);
      setLogoPreviewUrl(null);
      toast.success("Logo reset to default");
    } catch (error) {
      console.error("Error resetting logo:", error);
      toast.error("Failed to reset logo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFavicon = async () => {
    try {
      setIsLoading(true);
      await resetFavicon();
      setFavicon(null);
      setFaviconPreviewUrl(null);
      toast.success("Favicon reset to default");
    } catch (error) {
      console.error("Error resetting favicon:", error);
      toast.error("Failed to reset favicon");
    } finally {
      setIsLoading(false);
    }
  };

  const previewChanges = () => {
    // Apply the colors temporarily to preview
    document.documentElement.style.setProperty('--primary', primaryColor);
    document.documentElement.style.setProperty('--secondary', secondaryColor);
    toast.info("Theme colors previewed. Save changes to apply permanently.");
  };

  const saveChanges = async () => {
    setIsLoading(true);
    setError(null);
    try {
      
      // Update site name
      await updateSiteName(siteName);
      console.log("Site name updated successfully");
      
      // Upload logo if a new one is selected
      if (logo) {
        console.log("Uploading logo...");
        const logoUrl = await uploadLogo(logo);
        console.log("Logo uploaded successfully:", logoUrl);
        
        // In a real implementation, we would save the file to the public directory
        // and update the .env.local file with the new path
        console.log("Note: In production, you would save this file to public/branding/logo.png");
        console.log("and update NEXT_PUBLIC_LOGO_PATH in .env.local");
      }
      
      // Upload favicon if a new one is selected
      if (favicon) {
        console.log("Uploading favicon...");
        const faviconUrl = await uploadFavicon(favicon);
        console.log("Favicon uploaded successfully:", faviconUrl);
        
        // In a real implementation, we would save the file to the public directory
        // and update the .env.local file with the new path
        console.log("Note: In production, you would save this file to public/branding/favicon.ico");
        console.log("and update NEXT_PUBLIC_FAVICON_PATH in .env.local");
      }
      
      // Update theme colors
      await updateColors(primaryColor, secondaryColor);
      console.log("Theme colors updated successfully");
      
      // In a real implementation, we would update the .env.local file with the new colors
      console.log("Note: In production, you would update NEXT_PUBLIC_PRIMARY_COLOR and");
      console.log("NEXT_PUBLIC_SECONDARY_COLOR in .env.local");
      
      // Clear file selections after successful upload
      setLogo(null);
      setFavicon(null);
      
      toast.success("Branding settings saved successfully");
    } catch (error: any) {
      console.error("Error saving branding settings:", error);
      setError(error.message || 'Unknown error');
      toast.error(`Failed to save branding settings: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branding Settings</CardTitle>
        <CardDescription>
          Customize your application's branding elements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        {storageStatus === 'checking' && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking storage configuration...
          </div>
        )}
        
        {storageStatus === 'error' && !error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Storage Error</AlertTitle>
            <AlertDescription>
              There was a problem connecting to the storage service. Logo and favicon uploads may not work.
            </AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="site-name">Site Name</Label>
          <Input 
            id="site-name" 
            value={siteName} 
            onChange={(e) => setSiteName(e.target.value)} 
          />
          <p className="text-sm text-muted-foreground mt-1">
            This name will appear in the navigation bar and browser title
          </p>
        </div>
        
        <div className="space-y-3">
          <Label>Logo</Label>
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 border rounded-md p-2 w-24 h-24 flex items-center justify-center bg-muted/20">
              {logoPreviewUrl ? (
                <img 
                  src={logoPreviewUrl} 
                  alt="Logo preview" 
                  className="max-h-full max-w-full object-contain" 
                />
              ) : (
                <Image className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="logo-upload">
                  <Button type="button" variant="outline" size="sm" className="w-fit" asChild>
                    <div>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Logo
                    </div>
                  </Button>
                  <input 
                    id="logo-upload" 
                    type="file" 
                    accept="image/png,image/jpeg,image/svg+xml" 
                    className="sr-only" 
                    onChange={handleLogoUpload}
                  />
                </label>
                <p className="text-xs text-muted-foreground">
                  Recommended size: 512x512px. PNG or SVG format.
                </p>
              </div>
              {logoPreviewUrl && (
                <div className="flex items-center gap-2 mt-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={handleResetLogo}
                    disabled={isLoading}
                  >
                    Reset to Default
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <Label>Favicon</Label>
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 border rounded-md p-2 w-16 h-16 flex items-center justify-center bg-muted/20">
              {faviconPreviewUrl ? (
                <img 
                  src={faviconPreviewUrl} 
                  alt="Favicon preview" 
                  className="max-h-full max-w-full object-contain" 
                />
              ) : (
                <Image className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="favicon-upload">
                  <Button type="button" variant="outline" size="sm" className="w-fit" asChild>
                    <div>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Favicon
                    </div>
                  </Button>
                  <input 
                    id="favicon-upload" 
                    type="file" 
                    accept="image/png,image/x-icon,image/svg+xml" 
                    className="sr-only" 
                    onChange={handleFaviconUpload}
                  />
                </label>
                <p className="text-xs text-muted-foreground">
                  Recommended size: 32x32px or 64x64px. ICO, PNG or SVG format.
                </p>
              </div>
              {faviconPreviewUrl && (
                <div className="flex items-center gap-2 mt-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={handleResetFavicon}
                    disabled={isLoading}
                  >
                    Reset to Default
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <Label>Theme Colors</Label>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary-color" className="text-sm">Primary Color</Label>
                <div className="flex gap-2">
                  <div 
                    className="w-10 h-10 rounded-md border"
                    style={{ backgroundColor: primaryColor }}
                  ></div>
                  <Input 
                    id="primary-color" 
                    value={primaryColor} 
                    onChange={(e) => setPrimaryColor(e.target.value)} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary-color" className="text-sm">Secondary Color</Label>
                <div className="flex gap-2">
                  <div 
                    className="w-10 h-10 rounded-md border"
                    style={{ backgroundColor: secondaryColor }}
                  ></div>
                  <Input 
                    id="secondary-color" 
                    value={secondaryColor} 
                    onChange={(e) => setSecondaryColor(e.target.value)} 
                  />
                </div>
              </div>
            </div>
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={previewChanges}
              >
                <Palette className="h-4 w-4" />
                Preview Changes
              </Button>
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <Button 
            onClick={saveChanges} 
            disabled={isLoading || contextLoading}
          >
            {isLoading || contextLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Branding Changes"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
