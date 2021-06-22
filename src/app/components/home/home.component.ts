import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }
  /* This function is invoked when user clicks on the lets find the queen button in home page
  and user will navigated to the find page */
  findFalcone() {
    this.router.navigate(['/find']);
  }
}
