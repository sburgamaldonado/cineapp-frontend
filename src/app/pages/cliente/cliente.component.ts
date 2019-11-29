import { switchMap } from 'rxjs/operators';
import { ClienteService } from './../../_service/cliente.service';
import { Cliente } from './../../_model/cliente';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ClienteDialogoComponent } from './cliente-dialogo/cliente-dialogo.component';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  cantidad: number = 0;
  dataSource: MatTableDataSource<Cliente>;
  displayedColumns: string[] = ['idCliente', 'nombre', 'apellidos', 'fechaNac', 'acciones'];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private clienteService: ClienteService,
    private dialog: MatDialog,
    private snack: MatSnackBar) { }

  ngOnInit() {
    this.clienteService.clienteCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.clienteService.mensajeCambio.subscribe(data => {
      this.snack.open(data, 'AVISO', {
        duration: 2000
      });
    });

    this.clienteService.listarPageable(0, 10).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  eliminar(cliente: Cliente) {
    this.clienteService.eliminar(cliente.idCliente).pipe(switchMap(() => {
      return this.clienteService.listar();
    })).subscribe(data => {
      this.clienteService.clienteCambio.next(data);
      this.clienteService.mensajeCambio.next('SE ELIMINO');
    })
  }

  openDialog(cliente?: Cliente) {
    let cli = cliente != null ? cliente : new Cliente();
    this.dialog.open(ClienteDialogoComponent, {
      width: '600px',
      height: '80%',
      data: cli
    });
  }

  filter(x: string) {
    this.dataSource.filter = x.trim().toLowerCase();
  }

  mostrarMas(e: any) {
    this.clienteService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }

}