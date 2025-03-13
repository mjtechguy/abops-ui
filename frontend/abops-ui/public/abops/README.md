# ABOps Provider Logos

This directory contains the provider logos used in the ABOps UI. The logos are organized by provider type and can be customized by updating the `.env.local` file.

## Directory Structure

- `/abops/providers/`: Contains the provider logos for cloud and HCI providers

## Customizing Provider Logos

You can customize the provider logos by:

1. Adding your custom logo files to the `/public/abops/providers/` directory
2. Updating the corresponding environment variables in `.env.local`

## Using the Provider Logo Upload Utility

We provide a utility script to help you upload provider logos and automatically update the `.env.local` file:

```bash
# Navigate to the project root
cd /path/to/abops-ui

# Run the upload utility
node scripts/upload-provider-logo.js <provider-id> <logo-file-path>
```

### Example

```bash
# Upload a custom AWS logo
node scripts/upload-provider-logo.js aws /path/to/custom-aws-logo.svg
```

### Supported Provider IDs

- **Cloud Providers**: aws, gcp, azure, digitalocean, oracle, hetzner
- **HCI Providers**: harvester, vmware, proxmox

## Environment Variables

The provider logos are configured in `.env.local` with the following environment variables:

```
# Provider logo paths
NEXT_PUBLIC_PROVIDER_LOGOS_DIR=/abops/providers
NEXT_PUBLIC_LOGO_AWS=/abops/providers/aws.svg
NEXT_PUBLIC_LOGO_GCP=/abops/providers/gcp.svg
NEXT_PUBLIC_LOGO_AZURE=/abops/providers/azure.svg
NEXT_PUBLIC_LOGO_DIGITALOCEAN=/abops/providers/digitalocean.svg
NEXT_PUBLIC_LOGO_ORACLE=/abops/providers/oracle.svg
NEXT_PUBLIC_LOGO_HETZNER=/abops/providers/hetzner.svg
NEXT_PUBLIC_LOGO_HARVESTER=/abops/providers/harvester.svg
NEXT_PUBLIC_LOGO_VMWARE=/abops/providers/vmware.svg
NEXT_PUBLIC_LOGO_PROXMOX=/abops/providers/proxmox.svg
```

After updating the environment variables, restart your Next.js server to apply the changes.
