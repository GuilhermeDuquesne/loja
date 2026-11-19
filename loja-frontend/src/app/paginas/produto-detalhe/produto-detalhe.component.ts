import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { mensagemDeErro } from '../../services/erro';
import { MensagemService } from '../../services/mensagem.service';
import { Produto, ProdutoService } from '../../services/produto.service';

@Component({
  selector: 'app-produto-detalhe',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './produto-detalhe.component.html',
  styleUrl: './produto-detalhe.component.css'
})
export class ProdutoDetalheComponent implements OnInit {
  private service = inject(ProdutoService);
  private mensagem = inject(MensagemService);
  private router = inject(Router);
  private rota = inject(ActivatedRoute);

  protected produto = signal<Produto | null>(null);

  ngOnInit() {
    const id = Number(this.rota.snapshot.paramMap.get('id'));

    //GET /produtos/{id}
    this.service.buscar(id).subscribe({
      next: (produto) => this.produto.set(produto),
      error: (e) => {
        this.mensagem.erro(mensagemDeErro(e));
        this.router.navigate(['/produtos']);
      },
    });
  }
}
