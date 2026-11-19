import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MensagemService } from '../services/mensagem.service';

//Impede o acesso às telas internas sem login
export const authGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.logado()) return true;
    return router.createUrlTree(['/login']);
};

//Impede o acesso de quem não é ADMIN (telas de cadastro e edição)
export const adminGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const mensagem = inject(MensagemService);

    if (auth.ehAdmin()) return true;
    mensagem.erro('Apenas administradores podem acessar esta tela.');
    return router.createUrlTree(['/home']);
};
