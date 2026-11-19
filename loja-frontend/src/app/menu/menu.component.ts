import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MensagemService } from '../services/mensagem.service';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  protected auth = inject(AuthService);
  private router = inject(Router);
  private mensagem = inject(MensagemService);

  sair() {
    this.auth.logout();
    this.mensagem.sucesso('Você saiu do sistema.');
    this.router.navigate(['/login']);
  }
}
