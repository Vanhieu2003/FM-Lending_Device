'use client';

import { useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { COOKIE_NAME } from 'src/@core/constants/common';
import cookie from 'react-cookies';
import { canViewPermission } from 'src/@core/utils/checkPermission';
import { PermissionConstants } from 'src/@core/constants/permission';

// ----------------------------------------------------------------------

type Props = {
  permission?:any
  children: React.ReactNode;
};

export function AuthGuard({ permission, children }: Props) {
  const router = useRouter();
  const auth = cookie.load(COOKIE_NAME.AUTH);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const pathname = usePathname();
  
  useEffect(() => {
    if (!auth) {
      setAuthenticated(false);
      const href = `${CONFIG.auth1.loginPage}?clientID=${CONFIG.auth1.clientId}&origin=${CONFIG.auth1.origin}&redirectURL=${CONFIG.auth1.redirectUrl}`;
      router.replace(href);
      return;
    }
    setAuthenticated(true);
    // Kiểm tra quyền và redirect khi vừa đăng nhập
    if (pathname === "/dashboard/group/") {
      const hasPermission = canViewPermission([PermissionConstants.ModifyDevice]);
      if (!hasPermission) {
        router.replace(paths.page404);
      }
    }
  }, [auth, pathname, permission]);

  // Kiểm tra quyền truy cập cho trang hiện tại

  if (authenticated && canViewPermission([PermissionConstants.AccessLD])) {
    return <>{children}</>;
  }

  return null;
}
