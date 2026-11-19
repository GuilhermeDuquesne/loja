import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Categoria, CategoriaService } from '../../services/categoria.service';
import { mensagemDeErro } from '../../services/erro';
import { MensagemService } from '../../services/mensagem.service';
import { Produto } from '../../services/produto.service';

@Component({
  selector: 'app-categoria-produtos',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './categoria-produtos.component.html',
  styleUrl: './categoria-produtos.component.css'
})
export class CategoriaProdutosComponent implements OnInit {
  private service = inject(CategoriaService);
  private mensagem = inject(MensagemService);
  private router = inject(Router);
  private rota = inject(ActivatedRoute);

  protected categoria = signal<Categoria | null>(null);
  protected produtos = signal<Produto[]>([]);

  ngOnInit() {
    const id = Number(this.rota.snapshot.paramMap.get('id'));

    this.service.buscar(id).subscribe({
      next: (categoria) => this.categoria.set(categoria),
      error: (e) => {
        this.mensagem.erro(mensagemDeErro(e));
        this.router.navigate(['/categorias']);
      },
    });

    //GET /categorias/{id}/produtos
    this.service.listarProdutos(id).subscribe({
      next: (lista) => this.produtos.set(lista),
      error: (e) => this.mensagem.erro(mensagemDeErro(e)),
    });
  }
}
