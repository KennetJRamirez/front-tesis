// src/app/services/role.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { CanActivateFn } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data?.['roles'] as number[];
  const userRole = auth.getUserRole();
  if (userRole && allowedRoles.includes(userRole)) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
