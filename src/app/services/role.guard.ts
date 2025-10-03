import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { CanActivateFn } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data?.['roles'] as number[] | undefined;
  const userRole = auth.getUserRole();

  // Si no hay usuario, siempre redirige
  if (!userRole) {
    router.navigate(['/login']);
    return false;
  }

  // Si no hay roles definidos en la ruta -> acceso libre para cualquier user con sesión
  if (!allowedRoles) {
    return true;
  }

  // Si hay roles definidos, valida
  if (allowedRoles.includes(userRole)) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
