"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
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

const defaultBranding: BrandingSettings = {
  siteName: "ABOps",
  logoUrl: null,
  faviconUrl: null,
  primaryColor: "#0284c7",
  secondaryColor: "#64748b",
};

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const [branding, setBranding] = useState<BrandingSettings>(defaultBranding);
  const [isLoading, setIsLoading] = useState(true);

  // Load branding settings on mount
  useEffect(() => {
    const loadBrandingSettings = async () => {
      try {
        setIsLoading(true);
        
        // Check if we have settings in the database
        const { data: settingsData, error: settingsError } = await supabase
          .from('site_settings')
          .select('*')
          .eq('key', 'branding')
          .single();
        
        if (settingsError && settingsError.code !== 'PGRST116') {
          console.error("Error loading branding settings:", settingsError);
          return;
        }
        
        if (settingsData) {
          setBranding(settingsData.value as BrandingSettings);
          
          // Update document title
          if (settingsData.value.siteName) {
            document.title = settingsData.value.siteName;
          }
          
          // Update favicon if exists
          if (settingsData.value.faviconUrl) {
            const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'shortcut icon';
            link.href = settingsData.value.faviconUrl;
            document.getElementsByTagName('head')[0].appendChild(link);
          }
        }
      } catch (error) {
        console.error("Error in loadBrandingSettings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBrandingSettings();
  }, []);

  // Save branding settings to database
  const saveBrandingSettings = async (newBranding: BrandingSettings) => {
    try {
      console.log("Saving branding settings:", newBranding);
      
      // First, check if the site_settings table exists and has the proper structure
      const { error: tableCheckError } = await supabase
        .from('site_settings')
        .select('id')
        .limit(1);
      
      if (tableCheckError) {
        console.error("Error checking site_settings table:", tableCheckError);
        
        // If the table doesn't exist, create it
        if (tableCheckError.code === 'PGRST116') {
          console.log("site_settings table might not exist, attempting to create it");
          const { error: createTableError } = await supabase.rpc('create_site_settings_table');
          
          if (createTableError) {
            console.error("Failed to create site_settings table:", createTableError);
            toast.error("Failed to create settings table");
            throw createTableError;
          }
        } else {
          toast.error(`Database error: ${tableCheckError.message}`);
          throw tableCheckError;
        }
      }
      
      // Now upsert the branding settings
      const { error } = await supabase
        .from('site_settings')
        .upsert(
          { 
            key: 'branding', 
            value: newBranding 
          },
          { onConflict: 'key' }
        );
      
      if (error) {
        console.error("Database error details:", error);
        toast.error(`Failed to save settings: ${error.message}`);
        throw error;
      }
      
      console.log("Branding settings saved successfully");
      setBranding(newBranding);
      
      // Update document title
      document.title = newBranding.siteName;
      
      // Update favicon if exists
      if (newBranding.faviconUrl) {
        const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = newBranding.faviconUrl;
        document.getElementsByTagName('head')[0].appendChild(link);
      }
    } catch (error: any) {
      console.error("Error saving branding settings:", error);
      toast.error(`Error saving branding settings: ${error.message || 'Unknown error'}`);
      throw error;
    }
  };

  // Update site name
  const updateSiteName = async (name: string) => {
    try {
      const newBranding = { ...branding, siteName: name };
      await saveBrandingSettings(newBranding);
    } catch (error) {
      console.error("Error updating site name:", error);
      throw error;
    }
  };

  // Upload logo to Supabase storage
  const uploadLogo = async (file: File): Promise<string> => {
    try {
      setIsLoading(true);
      
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `logo_${Date.now()}.${fileExt}`;
      const filePath = `branding/${fileName}`;
      
      console.log("Uploading logo to path:", filePath);
      console.log("File size:", file.size, "bytes");
      console.log("File type:", file.type);
      console.log("Using Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
      
      // First check if we can connect to storage at all
      try {
        console.log("Testing storage connection...");
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        
        if (bucketsError) {
          console.error("Storage connection test failed:", bucketsError);
          // Try a direct fetch to diagnose CORS or network issues
          const storageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/bucket`;
          console.log("Attempting direct fetch to storage API at:", storageUrl);
          
          try {
            const response = await fetch(storageUrl, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
              }
            });
            
            if (!response.ok) {
              console.error("Direct storage API fetch failed:", response.status, response.statusText);
              throw new Error(`Storage API direct fetch failed: ${response.status} ${response.statusText}`);
            }
            
            console.log("Direct storage API fetch succeeded, but Supabase SDK failed. This suggests a client configuration issue.");
          } catch (fetchError: any) {
            console.error("Direct fetch error:", fetchError);
            throw new Error(`Storage connection failed: ${fetchError.message}. This may indicate a network or CORS issue.`);
          }
        }
        
        console.log("Storage connection test successful, found buckets:", buckets);
        
        // Check if assets bucket exists and create it if it doesn't
        const assetsBucketExists = buckets?.some(bucket => bucket.name === 'assets');
        
        if (!assetsBucketExists) {
          console.log("Assets bucket doesn't exist, creating it");
          const { error: createBucketError } = await supabase.storage.createBucket('assets', {
            public: true
          });
          
          if (createBucketError) {
            console.error("Error creating assets bucket:", createBucketError);
            toast.error("Failed to create storage bucket");
            throw createBucketError;
          } else {
            console.log("Assets bucket created successfully");
          }
        }
      } catch (storageError: any) {
        console.error("Storage setup error:", storageError);
        toast.error(`Storage setup failed: ${storageError.message}`);
        throw storageError;
      }
      
      // Upload to Supabase Storage
      console.log("Uploading file to storage...");
      const { error: uploadError, data } = await supabase.storage
        .from('assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        console.error("Upload error details:", uploadError);
        toast.error(`Upload failed: ${uploadError.message}`);
        throw uploadError;
      }
      
      console.log("Logo uploaded successfully, getting public URL");
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);
      
      if (!urlData || !urlData.publicUrl) {
        console.error("Failed to get public URL");
        toast.error("Failed to get public URL for uploaded logo");
        throw new Error("Failed to get public URL");
      }
      
      const publicUrl = urlData.publicUrl;
      console.log("Logo public URL:", publicUrl);
      
      // Update branding settings
      const newBranding = { ...branding, logoUrl: publicUrl };
      await saveBrandingSettings(newBranding);
      
      return publicUrl;
    } catch (error: any) {
      console.error("Error uploading logo:", error);
      toast.error(`Error uploading logo: ${error.message || 'Unknown error'}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Upload favicon to Supabase storage
  const uploadFavicon = async (file: File): Promise<string> => {
    try {
      setIsLoading(true);
      
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `favicon_${Date.now()}.${fileExt}`;
      const filePath = `branding/${fileName}`;
      
      console.log("Uploading favicon to path:", filePath);
      console.log("File size:", file.size, "bytes");
      console.log("File type:", file.type);
      console.log("Using Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
      
      // First check if we can connect to storage at all
      try {
        console.log("Testing storage connection...");
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        
        if (bucketsError) {
          console.error("Storage connection test failed:", bucketsError);
          // Try a direct fetch to diagnose CORS or network issues
          const storageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/bucket`;
          console.log("Attempting direct fetch to storage API at:", storageUrl);
          
          try {
            const response = await fetch(storageUrl, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
              }
            });
            
            if (!response.ok) {
              console.error("Direct storage API fetch failed:", response.status, response.statusText);
              throw new Error(`Storage API direct fetch failed: ${response.status} ${response.statusText}`);
            }
            
            console.log("Direct storage API fetch succeeded, but Supabase SDK failed. This suggests a client configuration issue.");
          } catch (fetchError: any) {
            console.error("Direct fetch error:", fetchError);
            throw new Error(`Storage connection failed: ${fetchError.message}. This may indicate a network or CORS issue.`);
          }
        }
        
        console.log("Storage connection test successful, found buckets:", buckets);
        
        // Check if assets bucket exists and create it if it doesn't
        const assetsBucketExists = buckets?.some(bucket => bucket.name === 'assets');
        
        if (!assetsBucketExists) {
          console.log("Assets bucket doesn't exist, creating it");
          const { error: createBucketError } = await supabase.storage.createBucket('assets', {
            public: true
          });
          
          if (createBucketError) {
            console.error("Error creating assets bucket:", createBucketError);
            toast.error("Failed to create storage bucket");
            throw createBucketError;
          } else {
            console.log("Assets bucket created successfully");
          }
        }
      } catch (storageError: any) {
        console.error("Storage setup error:", storageError);
        toast.error(`Storage setup failed: ${storageError.message}`);
        throw storageError;
      }
      
      // Upload to Supabase Storage
      console.log("Uploading file to storage...");
      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        console.error("Upload error details:", uploadError);
        toast.error(`Upload failed: ${uploadError.message}`);
        throw uploadError;
      }
      
      console.log("Favicon uploaded successfully, getting public URL");
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);
      
      if (!urlData || !urlData.publicUrl) {
        console.error("Failed to get public URL");
        toast.error("Failed to get public URL for uploaded favicon");
        throw new Error("Failed to get public URL");
      }
      
      const publicUrl = urlData.publicUrl;
      console.log("Favicon public URL:", publicUrl);
      
      // Update branding settings
      const newBranding = { ...branding, faviconUrl: publicUrl };
      await saveBrandingSettings(newBranding);
      
      return publicUrl;
    } catch (error: any) {
      console.error("Error uploading favicon:", error);
      toast.error(`Error uploading favicon: ${error.message || 'Unknown error'}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update theme colors
  const updateColors = async (primaryColor: string, secondaryColor: string) => {
    try {
      const newBranding = { 
        ...branding, 
        primaryColor, 
        secondaryColor 
      };
      await saveBrandingSettings(newBranding);
    } catch (error) {
      console.error("Error updating colors:", error);
      throw error;
    }
  };

  // Reset logo to default
  const resetLogo = async () => {
    try {
      const newBranding = { ...branding, logoUrl: null };
      await saveBrandingSettings(newBranding);
    } catch (error) {
      console.error("Error resetting logo:", error);
      throw error;
    }
  };

  // Reset favicon to default
  const resetFavicon = async () => {
    try {
      const newBranding = { ...branding, faviconUrl: null };
      await saveBrandingSettings(newBranding);
    } catch (error) {
      console.error("Error resetting favicon:", error);
      throw error;
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
    throw new Error("useBranding must be used within a BrandingProvider");
  }
  return context;
}
