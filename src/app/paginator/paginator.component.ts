import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html'
})
export class PaginatorComponent implements OnInit, OnChanges{
  //inyeta paginador en pagina hija
  @Input() paginadorHijo: any;
  paginas : number[];

  //parametros para controlar los rangos del paginador
  desde: number;
  hasta: number;
  
  constructor() { }

  //Este metodo se ejecutac ada vez que cambia el objeto que estamos heredando, en este caso el paginadorHijo, el onInit se ejecuta una sola vez en el ciclo de vida de angular
  ngOnChanges(changes: SimpleChanges){
    let paginadorActualizado = changes['paginadorHijo'];

    if(paginadorActualizado.previousValue){ // actualiza el paginador solo si tiene una version anterior, es decir se cambio durante el ciclo de vida
      this.calcularPaginador();
    }
  }

  ngOnInit(): void {
    this.calcularPaginador();
  }

  private calcularPaginador() : void {
    this.desde = Math.min(Math.max(1,this.paginadorHijo.number - 4), this.paginadorHijo.totalPages - 5);
    this.hasta = Math.max(Math.min(this.paginadorHijo.totalPages, this.paginadorHijo.number + 4),  6);
    if(this.paginadorHijo.totalPages > 5) {
      this.paginas = new Array(this.hasta - this.desde + 1).fill(0).map((valor, indice)=> indice + this.desde);
    }
    else {
      //fill llena el arreglo de 0
    this.paginas = new Array(this.paginadorHijo.totalPages).fill(0).map((valor, indice)=> indice+1);
  }
  }

}