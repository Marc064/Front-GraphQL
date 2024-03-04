import { Component } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

const updateComputeMutation = gql`
  mutation UpdateCompute($id: ID!, $name: String!, $mark: String!, $price: Float!, $size: Float) {
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
  id: string = "";
  name: string = '';
  mark: string = '';
  price: number = 0;
  size: number = 0;
  showPopup: boolean = false;

  constructor(private apollo: Apollo) {}

  openPopup() {
    this.showPopup = true;
    this.fetchDataById();
  }

  fetchDataById() {
    if (!this.id) {
      alert('Por favor, ingrese un ID válido.');
      return;
    }
  
    const getComputeQuery = gql`
      query GetCompute($id: ID!) {
        getComputeByID(id: $id) {
          id
          name
          mark
          price
          size
        }
      }
    `;
  
    this.apollo.watchQuery<any>({
      query: getComputeQuery,
      variables: {
        id: this.id
      }
    }).valueChanges.subscribe(({ data }) => {
      const computeData = data.getComputeByID;
      if (computeData) {
        // Llena los campos con los datos obtenidos
        this.name = computeData.name;
        this.mark = computeData.mark;
        this.price = computeData.price;
        this.size = computeData.size;
      } else {
        alert('No se encontraron datos para el ID proporcionado.');
      }
    }, (error) => {
      alert('Error al obtener los datos:');
      console.error(error);
    });
  }
   

  updateData() {
    if (!this.name || !this.mark || !this.price ) {
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
        this.id = ""; 
        this.name = '';
        this.mark = '';
        this.price = 0;
        this.size = 0; 
        alert('Computador actualizado');
        window.location.reload();
      },
      error: (error) => {
        alert('Error al actualizar los datos:');
      }
    });
  }
}