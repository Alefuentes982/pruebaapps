export interface UsuarioLogeado {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string; // Token de acceso
  refreshToken: string
}
