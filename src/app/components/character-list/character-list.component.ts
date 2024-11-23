import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Character } from '../../models/character';
import { CharacterService } from '../../service/character.service';
import { MatDialog } from '@angular/material/dialog';
import { EditCharacterDialogComponent } from '../edit-character-dialog/edit-character-dialog.component';
import Swal from 'sweetalert2';
import { SeeCharacterDialogComponent } from '../see-character-dialog/see-character-dialog.component';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatInputModule,
    MatSortModule,
  ],
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css'],
})
export class CharacterListComponent implements OnInit, AfterViewInit {
  characters: Character[] = [];
  displayedColumns: string[] = ['id', 'image', 'name', 'status', 'species', 'acciones'];
  dataSource = new MatTableDataSource<Character>();

  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private characterService: CharacterService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.obtenerPersonajes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  obtenerPersonajes() {
    this.characterService.getCharacters().subscribe((data: any) => {
      this.characters = data.results.map((character: any) => ({
        id: character.id,
        name: character.name,
        status: character.status,
        species: character.species,
        image: character.image,
      }));
      this.dataSource.data = this.characters; // Asignar datos al dataSource
      console.log(this.characters);
    });
  }

  eliminarPersonaje(id: number){
    Swal.fire({
      title: "Estás seguro de que deseas eliminar este elemento?",
      text: "No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        // Método para eliminar un elemento
        this.characters = this.characters.filter(character => character.id !== id);
        this.dataSource.data = this.characters; // Actualizar el dataSource
        console.log(this.characters);
        Swal.fire({
          title: "Eliminado!",
          text: "Elemento eliminado éxitosamente!",
          icon: "success"
        });
      }
    });
  }

  openEditDialog(character: Character): void {
    const dialogRef = this.dialog.open(EditCharacterDialogComponent, {
      width: '400px',
      data: { ...character },
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.characters.findIndex(c => c.id === character.id);
        if (index !== -1) {
          this.characters[index] = { ...this.characters[index], ...result };
          this.dataSource.data = [...this.characters]; // Refrescar dataSource
        }
      }
    });
  }

  openSeeDialog(character: Character): void {
    const dialogRef = this.dialog.open(SeeCharacterDialogComponent, {
      width: '400px',
      data: { ...character },
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.characters.findIndex(c => c.id === character.id);
        if (index !== -1) {
          this.characters[index] = { ...this.characters[index], ...result };
          this.dataSource.data = [...this.characters]; // Refrescar dataSource
        }
      }
    });
  }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
