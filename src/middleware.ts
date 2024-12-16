import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { canViewPermission } from 'src/@core/utils/checkPermission';
import { COOKIE_NAME } from './@core/constants/common';
import { PermissionConstants } from './@core/constants/permission';
import { CONFIG } from './config-global';




const ROUTE_PERMISSIONS = new Map<string, string[]>([
  ['/dashboard/manage', [PermissionConstants.ModifyDevice]],
  // ['/dashboard', [PermissionConstants.AccessLD]],
  // ['/dashboard/products', [PermissionConstants.ManageProduct]],
  // Thêm các route khác...
]);

export function middleware(request: NextRequest) {
  // Lấy token từ cookie
  const auth = request.cookies.get(COOKIE_NAME.AUTH);
  const permissions = JSON.parse(request.cookies.get(COOKIE_NAME.PERMISSIONS)?.value || '[]');


  if (!auth) {
    const href = `${CONFIG.auth1.loginPage}?clientID=${CONFIG.auth1.clientId}&origin=${CONFIG.auth1.origin}&redirectURL=${CONFIG.auth1.redirectUrl}`;
    return NextResponse.redirect(new URL(href, request.url));
  }

  if (!permissions.some((p: any) =>
    [PermissionConstants.AccessLD].includes(p.permission)
  )) {
    // const href = `${CONFIG.auth1.loginPage}?clientID=${CONFIG.auth1.clientId}&origin=${CONFIG.auth1.origin}&redirectURL=${CONFIG.auth1.redirectUrl}`;

    const href = `${CONFIG.auth1.main}`
    const response = NextResponse.redirect(new URL(href, request.url))

    // request.cookies.getAll().forEach(item => {
    //   response.cookies.set(item.name, '', {
    //     expires: new Date(0),
    //     domain: `${CONFIG.auth1.domain}`,
    //     path: '/',
    //   });
    // })

    return response
  }

  const basePath = '/' + request.nextUrl.pathname.split('/').slice(1, 3).join('/');

  // Kiểm tra xem path có cần check permission không
  const requiredPermissions = ROUTE_PERMISSIONS.get(basePath);

  if (requiredPermissions) {
    const permissions = JSON.parse(request.cookies.get(COOKIE_NAME.PERMISSIONS)?.value || '[]');
    const hasPermission = permissions.some((p: any) =>
      requiredPermissions.includes(p.permission)
    );

    if (!hasPermission) {
      return NextResponse.redirect(new URL('/error/404', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};