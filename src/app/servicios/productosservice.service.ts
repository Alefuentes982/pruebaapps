import { Injectable } from '@angular/core';
import { Producto } from './../Interface/Producto';
import { ProductoRespuesta } from './../interface/ProductoRespuesta';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthserviceService } from './../servicios/authservice.service';

@Injectable({
  providedIn: 'root'
})
export class ProductosserviceService {

  private readonly URL_PRODUCTOS = 'https://dummyjson.com/auth/products';
  private saltar = 0;
  private cantidad = 10;
  public total = 0;

  // Observador para almacenar los productos
  private $productos = new BehaviorSubject<Producto[]>([]);
  public producto = this.$productos.asObservable();

  constructor(
    private http: HttpClient,
    private auth: AuthserviceService
  ) { }

  public listarProductos() {
    // Construye la URL inicial para obtener la primera página de productos
    const url_nueva = `${this.URL_PRODUCTOS}?limit=${this.cantidad}&skip=${this.saltar}`;
    console.log('URL de solicitud:', url_nueva);

    this.http.get<ProductoRespuesta>(url_nueva, {
      headers: {
        'Authorization': 'Bearer ' + this.auth.accessToken,
        'Content-Type': 'application/json'
      }
    })
      .subscribe(datos => {
        console.log('Productos recibidos:', datos.products);
        const productosActuales = this.$productos.getValue();
        // Acumula los nuevos productos con los existentes
        this.$productos.next([...productosActuales, ...datos.products]);
        this.total = datos.total;

        // Verifica si se llegó al total de productos
        if (this.saltar + this.cantidad >= this.total) {
          this.$productos.complete(); // Marca el observable como completado
        }
      });
  }


  public siguientesProductos() {
    // Incrementa el `saltar` para cargar la siguiente página
    this.saltar += this.cantidad;
    this.listarProductos();
  }

  public productosAnterior() {
    // Decrementa "saltar" para obtener la página anterior, asegurando que no sea negativo
    this.saltar = Math.max(0, this.saltar - this.cantidad);
    const url_nueva = `${this.URL_PRODUCTOS}?limit=${this.cantidad}&skip=${this.saltar}`;

    this.http.get<ProductoRespuesta>(url_nueva, {
      headers: {
        'Authorization': 'Bearer ' + this.auth.accessToken,
        'Content-Type': 'application/json'
      }
    })
      .subscribe(datos => {
        // Actualiza el observable con la página anterior de productos
        this.$productos.next(datos.products);
        this.total = datos.total;
      });
  }
}
