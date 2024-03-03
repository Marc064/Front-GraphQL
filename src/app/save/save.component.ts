// save.component.ts
import { Component } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

const createComputeMutation = gql`
  mutation CreateCompute($id: ID!, $name: String!, $mark: String!, $price: Float!, $size: Float) {
    createCompute(id: $id, name: $name, mark: $mark, price: $price, size: $size) {
      id
      name
      mark
      price
      size
    }
  }
`;

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.css']
})
export class SaveComponent {
  id: number = 0;
  name: string = '';
  mark: string = '';
  price: number = 0;
  size: number = 0; 
  showPopup: boolean = false;

  constructor(private apollo: Apollo) {}

  openPopup() {
    this.showPopup = true;
  }

  saveData() {
    if (!this.name || !this.mark || !this.price || !this.size) {
      alert('Por favor, complete todos los campos antes de guardar.');
      return; 
    }
    this.apollo.mutate({
      mutation: createComputeMutation,
      variables: {
        id: this.id,
        name: this.name,
        mark: this.mark,
        price: this.price,
        size: this.size 
      }
    }).subscribe({
      next: (result) => {
        console.log('Datos guardados:', result.data);
        this.showPopup = false;
        this.id = 0; 
        this.name = '';
        this.mark = '';
        this.price = 0;
        this.size = 0; 
        alert('Computador guardado');
        window.location.reload();
      },
      error: (error) => {
        alert('Error al guardar los datos:');
      }
    });
  }
}
