import type { ButtonProps } from '@mui/material/Button';
import type { Theme, SxProps } from '@mui/material/styles';

import { useCallback } from 'react';

import Button from '@mui/material/Button';

import { useRouter } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';
import { signOut } from 'src/auth/context/jwt/action';
import cookie from 'react-cookies';
import { COOKIE_NAME } from 'src/@core/constants/common';
import authService from '../../@core/service/auth';
import { CONFIG } from '../../config-global'
// ----------------------------------------------------------------------

type Props = ButtonProps & {
  sx?: SxProps<Theme>;
  onClose?: () => void;
};

export function SignOutButton({ onClose, ...other }: Props) {
  const router = useRouter();

  const { checkUserSession } = useAuthContext();

  const handleLogout = useCallback(async () => {
    try {
    
      // await signOut();
      // await checkUserSession?.();
      cookie.remove(COOKIE_NAME.AUTH, {domain:CONFIG.auth1.domain, path: '/' });
      cookie.remove(COOKIE_NAME.USER, { domain:CONFIG.auth1.domain, path: '/' });
      cookie.remove(COOKIE_NAME.PERMISSIONS, { domain:CONFIG.auth1.domain, path: '/' });
      onClose?.();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }, [checkUserSession, onClose, router]);

  return (
    <Button fullWidth variant="soft" size="large" color="error" onClick={handleLogout} {...other}>
      Logout
    </Button>
  );
}
