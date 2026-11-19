import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from './api.config';

export interface Produto {
    id: number;
    nome: string;
    cor: string;
    preco: number;
    estoque: number;
    categoriaId: number;
    categoriaNome: string;
}

export interface ProdutoRequest {
    nome: string;
    cor: string;
    preco: number;
    estoque: number;
    categoriaId: number;
}

@Injectable({ providedIn: 'root'})
export class ProdutoService {
    private http = inject(HttpClient);
    private url = `${API_URL}/produtos`;

    //Sem filtros lista todos. Com filtros: GET /produtos?nome=caneta&cor=azul&precoMax=10
    listar(nome = '', cor = '', precoMax: number | null = null): Observable<Produto[]> {
        let params = new HttpParams();
        if (nome) params = params.set('nome', nome);
        if (cor) params = params.set('cor', cor);
        if (precoMax !== null) params = params.set('precoMax', precoMax);

        return this.http.get<Produto[]>(this.url, { params });
    }

    buscar(id: number): Observable<Produto> {
        return this.http.get<Produto>(`${this.url}/${id}`);
    }

    criar(produto: ProdutoRequest): Observable<Produto> {
        return this.http.post<Produto>(this.url, produto);
    }

    atualizar(id: number, produto: ProdutoRequest): Observable<Produto> {
        return this.http.put<Produto>(`${this.url}/${id}`, produto);
    }

    excluir(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}
