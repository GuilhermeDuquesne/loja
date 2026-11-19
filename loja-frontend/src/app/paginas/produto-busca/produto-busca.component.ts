import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { mensagemDeErro } from '../../services/erro';
import { MensagemService } from '../../services/mensagem.service';
import { Produto, ProdutoService } from '../../services/produto.service';

@Component({
  selector: 'app-produto-busca',
  imports: [FormsModule, RouterLink, CurrencyPipe],
  templateUrl: './produto-busca.component.html',
  styleUrl: './produto-busca.component.css'
})
export class ProdutoBuscaComponent {
  private service = inject(ProdutoService);
  private mensagem = inject(MensagemService);

  nome = '';
  cor = '';
  precoMax: number | null = null;

  //null = ainda não buscou
  protected resultado = signal<Produto[] | null>(null);
  protected carregando = signal(false);

  buscar() {
    if (this.precoMax !== null && this.precoMax < 0) {
      this.mensagem.erro('O preço máximo não pode ser negativo.');
      return;
    }

    this.carregando.set(true);
    //GET /produtos?nome=...&cor=...&precoMax=...
    this.service.listar(this.nome.trim(), this.cor.trim(), this.precoMax)
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: (lista) => this.resultado.set(lista),
        error: (e) => this.mensagem.erro(mensagemDeErro(e)),
      });
  }

  limpar() {
    this.nome = '';
    this.cor = '';
    this.precoMax = null;
    this.resultado.set(null);
  }
}
