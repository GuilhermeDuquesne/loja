import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Categoria, CategoriaService } from '../../services/categoria.service';
import { mensagemDeErro } from '../../services/erro';
import { MensagemService } from '../../services/mensagem.service';
import { ProdutoService } from '../../services/produto.service';

@Component({
  selector: 'app-produto-form',
  imports: [FormsModule, RouterLink],
  templateUrl: './produto-form.component.html',
  styleUrl: './produto-form.component.css'
})
export class ProdutoFormComponent implements OnInit {
  private service = inject(ProdutoService);
  private categoriaService = inject(CategoriaService);
  private mensagem = inject(MensagemService);
  private router = inject(Router);
  private rota = inject(ActivatedRoute);

  id: number | null = null; //null = cadastro novo, com valor = edição
  nome = '';
  cor = '';
  preco: number | null = null;
  estoque: number | null = null;
  categoriaId: number | null = null;

  //Lista de categorias que vem da API, usada no select
  protected categorias = signal<Categoria[]>([]);

  ngOnInit() {
    this.categoriaService.listar().subscribe({
      next: (lista) => this.categorias.set(lista),
      error: (e) => this.mensagem.erro(mensagemDeErro(e)),
    });

    const id = this.rota.snapshot.paramMap.get('id');
    if (id) {
      this.id = Number(id);
      this.service.buscar(this.id).subscribe({
        next: (produto) => {
          this.nome = produto.nome;
          this.cor = produto.cor;
          this.preco = produto.preco;
          this.estoque = produto.estoque;
          this.categoriaId = produto.categoriaId;
        },
        error: (e) => {
          this.mensagem.erro(mensagemDeErro(e));
          this.router.navigate(['/produtos']);
        },
      });
    }
  }

  salvar() {
    //Validação antes de enviar
    if (!this.nome.trim() || !this.cor.trim()) {
      this.mensagem.erro('Informe o nome e a cor do produto.');
      return;
    }
    if (this.preco === null || this.preco <= 0) {
      this.mensagem.erro('O preço deve ser maior que zero.');
      return;
    }
    if (this.estoque === null || this.estoque < 0) {
      this.mensagem.erro('Informe o estoque (zero ou mais).');
      return;
    }
    if (this.categoriaId === null) {
      this.mensagem.erro('Escolha a categoria do produto.');
      return;
    }

    const produto = {
      nome: this.nome.trim(),
      cor: this.cor.trim(),
      preco: this.preco,
      estoque: this.estoque,
      categoriaId: this.categoriaId,
    };
    const chamada = this.id === null
      ? this.service.criar(produto)
      : this.service.atualizar(this.id, produto);

    chamada.subscribe({
      next: () => {
        this.mensagem.sucesso('Produto salvo com sucesso.');
        this.router.navigate(['/produtos']);
      },
      error: (e) => this.mensagem.erro(mensagemDeErro(e)),
    });
  }
}
