import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { FavoritoRequest } from './favorito-request.model';

@Injectable({
  providedIn: 'root'
})
export class ITunesService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  searchTracks(bandName: string): Observable<any> {
    const params = new HttpParams().set('name', bandName);
    return this.http.get<any>(`${this.apiUrl}/search_tracks`, { params });
  }

  agregarFavorito(favoritoRequest: FavoritoRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/favoritos`, favoritoRequest, { responseType: 'text' });
  }

  obtenerFavoritos(): Observable<FavoritoRequest[]> {
    return this.http.get<FavoritoRequest[]>(`${this.apiUrl}/favoritos`);
  }
}
