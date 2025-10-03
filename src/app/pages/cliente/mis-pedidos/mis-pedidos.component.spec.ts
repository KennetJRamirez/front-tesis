import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { MisPedidosComponent } from './mis-pedidos.component';
import { PedidoService } from '../../../services/pedido.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

describe('MisPedidosComponent', () => {
  let component: MisPedidosComponent;
  let fixture: ComponentFixture<MisPedidosComponent>;
  let pedidoServiceSpy: jasmine.SpyObj<PedidoService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    pedidoServiceSpy = jasmine.createSpyObj('PedidoService', ['getMisPedidos']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      // Importamos el componente standalone; él trae sus módulos (MatTable, MatCard, etc.)
      imports: [MisPedidosComponent, NoopAnimationsModule],
      providers: [
        { provide: PedidoService, useValue: pedidoServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();
  }));

  afterEach(() => {
    localStorage.removeItem('token');
    // Restaurar spies sobre Swal si los usamos
    if ((Swal.fire as any).and && (Swal.fire as any).and.originalFn) {
      (Swal.fire as any).and.callThrough();
    }
  });

  it('debe mostrar mensaje cuando no hay pedidos', () => {
    localStorage.setItem('token', 'fake-token'); // evitar el branch de "no token"
    pedidoServiceSpy.getMisPedidos.and.returnValue(of([])); // respuesta vacía
    spyOn(Swal, 'fire'); // evitar modal real
    fixture = TestBed.createComponent(MisPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // dispara ngOnInit -> cargarPedidos

    const host: HTMLElement = fixture.nativeElement;
    const noPedidos = host.querySelector('.no-pedidos');
    expect(noPedidos).toBeTruthy();
    expect(noPedidos?.textContent).toContain('No tienes pedidos');
    expect(Swal.fire).not.toHaveBeenCalled();
  });

  it('debe listar pedidos en la tabla', () => {
    localStorage.setItem('token', 'fake-token');
    const mockPedidos = [
      {
        id_pedido: 1,
        id_envio: 123,
        estado: 'En tránsito',
        costo: 45.5,
        fecha_asignacion: new Date().toISOString(),
        paquete: 'Caja grande',
        origen: 'Guatemala',
        destino: 'Mixco',
      },
    ] as any;
    pedidoServiceSpy.getMisPedidos.and.returnValue(of(mockPedidos));

    fixture = TestBed.createComponent(MisPedidosComponent);
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    // Ver que la tabla muestre el texto del paquete
    expect(host.textContent).toContain('Caja grande');
    // Opcional: verificar que hay filas (mat-row)
    const rows = host.querySelectorAll('tr.mat-row');
    expect(rows.length).toBeGreaterThan(0);
  });

  it('debe navegar al hacer click en "Ver mapa"', () => {
    localStorage.setItem('token', 'fake-token');
    const mockPedidos = [
      {
        id_pedido: 1,
        id_envio: 999,
        estado: 'En tránsito',
        costo: 10,
        fecha_asignacion: new Date().toISOString(),
        paquete: 'Sobre',
        origen: 'X',
        destino: 'Y',
      },
    ] as any;
    pedidoServiceSpy.getMisPedidos.and.returnValue(of(mockPedidos));

    fixture = TestBed.createComponent(MisPedidosComponent);
    fixture.detectChanges();

    // Buscar botón que tenga texto 'Ver mapa'
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const verMapaBtn = buttons.find(b => (b.nativeElement as HTMLButtonElement).textContent?.trim() === 'Ver mapa');
    expect(verMapaBtn).toBeDefined();

    verMapaBtn!.triggerEventHandler('click', null);
    expect(routerSpy.navigate).toHaveBeenCalledWith([`/dashboard/seguimiento/999`]);
  });

  it('debe mostrar error si no existe token (no llamar al servicio)', () => {
    localStorage.removeItem('token'); // aseguramos no token
    spyOn(Swal, 'fire');
    pedidoServiceSpy.getMisPedidos.and.returnValue(of([])); // si se llamara, respondería vacío

    fixture = TestBed.createComponent(MisPedidosComponent);
    fixture.detectChanges();

    expect(Swal.fire).toHaveBeenCalledWith('Error', 'No se encontró token de autenticación', 'error');
    expect(pedidoServiceSpy.getMisPedidos).not.toHaveBeenCalled();
  });
});
