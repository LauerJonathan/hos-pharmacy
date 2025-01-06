import React from "react";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const UserHeader = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <UserCircle className="h-8 w-8" />
        <div className="hidden md:block">
          <p className="text-sm font-medium">Jonathan</p>
          <p className="text-xs text-muted-foreground capitalize">
            {user?.role || "pharmacien"}
          </p>
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={logout}>
        Déconnexion
      </Button>
    </div>
  );
};

export default UserHeader;
