"use client";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { client } from "@/lib/auth-client";
import { Monitor, Smartphone, Tablet, MapPin, Calendar } from "lucide-react";
import { useState, useEffect } from "react";

interface Session {
  id: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  createdAt: Date;
  expiresAt: Date;
  isCurrent?: boolean;
}

export function ActiveSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [terminating, setTerminating] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const result = await client.listSessions();
      setSessions(result.data || []);
    } catch {
      setError("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const getDeviceIcon = (userAgent?: string | null) => {
    if (!userAgent) return <Monitor className="h-4 w-4" />;
    
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return <Smartphone className="h-4 w-4" />;
    }
    if (ua.includes('tablet') || ua.includes('ipad')) {
      return <Tablet className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  const getDeviceInfo = (userAgent?: string | null) => {
    if (!userAgent) return "Unknown device";
    
    const ua = userAgent.toLowerCase();
    let browser = "Unknown browser";
    let os = "Unknown OS";

    // Detect browser
    if (ua.includes('chrome')) browser = "Chrome";
    else if (ua.includes('firefox')) browser = "Firefox";
    else if (ua.includes('safari')) browser = "Safari";
    else if (ua.includes('edge')) browser = "Edge";

    // Detect OS
    if (ua.includes('windows')) os = "Windows";
    else if (ua.includes('mac')) os = "macOS";
    else if (ua.includes('linux')) os = "Linux";
    else if (ua.includes('android')) os = "Android";
    else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = "iOS";

    return `${browser} on ${os}`;
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

  const terminateSession = async (sessionId: string) => {
    setTerminating(sessionId);
    try {
      await client.revokeSession({ token: sessionId });
      setSessions(sessions.filter(session => session.id !== sessionId));
    } catch {
      setError("Failed to terminate session");
    } finally {
      setTerminating(null);
    }
  };

  const terminateAllOtherSessions = async () => {
    try {
      await client.revokeOtherSessions();
      setSessions(sessions.filter(session => session.isCurrent));
    } catch {
      setError("Failed to terminate sessions");
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Active Sessions</h2>
          <p className="text-sm text-muted-foreground">
            Manage devices that are signed into your account.
          </p>
        </div>
        
        {sessions.filter(s => !s.isCurrent).length > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={terminateAllOtherSessions}
          >
            Sign out all other sessions
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {sessions.map((session) => (
          <div key={session.id} className="border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getDeviceIcon(session.userAgent)}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">
                      {getDeviceInfo(session.userAgent)}
                    </span>
                    {session.isCurrent && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        Current session
                      </span>
                    )}
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
              
              {!session.isCurrent && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => terminateSession(session.id)}
                  disabled={terminating === session.id}
                >
                  {terminating === session.id ? "Signing out..." : "Sign out"}
                </Button>
              )}
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