import { Component,Input} from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

const deleteComputeMutation = gql`
  mutation DeleteCompute($deleteComputeId: ID!) {
    deleteCompute(id: $deleteComputeId) {
      id
    }
  }
`;

@Component({
  selector: 'app-eliminar',
  templateUrl: './eliminar.component.html',
  styleUrls: ['./eliminar.component.css']
})
export class EliminarComponent {
  @Input()id: string = "";

  constructor(private apollo: Apollo) {}

  deleteData() {
    this.apollo.mutate({
      mutation: deleteComputeMutation,
      variables: {
        deleteComputeId: this.id
      }
    }).subscribe({
      next: (result) => {
        console.log('Datos eliminados:', result.data);
        alert('Computador eliminado');
        this.id = ""; 
        window.location.reload();
      },
      error: (error) => {
        alert('Error al eliminar los datos.');
      }
    });
  }
}