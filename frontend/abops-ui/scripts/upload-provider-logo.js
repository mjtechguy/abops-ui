#!/usr/bin/env node

/**
 * A simple utility script to copy provider logo files to the public/abops/providers directory
 * and update the .env.local file with the new logo path.
 * 
 * Usage: node upload-provider-logo.js <provider-id> <logo-file-path>
 * Example: node upload-provider-logo.js aws /path/to/aws-logo.svg
 */

const fs = require('fs');
const path = require('path');

// Get command line arguments
const providerId = process.argv[2];
const logoFilePath = process.argv[3];

if (!providerId || !logoFilePath) {
  console.error('Usage: node upload-provider-logo.js <provider-id> <logo-file-path>');
  process.exit(1);
}

// Validate provider ID
const validProviderIds = [
  'aws', 'gcp', 'azure', 'digitalocean', 'oracle', 'hetzner',
  'harvester', 'vmware', 'proxmox'
];

if (!validProviderIds.includes(providerId.toLowerCase())) {
  console.error(`Error: Invalid provider ID. Valid options are: ${validProviderIds.join(', ')}`);
  process.exit(1);
}

// Validate logo file exists
if (!fs.existsSync(logoFilePath)) {
  console.error(`Error: Logo file not found at ${logoFilePath}`);
  process.exit(1);
}

// Get file extension
const fileExt = path.extname(logoFilePath);
const targetFileName = `${providerId.toLowerCase()}${fileExt}`;
const targetDir = path.join(process.cwd(), 'public', 'abops', 'providers');
const targetPath = path.join(targetDir, targetFileName);

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
  console.log(`Creating directory: ${targetDir}`);
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copy the file
try {
  fs.copyFileSync(logoFilePath, targetPath);
  console.log(`Logo file copied to: ${targetPath}`);
} catch (error) {
  console.error(`Error copying file: ${error.message}`);
  process.exit(1);
}

// Update .env.local file
const envFilePath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envFilePath)) {
  console.error(`Error: .env.local file not found at ${envFilePath}`);
  process.exit(1);
}

try {
  let envContent = fs.readFileSync(envFilePath, 'utf8');
  const envVarName = `NEXT_PUBLIC_LOGO_${providerId.toUpperCase()}`;
  const logoPublicPath = `/abops/providers/${targetFileName}`;
  
  // Check if the environment variable already exists
  const regex = new RegExp(`^${envVarName}=.*$`, 'm');
  
  if (regex.test(envContent)) {
    // Update existing variable
    envContent = envContent.replace(regex, `${envVarName}=${logoPublicPath}`);
  } else {
    // Add new variable in the provider logos section
    const providerSection = '# Provider logo paths';
    if (envContent.includes(providerSection)) {
      const sectionIndex = envContent.indexOf(providerSection);
      const nextSectionIndex = envContent.indexOf('#', sectionIndex + 1);
      
      if (nextSectionIndex !== -1) {
        // Insert before the next section
        envContent = 
          envContent.substring(0, nextSectionIndex) + 
          `${envVarName}=${logoPublicPath}\n\n` + 
          envContent.substring(nextSectionIndex);
      } else {
        // Append to the end of the file
        envContent += `\n${envVarName}=${logoPublicPath}\n`;
      }
    } else {
      // Add new section if it doesn't exist
      envContent += `\n# Provider logo paths\n${envVarName}=${logoPublicPath}\n`;
    }
  }
  
  fs.writeFileSync(envFilePath, envContent);
  console.log(`Updated .env.local with ${envVarName}=${logoPublicPath}`);
  console.log('Restart your Next.js server to apply the changes.');
} catch (error) {
  console.error(`Error updating .env.local file: ${error.message}`);
  process.exit(1);
}
