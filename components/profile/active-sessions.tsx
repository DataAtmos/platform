"use client";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { client } from "@/lib/auth-client";
import { Monitor, Smartphone, Tablet, MapPin, Calendar, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { UAParser } from "ua-parser-js";
import { useRouter } from "next/navigation";

interface Session {
  id: string;
  token: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  createdAt: Date;
  expiresAt: Date;
  isCurrent?: boolean;
}

export function ActiveSessions() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [terminating, setTerminating] = useState<string | null>(null);
  const [terminatingAll, setTerminatingAll] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await client.listSessions();
      setSessions(result.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load sessions";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getDeviceIcon = (userAgent?: string | null) => {
    if (!userAgent) return <Monitor className="h-4 w-4" />;
    
    const parser = new UAParser(userAgent);
    const device = parser.getDevice();
    
    if (device.type === "mobile") {
      return <Smartphone className="h-4 w-4" />;
    }
    if (device.type === "tablet") {
      return <Tablet className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  const getDeviceInfo = (userAgent?: string | null) => {
    if (!userAgent) return "Unknown device";
    
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser();
    const os = parser.getOS();
    
    const browserName = browser.name || "Unknown browser";
    const osName = os.name || "Unknown OS";
    
    return `${browserName} on ${osName}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const terminateSession = async (sessionId: string, sessionToken: string, isCurrentSession: boolean) => {
    setTerminating(sessionId);
    try {
      await client.revokeSession({ token: sessionToken });
      
      // Remove the session from the list
      setSessions(prev => prev.filter(session => session.id !== sessionId));
      
      toast.success(isCurrentSession ? "Signed out successfully" : "Session terminated successfully");
      
      // If it's the current session, refresh the page
      if (isCurrentSession) {
        router.refresh();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to terminate session";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setTerminating(null);
    }
  };

  const terminateAllOtherSessions = async () => {
    setTerminatingAll(true);
    try {
      await client.revokeOtherSessions();
      
      // Keep only the current session
      setSessions(prev => prev.filter(session => session.isCurrent));
      
      toast.success("All other sessions terminated successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to terminate sessions";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setTerminatingAll(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium">Active Sessions</h2>
          <p className="text-sm text-muted-foreground">
            Loading your active sessions...
          </p>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </div>
    );
  }

  const otherSessions = sessions.filter(s => !s.isCurrent);
  const currentSession = sessions.find(s => s.isCurrent);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Active Sessions</h2>
          <p className="text-sm text-muted-foreground">
            Manage devices that are signed into your account.
          </p>
        </div>
        
        {otherSessions.length > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={terminateAllOtherSessions}
            disabled={terminatingAll}
          >
            {terminatingAll ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Terminating...
              </>
            ) : (
              "Sign out all other sessions"
            )}
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {/* Current Session */}
        {currentSession && (
          <div className="border p-4 space-y-3 bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getDeviceIcon(currentSession.userAgent)}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">
                      {getDeviceInfo(currentSession.userAgent)}
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Current session
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                    {currentSession.ipAddress && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{currentSession.ipAddress}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Last active: {formatDate(currentSession.createdAt.toISOString())}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => terminateSession(currentSession.id, currentSession.token, true)}
                disabled={terminating === currentSession.id}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                {terminating === currentSession.id ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Signing out...
                  </>
                ) : (
                  "Sign Out"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Other Sessions */}
        {otherSessions.map((session) => (
          <div key={session.id} className="border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getDeviceIcon(session.userAgent)}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">
                      {getDeviceInfo(session.userAgent)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                    {session.ipAddress && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{session.ipAddress}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Last active: {formatDate(session.createdAt.toISOString())}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => terminateSession(session.id, session.token, false)}
                disabled={terminating === session.id}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                {terminating === session.id ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Terminating...
                  </>
                ) : (
                  "Terminate"
                )}
              </Button>
            </div>
          </div>
        ))}
        
        {sessions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No active sessions found.
          </div>
        )}
      </div>
    </div>
  );
}