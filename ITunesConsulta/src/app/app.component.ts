import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ITunesService } from './itunes.service';
import { FavoritoRequest } from './favorito-request.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class AppComponent {
  title = 'Biblioteca';
  titleFavorite = 'Favoritos';
  titleSearch = 'Búsqueda';
  favoritos: FavoritoRequest[] = [];
  bandName: string = '';
  songs: any[] = [];
  isLoading: boolean = false;
  mostrarTablaFavoritos: boolean = false;

  constructor(private iTunesService: ITunesService) {}

  search() {
    if (this.bandName.trim()) {
      this.isLoading = true;

      forkJoin({
        searchResults: this.iTunesService.searchTracks(this.bandName),
        favoritos: this.iTunesService.obtenerFavoritos()
      }).subscribe(
        ({ searchResults, favoritos }) => {
          const favoritosIds = favoritos
            .filter((fav) => fav.nombre_banda === this.bandName)
            .map((fav) => fav.cancion_id);

          this.songs = searchResults.canciones.map((song: any) => ({
            ...song,
            isFavorite: favoritosIds.includes(song.cancion_id)
          }));

          this.isLoading = false;
        },
        (error) => {
          console.error('Error al realizar la búsqueda o al obtener favoritos:', error);
          this.isLoading = false;
        }
      );
    } else {
      alert('Por favor, ingrese el nombre de la banda');
    }
  }

  toggleFavorite(song: any) {
    song.isFavorite = !song.isFavorite;

    if (song.isFavorite) {
      const favoritoRequest: FavoritoRequest = {
        nombre_banda: this.bandName,
        cancion_id: song.cancion_id,
        usuario: 'Oscar',
        ranking: '5/5'
      };

      this.iTunesService.agregarFavorito(favoritoRequest).subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.error('Error al agregar favorito:', error);
          song.isFavorite = false;
        }
      );
    }
  }

  mostrarFavoritos() {
    this.iTunesService.obtenerFavoritos().subscribe(
      (favoritos) => {
        this.favoritos = favoritos;
        this.mostrarTablaFavoritos = true;
      },
      (error) => {
        console.error('Error al obtener favoritos:', error);
      }
    );
  }
}
