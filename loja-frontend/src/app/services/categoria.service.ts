import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from './api.config';
import { Produto } from './produto.service';

export interface Categoria {
    id: number;
    nome: string;
}

export interface CategoriaRequest {
    nome: string;
}

@Injectable({ providedIn: 'root'})
export class CategoriaService {
    private http = inject(HttpClient);
    private url = `${API_URL}/categorias`;

    listar(): Observable<Categoria[]> {
        return this.http.get<Categoria[]>(this.url);
    }

    buscar(id: number): Observable<Categoria> {
        return this.http.get<Categoria>(`${this.url}/${id}`);
    }

    //Consulta com filtro no path: GET /categorias/{id}/produtos
    listarProdutos(id: number): Observable<Produto[]> {
        return this.http.get<Produto[]>(`${this.url}/${id}/produtos`);
    }

    criar(categoria: CategoriaRequest): Observable<Categoria> {
        return this.http.post<Categoria>(this.url, categoria);
    }

    atualizar(id: number, categoria: CategoriaRequest): Observable<Categoria> {
        return this.http.put<Categoria>(`${this.url}/${id}`, categoria);
    }

    excluir(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}
