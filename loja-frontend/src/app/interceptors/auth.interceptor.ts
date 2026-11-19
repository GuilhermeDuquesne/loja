import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MensagemService } from '../services/mensagem.service';

//Roda em TODA requisição HTTP: coloca o token e trata o erro 401
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const mensagem = inject(MensagemService);

    const ehLogin = req.url.endsWith('/auth/login');
    const token = auth.token();

    //Envia o token no cabeçalho Authorization: Bearer TOKEN
    const requisicao = token && !ehLogin
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

    return next(requisicao).pipe(
        catchError((erro: unknown) => {
            //401 fora do login = token vencido ou inválido, volta para o login
            if (erro instanceof HttpErrorResponse && erro.status === 401 && !ehLogin) {
                auth.logout();
                mensagem.erro('Sua sessão expirou. Faça login novamente.');
                router.navigate(['/login']);
            }
            return throwError(() => erro);
        }),
    );
};
