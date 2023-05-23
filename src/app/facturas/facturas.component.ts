import { Component, OnInit } from '@angular/core';
import { Factura } from './models/factura';
import { ClienteService } from '../service/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable} from 'rxjs';
import { map, mergeMap} from 'rxjs/operators';
import { FacturasService } from './services/facturas.service';
import { Producto } from './models/producto';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ItemFactura } from './models/item-factura';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'
})
export class FacturasComponent implements OnInit {

  titulo : string = 'Nueva Factura';
  factura : Factura = new Factura();
  autoCompleteControl = new FormControl('');
  //productosObjeto: Producto[];
  productosFiltrados: Observable<Producto[]>;

  constructor(private clienteService : ClienteService, private activatedRoute : ActivatedRoute, private facturaService: FacturasService,
    private router : Router) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let clienteId = +params.get('clienteId');
      this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente);
      console.log(this.factura);
      
    });

    this.productosFiltrados = this.autoCompleteControl.valueChanges.pipe(

      map(value => typeof value === 'string'? value : value),
      mergeMap(value => value? this._filter(value || '') : [])
    );

    /*this.facturaService.obtenerProductos().subscribe(resp => {
      console.log(resp);
      this.productosObjeto = resp
      this.productos = this.productosObjeto.map(a => a.nombre);//devuelve otro array de string
    });*/
  }

  private _filter(value: string) : Observable<Producto[]> {
    const filterValue = value.toLowerCase();
    return this.facturaService.filtrarProducto(filterValue);
  }

  /**
   * Muestra nombre del producto en el buscandor de la vista factura component
   * @param producto
   * @returns 
   */
  mostrarNombre(producto? : Producto) : string | undefined {
    return producto ? producto.nombre : undefined;
  }

  /**
   * Obtiene el producto desde el evento del autocompletar y lo agrega como un nuevo item de la factura,
   * posteriormente limpia el campo del buscador.
   * @param event 
   */
  seleccionarProducto(event: MatAutocompleteSelectedEvent) : void {
    let producto = event.option.value as Producto;
    console.log(producto);

    if(this.existeItem(producto.id)){
      this.incrementarCantidad(producto.id);
    }
    else {
    let nuevoItem = new ItemFactura();
    nuevoItem.producto = producto;
    this.factura.items.push(nuevoItem);
    }

    this.autoCompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  actualizarCantidad(id : number, event): void {
    let cantidad : number = event.target.value as number;

    if(cantidad == 0){
      return this.eliminarProducto(id);
    }

    this.factura.items = this.factura.items.map((item : ItemFactura) => {
      if(item.producto.id === id){
        item.cantidad = cantidad;
      }
      return item;
    });
  }

  existeItem(id: number): boolean {
    let existe = false;
    this.factura.items.forEach((item : ItemFactura) => {
      if(item.producto.id === id){
        existe = true;
      }
    });
    return existe;
  }

  incrementarCantidad(id: number): void {
    this.factura.items = this.factura.items.map((item : ItemFactura) => {
      if(item.producto.id === id){
        ++item.cantidad;
      }
      return item;
    });
  }

  eliminarProducto(idProducto: number): void {
    this.factura.items = this.factura.items.filter((item : ItemFactura)=> idProducto != item.producto.id);
  }

  guardarFactura() : void {
    this.facturaService.guardarFactura(this.factura).subscribe(resp => {
      Swal.fire(this.titulo, `Factura ${resp.descripcion} creada con exito!`, 'success');
      this.router.navigate(['/clientes']);
    });
  }

}

