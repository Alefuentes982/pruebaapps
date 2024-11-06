import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthserviceService } from './../servicios/authservice.service';
import { Router } from '@angular/router';

export const loginGuard: CanActivateFn = (route, state) => {
  const authIn = inject(AuthserviceService) as AuthserviceService;
  const routerIn = inject(Router) as Router;

  // Verifica si el token de acceso es nulo
  if (authIn.accessToken == null) {
    // Redirige al inicio de sesión si el usuario no está autenticado
    routerIn.navigate(['/']);
    return false;
  }
  // Permite la navegación si el usuario está autenticado
  return true;
};
