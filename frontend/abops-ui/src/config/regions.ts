// Define types for cloud provider regions
export type RegionType = {
  id: string;
  name: string;
  description: string;
  location: string;
  isDefault?: boolean;
};

// AWS Regions
export const awsRegions: RegionType[] = [
  { id: 'us-east-1', name: 'US East (N. Virginia)', description: 'US East Region', location: 'North America', isDefault: true },
  { id: 'us-east-2', name: 'US East (Ohio)', description: 'US East Region', location: 'North America' },
  { id: 'us-west-1', name: 'US West (N. California)', description: 'US West Region', location: 'North America' },
  { id: 'us-west-2', name: 'US West (Oregon)', description: 'US West Region', location: 'North America' },
  { id: 'ca-central-1', name: 'Canada (Central)', description: 'Canada Region', location: 'North America' },
  { id: 'eu-west-1', name: 'EU West (Ireland)', description: 'EU West Region', location: 'Europe' },
  { id: 'eu-west-2', name: 'EU West (London)', description: 'EU West Region', location: 'Europe' },
  { id: 'eu-west-3', name: 'EU West (Paris)', description: 'EU West Region', location: 'Europe' },
  { id: 'eu-central-1', name: 'EU Central (Frankfurt)', description: 'EU Central Region', location: 'Europe' },
  { id: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)', description: 'Asia Pacific Region', location: 'Asia Pacific' },
  { id: 'ap-northeast-2', name: 'Asia Pacific (Seoul)', description: 'Asia Pacific Region', location: 'Asia Pacific' },
  { id: 'ap-southeast-1', name: 'Asia Pacific (Singapore)', description: 'Asia Pacific Region', location: 'Asia Pacific' },
  { id: 'ap-southeast-2', name: 'Asia Pacific (Sydney)', description: 'Asia Pacific Region', location: 'Asia Pacific' },
  { id: 'ap-south-1', name: 'Asia Pacific (Mumbai)', description: 'Asia Pacific Region', location: 'Asia Pacific' },
  { id: 'sa-east-1', name: 'South America (São Paulo)', description: 'South America Region', location: 'South America' }
];

// Azure Regions
export const azureRegions: RegionType[] = [
  { id: 'eastus', name: 'East US', description: 'Virginia', location: 'North America', isDefault: true },
  { id: 'eastus2', name: 'East US 2', description: 'Virginia', location: 'North America' },
  { id: 'centralus', name: 'Central US', description: 'Iowa', location: 'North America' },
  { id: 'northcentralus', name: 'North Central US', description: 'Illinois', location: 'North America' },
  { id: 'southcentralus', name: 'South Central US', description: 'Texas', location: 'North America' },
  { id: 'westus', name: 'West US', description: 'California', location: 'North America' },
  { id: 'westus2', name: 'West US 2', description: 'Washington', location: 'North America' },
  { id: 'westcentralus', name: 'West Central US', description: 'Wyoming', location: 'North America' },
  { id: 'canadacentral', name: 'Canada Central', description: 'Toronto', location: 'North America' },
  { id: 'canadaeast', name: 'Canada East', description: 'Quebec City', location: 'North America' },
  { id: 'northeurope', name: 'North Europe', description: 'Ireland', location: 'Europe' },
  { id: 'westeurope', name: 'West Europe', description: 'Netherlands', location: 'Europe' },
  { id: 'uksouth', name: 'UK South', description: 'London', location: 'Europe' },
  { id: 'ukwest', name: 'UK West', description: 'Cardiff', location: 'Europe' },
  { id: 'francecentral', name: 'France Central', description: 'Paris', location: 'Europe' },
  { id: 'germanywestcentral', name: 'Germany West Central', description: 'Frankfurt', location: 'Europe' },
  { id: 'japaneast', name: 'Japan East', description: 'Tokyo', location: 'Asia Pacific' },
  { id: 'japanwest', name: 'Japan West', description: 'Osaka', location: 'Asia Pacific' },
  { id: 'southeastasia', name: 'Southeast Asia', description: 'Singapore', location: 'Asia Pacific' },
  { id: 'eastasia', name: 'East Asia', description: 'Hong Kong', location: 'Asia Pacific' },
  { id: 'australiaeast', name: 'Australia East', description: 'New South Wales', location: 'Asia Pacific' },
  { id: 'australiasoutheast', name: 'Australia Southeast', description: 'Victoria', location: 'Asia Pacific' },
  { id: 'brazilsouth', name: 'Brazil South', description: 'São Paulo', location: 'South America' }
];

// GCP Regions
export const gcpRegions: RegionType[] = [
  { id: 'us-central1', name: 'Iowa (us-central1)', description: 'Central US', location: 'North America', isDefault: true },
  { id: 'us-east1', name: 'South Carolina (us-east1)', description: 'East US', location: 'North America' },
  { id: 'us-east4', name: 'Northern Virginia (us-east4)', description: 'East US', location: 'North America' },
  { id: 'us-west1', name: 'Oregon (us-west1)', description: 'West US', location: 'North America' },
  { id: 'us-west2', name: 'Los Angeles (us-west2)', description: 'West US', location: 'North America' },
  { id: 'us-west3', name: 'Salt Lake City (us-west3)', description: 'West US', location: 'North America' },
  { id: 'us-west4', name: 'Las Vegas (us-west4)', description: 'West US', location: 'North America' },
  { id: 'northamerica-northeast1', name: 'Montréal (northamerica-northeast1)', description: 'Canada', location: 'North America' },
  { id: 'southamerica-east1', name: 'São Paulo (southamerica-east1)', description: 'Brazil', location: 'South America' },
  { id: 'europe-west1', name: 'Belgium (europe-west1)', description: 'Western Europe', location: 'Europe' },
  { id: 'europe-west2', name: 'London (europe-west2)', description: 'United Kingdom', location: 'Europe' },
  { id: 'europe-west3', name: 'Frankfurt (europe-west3)', description: 'Germany', location: 'Europe' },
  { id: 'europe-west4', name: 'Netherlands (europe-west4)', description: 'Western Europe', location: 'Europe' },
  { id: 'europe-west6', name: 'Zürich (europe-west6)', description: 'Switzerland', location: 'Europe' },
  { id: 'europe-north1', name: 'Finland (europe-north1)', description: 'Northern Europe', location: 'Europe' },
  { id: 'asia-east1', name: 'Taiwan (asia-east1)', description: 'Eastern Asia', location: 'Asia Pacific' },
  { id: 'asia-east2', name: 'Hong Kong (asia-east2)', description: 'Eastern Asia', location: 'Asia Pacific' },
  { id: 'asia-northeast1', name: 'Tokyo (asia-northeast1)', description: 'Japan', location: 'Asia Pacific' },
  { id: 'asia-northeast2', name: 'Osaka (asia-northeast2)', description: 'Japan', location: 'Asia Pacific' },
  { id: 'asia-northeast3', name: 'Seoul (asia-northeast3)', description: 'South Korea', location: 'Asia Pacific' },
  { id: 'asia-south1', name: 'Mumbai (asia-south1)', description: 'India', location: 'Asia Pacific' },
  { id: 'asia-southeast1', name: 'Singapore (asia-southeast1)', description: 'Southeast Asia', location: 'Asia Pacific' },
  { id: 'australia-southeast1', name: 'Sydney (australia-southeast1)', description: 'Australia', location: 'Asia Pacific' }
];

// DigitalOcean Regions
export const digitaloceanRegions: RegionType[] = [
  { id: 'nyc1', name: 'New York 1', description: 'New York, United States', location: 'North America', isDefault: true },
  { id: 'nyc3', name: 'New York 3', description: 'New York, United States', location: 'North America' },
  { id: 'sfo2', name: 'San Francisco 2', description: 'San Francisco, United States', location: 'North America' },
  { id: 'sfo3', name: 'San Francisco 3', description: 'San Francisco, United States', location: 'North America' },
  { id: 'tor1', name: 'Toronto 1', description: 'Toronto, Canada', location: 'North America' },
  { id: 'lon1', name: 'London 1', description: 'London, United Kingdom', location: 'Europe' },
  { id: 'ams3', name: 'Amsterdam 3', description: 'Amsterdam, Netherlands', location: 'Europe' },
  { id: 'fra1', name: 'Frankfurt 1', description: 'Frankfurt, Germany', location: 'Europe' },
  { id: 'sgp1', name: 'Singapore 1', description: 'Singapore', location: 'Asia Pacific' },
  { id: 'blr1', name: 'Bangalore 1', description: 'Bangalore, India', location: 'Asia Pacific' },
  { id: 'syd1', name: 'Sydney 1', description: 'Sydney, Australia', location: 'Asia Pacific' }
];

// Oracle Cloud Regions
export const oracleRegions: RegionType[] = [
  { id: 'us-ashburn-1', name: 'US East (Ashburn)', description: 'Ashburn, VA', location: 'North America', isDefault: true },
  { id: 'us-phoenix-1', name: 'US West (Phoenix)', description: 'Phoenix, AZ', location: 'North America' },
  { id: 'ca-toronto-1', name: 'Canada Southeast (Toronto)', description: 'Toronto', location: 'North America' },
  { id: 'ca-montreal-1', name: 'Canada Southeast (Montreal)', description: 'Montreal', location: 'North America' },
  { id: 'sa-saopaulo-1', name: 'Brazil East (Sao Paulo)', description: 'Sao Paulo', location: 'South America' },
  { id: 'uk-london-1', name: 'UK South (London)', description: 'London', location: 'Europe' },
  { id: 'eu-frankfurt-1', name: 'Germany Central (Frankfurt)', description: 'Frankfurt', location: 'Europe' },
  { id: 'eu-zurich-1', name: 'Switzerland North (Zurich)', description: 'Zurich', location: 'Europe' },
  { id: 'eu-amsterdam-1', name: 'Netherlands Northwest (Amsterdam)', description: 'Amsterdam', location: 'Europe' },
  { id: 'ap-tokyo-1', name: 'Japan East (Tokyo)', description: 'Tokyo', location: 'Asia Pacific' },
  { id: 'ap-osaka-1', name: 'Japan Central (Osaka)', description: 'Osaka', location: 'Asia Pacific' },
  { id: 'ap-seoul-1', name: 'South Korea Central (Seoul)', description: 'Seoul', location: 'Asia Pacific' },
  { id: 'ap-sydney-1', name: 'Australia East (Sydney)', description: 'Sydney', location: 'Asia Pacific' },
  { id: 'ap-melbourne-1', name: 'Australia Southeast (Melbourne)', description: 'Melbourne', location: 'Asia Pacific' },
  { id: 'ap-mumbai-1', name: 'India West (Mumbai)', description: 'Mumbai', location: 'Asia Pacific' },
  { id: 'ap-hyderabad-1', name: 'India Central (Hyderabad)', description: 'Hyderabad', location: 'Asia Pacific' },
  { id: 'me-jeddah-1', name: 'Saudi Arabia West (Jeddah)', description: 'Jeddah', location: 'Middle East' },
  { id: 'me-dubai-1', name: 'UAE Central (Dubai)', description: 'Dubai', location: 'Middle East' }
];

// Hetzner Regions
export const hetznerRegions: RegionType[] = [
  { id: 'fsn1', name: 'Falkenstein (Germany)', description: 'Falkenstein, Germany', location: 'Europe', isDefault: true },
  { id: 'nbg1', name: 'Nuremberg (Germany)', description: 'Nuremberg, Germany', location: 'Europe' },
  { id: 'hel1', name: 'Helsinki (Finland)', description: 'Helsinki, Finland', location: 'Europe' },
  { id: 'ash', name: 'Ashburn (USA)', description: 'Ashburn, Virginia, USA', location: 'North America' },
  { id: 'hil', name: 'Hillsboro (USA)', description: 'Hillsboro, Oregon, USA', location: 'North America' }
];

// Helper functions
export const getRegionsForProvider = (providerId: string): RegionType[] => {
  switch (providerId) {
    case 'aws':
      return awsRegions;
    case 'azure':
      return azureRegions;
    case 'gcp':
      return gcpRegions;
    case 'digitalocean':
      return digitaloceanRegions;
    case 'oracle':
      return oracleRegions;
    case 'hetzner':
      return hetznerRegions;
    default:
      return [];
  }
};

export const getDefaultRegionForProvider = (providerId: string): RegionType | undefined => {
  const regions = getRegionsForProvider(providerId);
  return regions.find(region => region.isDefault) || regions[0];
};
