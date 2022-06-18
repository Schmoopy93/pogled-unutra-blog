import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

   setMode = false;

  receiveMode($event) {
    this.setMode = $event;
    localStorage.setItem("theme", JSON.stringify(this.setMode === true));
  }

}
