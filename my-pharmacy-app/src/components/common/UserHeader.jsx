import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { UserCircle } from 'lucide-react';

const UserHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <UserCircle className="h-8 w-8" />
        <div className="hidden md:block">
          <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
          <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
        </div>
      </div>
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleLogout}
      >
        Déconnexion
      </Button>
    </div>
  );
};

export default UserHeader;