import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CuerpoLogin } from './../Interface/CuerpoLogin';
import { UsuarioLogeado } from './../interface/UsuarioLogeado';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
  private readonly URL_LOGIN: string = 'https://dummyjson.com/auth/login';
  public usuarioLogeado: UsuarioLogeado | null = null;
  public accessToken: string | null = null;

  // Observador de cargando
  private $cargando = new BehaviorSubject<boolean>(false);
  public cargando = this.$cargando.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public iniciarSesion(nombre_usuario: string, contrasenia: string) {
    // Activa el estado de carga
    this.$cargando.next(true);

    // Define el cuerpo de la solicitud usando la interfaz CuerpoLogin
    const cuerpo: CuerpoLogin = {
      username: nombre_usuario,
      password: contrasenia
    };

    // Envía la solicitud de autenticación
    this.http.post<UsuarioLogeado>(this.URL_LOGIN, JSON.stringify(cuerpo), {
      headers: {
        'Content-Type': 'application/json'
      }
    }).subscribe({
      next: (resultado) => {
        // Almacena los datos de autenticación
        this.usuarioLogeado = resultado;
        this.accessToken = resultado.accessToken;

        // Desactiva el estado de carga
        this.$cargando.next(false);

        // Navega a la página de productos
        this.router.navigate(['/productos']);
      },
      error: (error) => {
        console.error('Error en la autenticación:', error);

        // Desactiva el estado de carga en caso de error
        this.$cargando.next(false);
      }
    });
  }

  public cerrarSesion() {
    if (this.usuarioLogeado) {
      this.usuarioLogeado = null;
      this.accessToken = null;
    }
  }
}
