export interface Paquete {
  descripcion: string;
  peso: number;
  dimensiones: string;
  fragil: boolean;
}

export interface Direccion {
  calle_principal: string;
  numero: string;
  calle_secundaria: string;
  zona: string;
  colonia_o_barrio: string;
  municipio: string;
  departamento: string;
  codigo_postal: string;
  referencias?: string;
}

export interface Destinatario {
  nombre: string;
  email: string;
  telefono: string;
}

// Request
export interface PedidoRequest {
  paquete: Paquete;
  direccion_origen: Direccion;
  direccion_destino: Direccion;
  destinatario: Destinatario;
}

// Response
export interface PedidoResponse {
  msg: string;
  id_pedido: number;
  id_repartidor: number;
  costo: number;
  km_destino: number;
}

// Repartidor
export interface Pedido {
  id_pedido: number;
  id_envio: number;
  estado: string;
  costo: number;
  fecha_asignacion: string;

  paquete: Paquete;
  direccion_origen: Direccion;
  direccion_destino: Direccion;
  destinatario: Destinatario;
}

