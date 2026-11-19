import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { mensagemDeErro } from '../../services/erro';
import { MensagemService } from '../../services/mensagem.service';
import { Produto, ProdutoService } from '../../services/produto.service';

@Component({
  selector: 'app-produto-lista',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './produto-lista.component.html',
  styleUrl: './produto-lista.component.css'
})
export class ProdutoListaComponent implements OnInit {
  private service = inject(ProdutoService);
  private mensagem = inject(MensagemService);
  protected auth = inject(AuthService);

  protected produtos = signal<Produto[]>([]);
  protected carregando = signal(false);

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.carregando.set(true);
    this.service.listar().subscribe({
      next: (lista) => {
        this.produtos.set(lista);
        this.carregando.set(false);
      },
      error: (e) => {
        this.mensagem.erro(mensagemDeErro(e));
        this.carregando.set(false);
      },
    });
  }

  excluir(produto: Produto) {
    //Confirmação antes de excluir
    if (!confirm(`Deseja excluir o produto "${produto.nome}"?`)) return;

    this.service.excluir(produto.id).subscribe({
      next: () => {
        this.mensagem.sucesso('Produto excluído com sucesso.');
        this.carregar();
      },
      error: (e) => this.mensagem.erro(mensagemDeErro(e)),
    });
  }
}
