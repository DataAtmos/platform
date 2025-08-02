"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface UserProfileProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    emailVerified: boolean;
  };
}

export function UserProfile({ user }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-medium text-platform-fg-default">Profile</h2>
        <p className="text-xs text-platform-fg-muted">
          Update your personal information.
        </p>
      </div>

      <div className="space-y-4 border border-platform-border-default p-4 rounded-lg bg-platform-canvas-default">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.image || undefined} alt={user.name} />
            <AvatarFallback className="text-sm font-medium bg-platform-canvas-subtle text-platform-fg-default">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-medium text-platform-fg-default">{user.name}</h3>
            <p className="text-xs text-platform-fg-muted">{user.email}</p>
            <div className="flex items-center mt-1">
              <div
                className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                  user.emailVerified ? "bg-platform-success-emphasis" : "bg-platform-attention-emphasis"
                }`}
              />
              <span className="text-xs text-platform-fg-muted">
                {user.emailVerified ? "Email verified" : "Email not verified"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="name" className="text-xs font-medium">Display name</Label>
            <div className="flex space-x-2">
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                className="text-xs"
              />
              {isEditing ? (
                <div className="flex space-x-1">
                  <Button size="sm" onClick={() => setIsEditing(false)} className="text-xs px-2 py-1">
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setName(user.name);
                      setIsEditing(false);
                    }}
                    className="text-xs px-2 py-1"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="text-xs px-2 py-1"
                >
                  Edit
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs font-medium">Email</Label>
            <Input id="email" value={user.email} disabled className="text-xs" />
          </div>
        </div>
      </div>
    </div>
  );
}