import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {

  public titulo : string = 'Ups, creo que esta pagina no existe';

  constructor() { }

  ngOnInit(): void {
  }

}
