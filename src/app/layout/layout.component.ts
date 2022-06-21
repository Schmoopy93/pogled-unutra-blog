import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const theme = JSON.parse(localStorage.getItem("theme"));
    if(theme === false){
      this.receiveMode(false);
    }
    else{
      this.receiveMode(true);
    }
    
  }

   setMode = false;

  receiveMode($event) {
    this.setMode = $event;
  }

}
