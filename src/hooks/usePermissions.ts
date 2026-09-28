import { useAuth } from '../context/AuthContext';

interface Permissions {
  canDeleteColony: boolean;
  canManageColonies: boolean;
  isSuperuser: boolean;
}

export function usePermissions(): Permissions {
  const { user } = useAuth();

  return {
    isSuperuser: user?.is_superuser ?? false,
    canDeleteColony: user?.is_superuser ?? false,
    canManageColonies: user?.is_superuser ?? false,
  };
}
