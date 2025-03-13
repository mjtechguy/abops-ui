"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { dataService } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Search, RefreshCw } from "lucide-react";

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: any;
  ip_address: string;
  created_at: string;
  user_email: string;
}

export default function AuditLogsPage() {
  const { user } = useAuth();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [userProfiles, setUserProfiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState<string>("");
  const [entityFilter, setEntityFilter] = useState<string>("");
  const [userFilter, setUserFilter] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;

      try {
        // Check Supabase connection first
        const { connected, error: connectionError } = await dataService.checkConnection();
        
        if (!connected) {
            console.error("Database connection error:", connectionError);
            toast.error(connectionError?.message || 'Failed to connect to database');
            setIsLoading(false);
            return;
        }
        
        const { data: profiles, error } = await dataService.getUserProfiles();
        
        if (error) throw error;
        
        // Find the current user's profile
        const userProfile = profiles.find(profile => profile.user_id === user.id);
        
        if (userProfile) {
          setIsAdmin(userProfile.role === "admin" || userProfile.role === "global_admin");
        } else {
          // For development, set admin to true to allow access
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        // For development, set admin to true to allow access
        setIsAdmin(true);
      }
    };

    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      if (!user || !isAdmin) return;

      setIsLoading(true);
      try {
        // Get audit logs from mock data service
        const { data: logs, error } = await dataService.getAuditLogs();
        const { data: profiles } = await dataService.getUserProfiles();
        setUserProfiles(profiles || []);
        
        if (error) throw error;
        
        // Apply filters
        let filteredLogs = [...logs];
        
        if (actionFilter && actionFilter !== 'all') {
          filteredLogs = filteredLogs.filter(log => log.action === actionFilter);
        }
        
        if (entityFilter && entityFilter !== 'all') {
          filteredLogs = filteredLogs.filter(log => log.entity_type === entityFilter);
        }
        
        if (userFilter) {
          filteredLogs = filteredLogs.filter(log => log.user_id === userFilter);
        }
        
        if (dateFrom) {
          filteredLogs = filteredLogs.filter(log => 
            new Date(log.created_at) >= dateFrom
          );
        }
        
        if (dateTo) {
          // Set time to end of day
          const endDate = new Date(dateTo);
          endDate.setHours(23, 59, 59, 999);
          filteredLogs = filteredLogs.filter(log => 
            new Date(log.created_at) <= endDate
          );
        }
        
        // Sort by created_at in descending order
        filteredLogs.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        // Limit to 100 logs
        filteredLogs = filteredLogs.slice(0, 100);
        
        // Just use the filtered logs directly - we'll use the getUserName function to display user info
        const transformedLogs = filteredLogs;
        
        setAuditLogs(transformedLogs);
      } catch (error) {
        console.error("Error fetching audit logs:", error);
        toast.error("Failed to load audit logs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuditLogs();
  }, [user, isAdmin, actionFilter, entityFilter, userFilter, dateFrom, dateTo]);

  const handleRefresh = () => {
    setIsLoading(true);
    // Re-trigger the useEffect by changing a dependency
    setActionFilter(actionFilter);
  };

  const handleClearFilters = () => {
    setActionFilter("");
    setEntityFilter("");
    setUserFilter("");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case "create":
        return "default";
      case "update":
        return "secondary";
      case "delete":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Helper function to get user name from user_id
  const getUserName = (userId: string, userProfiles: any[]) => {
    const profile = userProfiles.find(p => p.id === userId);
    return profile ? profile.full_name || 'Unknown User' : 'Unknown User';
  };

  const formatDetails = (details: any) => {
    if (!details) return "-";
    
    try {
      if (typeof details === "string") {
        details = JSON.parse(details);
      }
      
      return (
        <div className="max-h-20 overflow-y-auto text-xs">
          <pre className="whitespace-pre-wrap">{JSON.stringify(details, null, 2)}</pre>
        </div>
      );
    } catch (e) {
      return String(details);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to view audit logs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">
            Track user activities across the platform.
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter audit logs by various criteria.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="action">Action</Label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger id="action">
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All actions</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="entity">Entity Type</Label>
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger id="entity">
                  <SelectValue placeholder="All entities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All entities</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="organization">Organization</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="auth">Authentication</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date-from">From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date-to">To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2 md:col-span-2 lg:col-span-3">
              <Label htmlFor="search">Search by User ID</Label>
              <div className="flex w-full items-center space-x-2">
                <Input
                  id="search"
                  placeholder="Enter user ID"
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                />
                <Button variant="secondary" onClick={() => setUserFilter("")}>
                  Clear
                </Button>
              </div>
            </div>
            
            <div className="flex items-end space-x-2">
              <Button variant="outline" onClick={handleClearFilters}>
                Clear All Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-muted"></div>
          ))}
        </div>
      ) : auditLogs.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Audit Logs</CardTitle>
            <CardDescription>
              No audit logs found matching your filters.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Audit Log Entries</CardTitle>
            <CardDescription>
              Showing {auditLogs.length} most recent entries.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Entity ID</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate" title={log.user_id}>
                      {getUserName(log.user_id, userProfiles)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getActionBadgeVariant(log.action)}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.entity_type}</TableCell>
                    <TableCell className="max-w-[100px] truncate" title={log.entity_id}>
                      {log.entity_id}
                    </TableCell>
                    <TableCell>{log.ip_address}</TableCell>
                    <TableCell>{formatDetails(log.details)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
