import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { MensagemService } from '../../services/mensagem.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private mensagem = inject(MensagemService);

  usuario = '';
  senha = '';
  protected carregando = signal(false);

  entrar() {
    //Validação antes de enviar
    if (!this.usuario.trim() || !this.senha) {
      this.mensagem.erro('Informe o usuário e a senha.');
      return;
    }

    this.carregando.set(true);
    this.auth.login(this.usuario.trim(), this.senha)
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: () => {
          this.mensagem.limpar();
          this.router.navigate(['/home']);
        },
        error: (e) => {
          if (e.status === 401) this.mensagem.erro('Usuário ou senha inválidos (401).');
          else if (e.status === 0) this.mensagem.erro('Não foi possível conectar à API. Verifique se o backend está rodando.');
          else this.mensagem.erro('Erro ao fazer login. Tente novamente.');
        },
      });
  }
}
