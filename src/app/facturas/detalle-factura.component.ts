import { Component, OnInit } from '@angular/core';
import { FacturasService } from './services/facturas.service';
import { Factura } from './models/factura';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html'
})
export class DetalleFacturaComponent implements OnInit {

  public factura : Factura;
  titulo : string = "Factura";

  constructor(private facturasService : FacturasService, private activatedRoute :ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => { //observador para cada vez que cambie el parametro page entre las paginas
      let id = +params.get('id');
      if(id){
        this.getFactura(id);
      }
  });
}

  getFactura(id: number) {
    this.facturasService.getFactura(id).subscribe(resp => {
      console.log(resp);
      this.factura = resp as Factura;
    });
  }
}
