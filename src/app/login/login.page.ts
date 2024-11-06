import { Component } from '@angular/core';
import { ViewWillEnter, ViewDidLeave } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthserviceService } from './../servicios/authservice.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements ViewWillEnter, ViewDidLeave {
  public formulario!: FormGroup;
  public cargando_bloqueo: boolean = false;
  private subCargando!: Subscription;

  constructor(
    private fb: FormBuilder,
    private auth: AuthserviceService
  ) {
    // Configuración del formulario reactivo con validaciones
    this.formulario = fb.group({
      usuario: ['', [Validators.required]],
      contrasenia: ['', [Validators.required]]
    });
  }

  public validarFormulario() {
    const esValido = this.formulario.valid;
    if (!esValido) {
      return; // Si el formulario no es válido, detiene la ejecución
    }

    // Extrae los datos del formulario
    const datos = this.formulario.getRawValue();
    const usuario = datos['usuario'];
    const contrasenia = datos['contrasenia'];

    // Llama al método de autenticación del servicio
    this.auth.iniciarSesion(usuario, contrasenia);
  }

  public ionViewWillEnter(): void {
    // Se suscribe al estado de carga del servicio de autenticación
    this.subCargando = this.auth.cargando.subscribe(nuevoValor => {
      this.cargando_bloqueo = nuevoValor;
    });
  }

  public ionViewDidLeave(): void {
    // Cancela la suscripción cuando se sale de la vista
    if (this.subCargando) {
      this.subCargando.unsubscribe();
    }
  }
}
