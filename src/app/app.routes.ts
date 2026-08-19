import { Routes } from '@angular/router';
import { AdminLayout } from './components/admin-layout/admin-layout';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { AdminProductos } from './components/admin-productos/admin-productos';
import { AdminCategorias } from './components/admin-categorias/admin-categorias';
import { AdminProveedores } from './components/admin-proveedores/admin-proveedores';
import { AdminUsuarios } from './components/admin-usuarios/admin-usuarios';
import { AdminReportes } from './components/admin-reportes/admin-reportes';
import { AdminConfiguracion } from './components/admin-configuracion/admin-configuracion';
import { AdminEspecificaciones } from './components/admin-especificaciones/admin-especificaciones';
import { AdminMarcas } from './components/admin-marcas/admin-marcas';
import { LoginComponent } from './components/login/login';
import { RegistroComponent } from './components/registro/registro';
import { TiendaComponent } from './components/tienda/tienda'; 
import { ProductoDetalleComponent } from './components/producto-detalle/producto-detalle';
import {MisPedidosComponent} from './components/mis-pedidos/mis-pedidos';
import { DetallePedidoComponent } from './components/detalle-pedido/detalle-pedido';
import { AdminPedidos } from './components/admin-pedidos/admin-pedidos';
import { AdminDetallePedido } from './components/admin-detalle-pedido/admin-detalle-pedido';
import { MisDireccionesComponent } from './components/mis-direcciones/mis-direcciones';
import {CuentaComponent} from './components/cuenta/cuenta';
import { PagoResultadoComponent } from './components/pago-resultado/pago-resultado'; 


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'mis-direcciones', component: MisDireccionesComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'tienda/producto/:id', component: ProductoDetalleComponent },
  { path: 'tienda', component: TiendaComponent },
  { path: 'cuenta', component: CuentaComponent },
  { path: 'mis-pedidos',component: MisPedidosComponent },  
  { path: 'mis-pedidos/:id', component: DetallePedidoComponent },
  { path: 'pago/resultado', component: PagoResultadoComponent },
  { path: 'admin', component: AdminLayout, children: [
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    { path: 'dashboard', component: AdminDashboard }, 
    { path: 'productos', component: AdminProductos },
    { path: 'categorias', component: AdminCategorias }, 
    { path: 'proveedores', component: AdminProveedores },
    
    { path: 'usuarios', component: AdminUsuarios }, 
    { path: 'pedidos', component: AdminPedidos },
    { path: 'pedidos/:id', component: AdminDetallePedido },

    { path: 'reportes', component: AdminReportes },
    { path: 'configuracion', component: AdminConfiguracion },
    { path: 'especificaciones', component: AdminEspecificaciones },
    { path: 'marcas', component: AdminMarcas },
  ] },
  { path: '**', redirectTo: 'login' },

];
