import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_URL } from './api.config';

//Formato da resposta do POST /auth/login
export interface LoginResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    usuario: string;
    perfil: string; //ADMIN ou COMUM
}

@Injectable({ providedIn: 'root'})
export class AuthService {
    private http = inject(HttpClient);

    //O token fica no localStorage para continuar logado ao atualizar a página
    token = signal<string | null>(localStorage.getItem('token'));
    usuario = signal<string | null>(localStorage.getItem('usuario'));
    perfil = signal<string | null>(localStorage.getItem('perfil'));

    logado = computed(() => this.token() !== null);
    ehAdmin = computed(() => this.perfil() === 'ADMIN');

    login(usuario: string, senha: string): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${API_URL}/auth/login`, { usuario, senha }).pipe(
            tap((resposta) => {
                localStorage.setItem('token', resposta.access_token);
                localStorage.setItem('usuario', resposta.usuario);
                localStorage.setItem('perfil', resposta.perfil);
                this.token.set(resposta.access_token);
                this.usuario.set(resposta.usuario);
                this.perfil.set(resposta.perfil);
            }),
        );
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('perfil');
        this.token.set(null);
        this.usuario.set(null);
        this.perfil.set(null);
    }
}
