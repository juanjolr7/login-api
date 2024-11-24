# Reporte del Login y Consumo de APIs para obtener credenciales en Angular

## Objetivo del proyecto
El propósito de este proyecto es desarrollar una aplicación en Angular que permita a los usuarios iniciar sesión y, las credenciales para el login son obtenidas por una API pública proporcionada por la profesora. Tras tras la autenticación, visualizar una lista de los datos obtenidos desde otra API pública elegida a nuestro críterio, en este caso, personajes de la serie Rick and Morty. Para la construcción del proyecto, se utilizan componentes y servicios de Angular Material para la creación de una interfaz moderna y funcional.

## Requisitos Previos
#### Conocimientos básicos en Angular, TypeScript y HTML.
#### Tener instalado Angular CLI (npm install -g @angular/cli).
#### Entorno de desarrollo configurado con Node.js y npm.
#### Instalación de Angular Material (ng add @angular/material).
#### Conexión a API's públicas

#### API para la autenticación
```bash
https://api.escuelajs.co/api/v1/users
```

#### API para el consumo y listado
```bash
https://rickandmortyapi.com/api/character
```

## Parte 1: Creación del Servicio para Consumir la API
El servicio se encarga de realizar peticiones HTTP para obtener los datos de usuarios. A continuación, se muestra el código utilizado en user.service.ts:

```bash
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://api.escuelajs.co/api/v1/users';

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get(`${this.apiUrl}`);
  }
}
```

Explicación:

El método getUsers() utiliza el servicio HttpClient para realizar una solicitud GET a la API, devolviendo la lista de usuarios en formato JSON.

## Parte 2: Creación del Servicio para Consumir la API
El servicio se encarga de realizar peticiones HTTP para obtener los datos de los personajes de Rick and Morty. A continuación, se muestra el código utilizado en character.service.ts:

```bash
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private apiUrl = 'https://rickandmortyapi.com/api/character';

  constructor(private http: HttpClient) {}

  getCharacters(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }
}

```

Explicación:

El método getCharacters() utiliza el servicio HttpClient para realizar una solicitud GET a la API, devolviendo la lista de datos de personajes de Rick and Morty en formato JSON.

## Parte 3: Implementación del Login con Angular Material
Se ha creado un componente de login que permite a los usuarios iniciar sesión. El formulario se valida utilizando componentes de Angular Material, como MatFormField, MatInput, y MatButton.

Código del formulario de login (login.component.html):

```bash
<div class="login-container">
  <mat-card class="login-card">
    <h2>🔑 Iniciar Sesión</h2>
    <form (ngSubmit)="onSubmit()" class="login-form">
      <mat-form-field appearance="outline" class="form-field">
        <mat-label>Usuario</mat-label>
        <input matInput [(ngModel)]="username" name="username" required>
      </mat-form-field>
      <mat-form-field appearance="outline" class="form-field">
        <mat-label>Contraseña</mat-label>
        <input matInput type="password" [(ngModel)]="password" name="password" required>
      </mat-form-field>
      <button mat-raised-button color="primary" type="submit">Entrar</button>
    </form>
  </mat-card>
</div>
```

Lógica del Login (login.component.ts):

```bash
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username = '';
  password = '';
  users: Array<any> = [];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = Object.values(data);
    });
  }

  onSubmit() {
    const userExists = this.users.find(
      (user) => user.email === this.username && user.password === this.password
    );

    if (userExists) {
      this.router.navigate(['/users']);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Credenciales incorrectas!',
      });
    }
  }
}
```

Explicación:
#### ngOnInit() obtiene la lista de usuarios al cargar el componente.
#### onSubmit() verifica si las credenciales ingresadas coinciden con las de la API.
#### Si las credenciales son correctas, redirige a la página de usuarios; de lo contrario, muestra un mensaje de error.

## Parte 4: Mostrar Lista de Personajes de Rick and Morty en una Tabla
Una vez que el usuario ha iniciado sesión correctamente, se redirige a un componente que muestra una tabla con los personajes obtenidos de la API.

Código del Componente de Lista de Personajes (character-list.component.html):

```bash
<div class="container">
    <h2>Lista de Personajes</h2>
    <mat-form-field>
      <mat-label>Filtro</mat-label>
      <input matInput (keyup)="applyFilter($event)" placeholder="¿Qué desea buscar?" #input>
    </mat-form-field>
  
    <div class="mat-elevation-z8">
      <table mat-table [dataSource]="dataSource" class="table-striped table-bordered" matSort>
        <!-- ID Column -->
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
          <td mat-cell *matCellDef="let character">{{ character.id }}</td>
        </ng-container>

        <!-- Image Column -->
        <ng-container matColumnDef="image">
          <th mat-header-cell *matHeaderCellDef>Imagen</th>
          <td mat-cell *matCellDef="let character">
            <img style="border-radius: 50%;" [src]="character.image" alt="{{ character.name }}" width="50" height="50">
          </td>
        </ng-container>

        <!-- Name Column -->
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
          <td mat-cell *matCellDef="let character">{{ character.name }}</td>
        </ng-container>
  
        <!-- Status Column -->
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Estado</th>
          <td mat-cell *matCellDef="let character">{{ character.status }}</td>
        </ng-container>
  
        <!-- Species Column -->
        <ng-container matColumnDef="species">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Especie</th>
          <td mat-cell *matCellDef="let character">{{ character.species }}</td>
        </ng-container>

        <!-- Symbol Column -->
      <ng-container matColumnDef="acciones">
        <th mat-header-cell *matHeaderCellDef >Acciones</th>
        <td mat-cell *matCellDef="let character">
          <button 
          (click)="openSeeDialog(character)"   
            [attr.data-id]="character.id"
            type="button" 
            class="btn btn-primary btn-sm" 
            >
            <mat-icon>more</mat-icon>
          </button>
          
          <button 
          (click)="openEditDialog(character)"   
            [attr.data-id]="character.id"
            type="button" 
            class="btn btn-primary btn-sm" 
            >
            <mat-icon>edit</mat-icon>
          </button>
          <button
            type="button"
            class="btn btn-sm btn-danger"
            (click)="eliminarPersonaje(character.id)"
          >
            <mat-icon>delete</mat-icon>
          </button>
      </ng-container>
  
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
  
        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell" colspan="5">Ninguna coincidencia: "{{ input.value }}"</td>
        </tr>
      </table>
  
      <mat-paginator [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons></mat-paginator>
    </div>
  </div>
```

Lógica del Componente (character-list.component.ts):

```bash
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
```

Explicación:

#### obtenerPersonajes() obtiene la lista de personajes al cargar el componente.
#### eliminarPersonaje(id: number) elimina un dado de la tabla segun el id pasado a la función.
#### openEditDialog(character: Character) abre un modal para editar los datos del personaje pasado en la función para actualizarlo en la tabla.
#### openSeeDialog(character: Character) abre un modal para ver los datos del personaje pasado en la función.
#### applyFilter(event: Event) aplica el filtro y busqueda sobre la tabla.

## Parte 5: Ejecución del Proyecto
Para ejecutar la aplicación:
```bash
ng serve -o
```

## Resultado

### Login

![Captura de pantalla 2024-11-16 201718](https://github.com/user-attachments/assets/84b5cc39-a190-4cab-9324-25cecf636d66)

### Mensaje de error cuando hay credencias incorrectas

![Captura de pantalla 2024-11-16 201835](https://github.com/user-attachments/assets/e7aeba2e-d4f2-4a73-90c4-5862002bf321)


### Lista de usuarios consumida del api

