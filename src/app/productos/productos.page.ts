import { Component, OnInit } from '@angular/core';
import { ProductosserviceService } from './../servicios/productosservice.service';
import { Producto } from './../Interface/Producto';
import { ViewWillEnter, ViewDidLeave } from '@ionic/angular';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements ViewWillEnter, ViewDidLeave {
  public productos: Producto[] = [];
  private subProducto!: Subscription;
  public cargandoMas: boolean = false; // Flag para evitar múltiples solicitudes
  public hayMasProductos: boolean = true; // Flag para controlar si hay más productos

  constructor(
    private prdS: ProductosserviceService,
  ) { }

  ionViewWillEnter(): void {
    // Reinicia la lista de productos y el estado de las banderas
    this.productos = [];
    this.hayMasProductos = true;
    this.cargandoMas = false;

    // Se suscribe al observable de productos
    this.subProducto = this.prdS.producto.subscribe(productos => {
      if (productos.length > 0) {
        this.productos = [...this.productos, ...productos];
        this.cargandoMas = false; // Detiene el estado de carga
      } else {
        this.hayMasProductos = false; // No hay más productos por cargar
      }
    });

    // Llama al método para listar productos al cargar la vista
    this.prdS.listarProductos();
  }

  ionViewDidLeave(): void {
    // Cancela la suscripción al salir de la vista
    if (this.subProducto) {
      this.subProducto.unsubscribe();
    }
  }

  public cargarMasProductos(event: any) {
    if (this.cargandoMas || !this.hayMasProductos) {
      event.target.complete();
      return;
    }

    this.cargandoMas = true;
    this.prdS.siguientesProductos(); // Llama al servicio para cargar más productos

    this.subProducto.add(() => {
      event.target.complete();
      this.cargandoMas = false;

      // Verifica si no hay más productos comparando con el total de productos en el servicio
      if (this.productos.length >= this.prdS.total) {
        this.hayMasProductos = false;
        event.target.disabled = true;
      }
    });
  }
}
