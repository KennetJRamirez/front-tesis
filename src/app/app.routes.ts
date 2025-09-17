import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { AdminComponent } from './pages/dashboard/admin/admin.component';
import { PedidoComponent } from './pages/cliente/pedido/pedido.component';
import { MisPedidosComponent } from './pages/cliente/mis-pedidos/mis-pedidos.component'; // <- nuevo
import { roleGuard } from './services/role.guard';
import { PedidosActivosComponent } from './pages/repartidor/pedidos-activos/pedidos-activos.component';
import { HistorialPedidosComponent } from './pages/repartidor/historial-pedidos/historial-pedidos.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [roleGuard],
    data: { roles: [1, 2, 3] },
    children: [
      { path: 'perfil', component: PerfilComponent },
      { path: 'admin', component: AdminComponent },
      { path: 'pedido', component: PedidoComponent },
      { path: 'mis-pedidos', component: MisPedidosComponent }, // <- NUEVO
      { path: '', redirectTo: 'perfil', pathMatch: 'full' }, // default
      { path: 'pedidos-activos', component: PedidosActivosComponent }, // repartidor
      { path: 'historial-pedidos', component: HistorialPedidosComponent }, // repartidor
    ],
  },
  { path: '**', redirectTo: 'login' },
];
