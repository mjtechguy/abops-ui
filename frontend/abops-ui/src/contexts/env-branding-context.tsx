"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

type BrandingSettings = {
  siteName: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
};

type BrandingContextType = {
  branding: BrandingSettings;
  isLoading: boolean;
  updateSiteName: (name: string) => Promise<void>;
  uploadLogo: (file: File) => Promise<string>;
  uploadFavicon: (file: File) => Promise<string>;
  updateColors: (primaryColor: string, secondaryColor: string) => Promise<void>;
  resetLogo: () => Promise<void>;
  resetFavicon: () => Promise<void>;
};

// Get branding settings from environment variables with fallbacks
const envBranding: BrandingSettings = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || "AlphaBravo Operations",
  logoUrl: process.env.NEXT_PUBLIC_LOGO_PATH || null,
  faviconUrl: process.env.NEXT_PUBLIC_FAVICON_PATH || null,
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || "#0f172a", // Dark blue
  secondaryColor: process.env.NEXT_PUBLIC_SECONDARY_COLOR || "#3b82f6", // Bright blue
};

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const [branding, setBranding] = useState<BrandingSettings>(envBranding);
  const [isLoading, setIsLoading] = useState(false);

  // Load branding settings from environment variables
  useEffect(() => {
    console.log("Using branding settings from environment variables:", envBranding);
  }, []);

  // Save file to public directory
  const saveFile = async (file: File, fileName: string): Promise<string> => {
    // In a real implementation, we would save the file to the server
    // For now, we'll just create a blob URL for demo purposes
    const fileUrl = URL.createObjectURL(file);
    
    // In a real implementation, we would return the path to the saved file
    // For now, we'll just return the path that would be used
    return `/branding/${fileName}`;
  };

  // Update site name (this would require updating .env.local in a real implementation)
  const updateSiteName = async (name: string) => {
    try {
      setIsLoading(true);
      // In a real implementation, this would update .env.local
      // For now, just update the state
      setBranding({ ...branding, siteName: name });
      toast.success("Site name updated");
    } catch (error: any) {
      console.error("Error updating site name:", error);
      toast.error(`Failed to update site name: ${error.message || 'Unknown error'}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Upload logo to local directory
  const uploadLogo = async (file: File): Promise<string> => {
    try {
      setIsLoading(true);
      
      // Get file extension
      const fileExt = file.name.split('.').pop();
      const fileName = `logo.${fileExt}`;
      
      // Save file (in a real implementation)
      const filePath = await saveFile(file, fileName);
      console.log("Logo would be saved to:", filePath);
      
      // Update branding settings
      const newBranding = { ...branding, logoUrl: filePath };
      setBranding(newBranding);
      toast.success("Logo updated");
      
      return filePath;
    } catch (error: any) {
      console.error("Error uploading logo:", error);
      toast.error(`Error uploading logo: ${error.message || 'Unknown error'}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Upload favicon to local directory
  const uploadFavicon = async (file: File): Promise<string> => {
    try {
      setIsLoading(true);
      
      // Get file extension
      const fileExt = file.name.split('.').pop();
      const fileName = `favicon.${fileExt}`;
      
      // Save file (in a real implementation)
      const filePath = await saveFile(file, fileName);
      console.log("Favicon would be saved to:", filePath);
      
      // Update branding settings
      const newBranding = { ...branding, faviconUrl: filePath };
      setBranding(newBranding);
      toast.success("Favicon updated");
      
      return filePath;
    } catch (error: any) {
      console.error("Error uploading favicon:", error);
      toast.error(`Error uploading favicon: ${error.message || 'Unknown error'}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update colors
  const updateColors = async (primaryColor: string, secondaryColor: string) => {
    try {
      setIsLoading(true);
      // In a real implementation, this would update .env.local
      // For now, just update the state
      setBranding({ ...branding, primaryColor, secondaryColor });
      toast.success("Colors updated");
    } catch (error: any) {
      console.error("Error updating colors:", error);
      toast.error(`Failed to update colors: ${error.message || 'Unknown error'}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset logo
  const resetLogo = async () => {
    try {
      setIsLoading(true);
      // In a real implementation, this would delete the file and update .env.local
      // For now, just update the state
      setBranding({ ...branding, logoUrl: null });
      toast.success("Logo reset");
    } catch (error: any) {
      console.error("Error resetting logo:", error);
      toast.error(`Failed to reset logo: ${error.message || 'Unknown error'}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset favicon
  const resetFavicon = async () => {
    try {
      setIsLoading(true);
      // In a real implementation, this would delete the file and update .env.local
      // For now, just update the state
      setBranding({ ...branding, faviconUrl: null });
      toast.success("Favicon reset");
    } catch (error: any) {
      console.error("Error resetting favicon:", error);
      toast.error(`Failed to reset favicon: ${error.message || 'Unknown error'}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BrandingContext.Provider
      value={{
        branding,
        isLoading,
        updateSiteName,
        uploadLogo,
        uploadFavicon,
        updateColors,
        resetLogo,
        resetFavicon
      }}
    >
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
}
