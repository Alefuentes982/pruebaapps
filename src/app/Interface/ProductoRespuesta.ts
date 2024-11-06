import { Producto } from './../Interface/Producto';

export interface ProductoRespuesta {
  products: Producto[];
  total: number;
  skip: number | null;
  limit: number;
}
