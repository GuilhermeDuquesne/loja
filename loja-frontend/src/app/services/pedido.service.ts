import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from './api.config';

export interface ItemPedido {
    produtoId: number;
    produtoNome: string;
    quantidade: number;
    precoUnitario: number;
    subtotal: number;
}

export interface Pedido {
    id: number;
    cliente: string;
    data: string;
    total: number;
    itens: ItemPedido[];
}

export interface PedidoRequest {
    cliente: string;
    itens: { produtoId: number; quantidade: number }[];
}

@Injectable({ providedIn: 'root'})
export class PedidoService {
    private http = inject(HttpClient);
    private url = `${API_URL}/pedidos`;

    listar(): Observable<Pedido[]> {
        return this.http.get<Pedido[]>(this.url);
    }

    buscar(id: number): Observable<Pedido> {
        return this.http.get<Pedido>(`${this.url}/${id}`);
    }

    criar(pedido: PedidoRequest): Observable<Pedido> {
        return this.http.post<Pedido>(this.url, pedido);
    }

    excluir(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}
