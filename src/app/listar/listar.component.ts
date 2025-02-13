import { Component } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Computer } from './Computer';
import * as tslib from 'tslib';

const getComputes = gql`
  query {
    getAllComputes {
      id
      name
      mark
      price
      size
    }
  }
`;

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarComponent {
  computers: Computer[] = [];
  selectedComputerId: string = "";

  constructor(private apollo: Apollo) {}

  selectComputer(id: string) {
    this.selectedComputerId = id;
  }

  ngOnInit() {
    this.apollo.query<{ getAllComputes: Computer[] }>({
      query: getComputes,
    })
    .subscribe({
      next: (result) => {
        this.computers = result.data.getAllComputes;        
      }
    });
  }
}