'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function StorageTest() {
  const [status, setStatus] = useState<string>('Testing...');
  const [buckets, setBuckets] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [directFetchResult, setDirectFetchResult] = useState<string | null>(null);
  const [testFile, setTestFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<string | null>(null);

  useEffect(() => {
    testStorage();
  }, []);

  const testStorage = async () => {
    setStatus('Testing Supabase storage connection...');
    
    try {
      // First try a direct fetch to the storage API
      const storageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/bucket`;
      setStatus(`Attempting direct fetch to ${storageUrl}...`);
      
      try {
        const response = await fetch(storageUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'apikey': `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
          }
        });
        
        if (!response.ok) {
          setDirectFetchResult(`Direct fetch failed: ${response.status} ${response.statusText}`);
        } else {
          const data = await response.json();
          setDirectFetchResult(`Direct fetch succeeded! Found ${data.length} buckets.`);
        }
      } catch (directError: any) {
        setDirectFetchResult(`Direct fetch error: ${directError.message}`);
      }
      
      // Now try with the Supabase SDK
      setStatus('Testing via Supabase SDK...');
      const { data, error } = await supabase.storage.listBuckets();
      
      if (error) {
        setError(`SDK Error: ${error.message}`);
        setStatus('Failed to connect to Supabase storage');
      } else {
        setBuckets(data || []);
        setStatus('Successfully connected to Supabase storage');
        
        // Check if assets bucket exists, create if not
        if (!data?.some(bucket => bucket.name === 'assets')) {
          setStatus('Creating assets bucket...');
          const { error: createError } = await supabase.storage.createBucket('assets', {
            public: true
          });
          
          if (createError) {
            setError(`Failed to create assets bucket: ${createError.message}`);
          } else {
            setStatus('Assets bucket created successfully');
            // Refresh bucket list
            const { data: refreshData } = await supabase.storage.listBuckets();
            setBuckets(refreshData || []);
          }
        }
      }
    } catch (e: any) {
      setError(`Unexpected error: ${e.message}`);
      setStatus('Test failed with exception');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setTestFile(e.target.files[0]);
    }
  };

  const uploadTestFile = async () => {
    if (!testFile) {
      setUploadResult('No file selected');
      return;
    }
    
    setUploadResult('Uploading...');
    
    try {
      // Generate a unique filename
      const fileExt = testFile.name.split('.').pop();
      const fileName = `test_${Date.now()}.${fileExt}`;
      const filePath = `test/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('assets')
        .upload(filePath, testFile, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        setUploadResult(`Upload failed: ${error.message}`);
      } else {
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('assets')
          .getPublicUrl(filePath);
        
        setUploadResult(`Upload successful! URL: ${urlData?.publicUrl}`);
      }
    } catch (e: any) {
      setUploadResult(`Upload exception: ${e.message}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Storage Test</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Connection Status</h2>
        <p className="mb-2"><strong>Status:</strong> {status}</p>
        {error && (
          <p className="text-red-500 mb-2"><strong>Error:</strong> {error}</p>
        )}
        {directFetchResult && (
          <p className="mb-2"><strong>Direct API Test:</strong> {directFetchResult}</p>
        )}
        <button 
          onClick={testStorage}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retest Connection
        </button>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Storage Buckets</h2>
        {buckets.length === 0 ? (
          <p>No buckets found</p>
        ) : (
          <ul className="list-disc pl-5">
            {buckets.map(bucket => (
              <li key={bucket.id}>
                {bucket.name} ({bucket.public ? 'public' : 'private'})
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Test Upload</h2>
        <div className="mb-4">
          <input 
            type="file" 
            onChange={handleFileChange}
            className="mb-2"
          />
          <button 
            onClick={uploadTestFile}
            disabled={!testFile}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            Upload Test File
          </button>
        </div>
        {uploadResult && (
          <p className={uploadResult.includes('failed') || uploadResult.includes('exception') ? 'text-red-500' : ''}>
            {uploadResult}
          </p>
        )}
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
        <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
        <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Not set'}</p>
      </div>
    </div>
  );
}
