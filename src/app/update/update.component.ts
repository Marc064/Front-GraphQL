import { Component, Input } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Computer } from '../listar/Computer';

const getComputes = gql`
  query GetComputerById($id: ID!) {
    getComputeByID(id: $id) {
      id
      name
      mark
      price
      size
    }
  }
`;

const updateComputeMutation = gql`
  mutation UpdateCompute($id: ID!, $name: String!, $mark: String!, $price: Float!, $size: Float!) {
    updateCompute(id: $id, name: $name, mark: $mark, price: $price, size: $size) {
      id
      name
      mark
      price
      size
    }
  }
`;

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent {
  @Input() id: string = '';

  name: string = '';
  mark: string = '';
  price: number = 0;
  size: number = 0;
  showPopup: boolean = false;

  constructor(private apollo: Apollo) {}

  openPopup() {
    this.apollo
      .query<{ getComputeByID: Computer }>({
        query: getComputes,
        variables: { id: this.id }
      })
      .subscribe((result) => {
        const computerDetails = result.data.getComputeByID;
        if (computerDetails) {
          this.name = computerDetails.name;
          this.mark = computerDetails.mark;
          this.price = computerDetails.price;
          this.size = computerDetails.size !== null ? computerDetails.size : 0;
          this.showPopup = true;
        } else {
          console.error('No se encontraron detalles de la computadora.');
        }
      });
  }

  updateData() {
    if (!this.name || !this.mark || !this.price) {
      alert('Por favor, complete todos los campos antes de actualizar.');
      return;
    }
    this.apollo.mutate({
      mutation: updateComputeMutation,
      variables: {
        id: this.id,
        name: this.name,
        mark: this.mark,
        price: this.price,
        size: this.size
      }
    }).subscribe({
      next: (result) => {
        console.log('Datos actualizados:', result.data);
        this.showPopup = false;
        this.resetValues();
        alert('Computador actualizado');
        window.location.reload();
      },
      error: (error) => {
        alert('Error al actualizar los datos.');
      }
    });
  }

  closePopup() {
    this.showPopup = false;
    this.resetValues();
  }

  resetValues() {
    this.name = '';
    this.mark = '';
    this.price = 0;
    this.size = 0;
  }
}
