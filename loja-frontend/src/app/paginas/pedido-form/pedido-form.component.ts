import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { mensagemDeErro } from '../../services/erro';
import { MensagemService } from '../../services/mensagem.service';
import { PedidoService } from '../../services/pedido.service';
import { Produto, ProdutoService } from '../../services/produto.service';

//Uma linha da tabela de itens do pedido (ainda não enviada para a API)
interface ItemLinha {
  produtoId: number;
  nome: string;
  preco: number;
  quantidade: number;
}

@Component({
  selector: 'app-pedido-form',
  imports: [FormsModule, RouterLink, CurrencyPipe],
  templateUrl: './pedido-form.component.html',
  styleUrl: './pedido-form.component.css'
})
export class PedidoFormComponent implements OnInit {
  private service = inject(PedidoService);
  private produtoService = inject(ProdutoService);
  private mensagem = inject(MensagemService);
  private router = inject(Router);

  cliente = '';
  produtoId: number | null = null;
  quantidade: number | null = 1;

  //Produtos que vêm da API, usados no select
  protected produtos = signal<Produto[]>([]);
  protected itens = signal<ItemLinha[]>([]);
  protected total = computed(() =>
    this.itens().reduce((soma, item) => soma + item.preco * item.quantidade, 0));

  ngOnInit() {
    this.produtoService.listar().subscribe({
      next: (lista) => this.produtos.set(lista),
      error: (e) => this.mensagem.erro(mensagemDeErro(e)),
    });
  }

  adicionarItem() {
    if (this.produtoId === null) {
      this.mensagem.erro('Escolha um produto.');
      return;
    }
    if (this.quantidade === null || this.quantidade <= 0) {
      this.mensagem.erro('A quantidade deve ser maior que zero.');
      return;
    }

    const produto = this.produtos().find((p) => p.id === this.produtoId);
    if (!produto) return;

    //Se o produto já está na lista, soma a quantidade
    const existente = this.itens().find((i) => i.produtoId === produto.id);
    const novaQuantidade = (existente?.quantidade ?? 0) + this.quantidade;
    if (novaQuantidade > produto.estoque) {
      this.mensagem.erro(`Estoque insuficiente. Disponível: ${produto.estoque}.`);
      return;
    }

    if (existente) {
      this.itens.update((lista) =>
        lista.map((i) => i.produtoId === produto.id ? { ...i, quantidade: novaQuantidade } : i));
    } else {
      this.itens.update((lista) => [...lista,
        { produtoId: produto.id, nome: produto.nome, preco: produto.preco, quantidade: this.quantidade! }]);
    }

    this.mensagem.limpar();
    this.produtoId = null;
    this.quantidade = 1;
  }

  removerItem(produtoId: number) {
    this.itens.update((lista) => lista.filter((i) => i.produtoId !== produtoId));
  }

  finalizar() {
    //Validação antes de enviar
    if (!this.cliente.trim()) {
      this.mensagem.erro('Informe o nome do cliente.');
      return;
    }
    if (this.itens().length === 0) {
      this.mensagem.erro('Adicione ao menos um item ao pedido.');
      return;
    }

    const pedido = {
      cliente: this.cliente.trim(),
      itens: this.itens().map((i) => ({ produtoId: i.produtoId, quantidade: i.quantidade })),
    };

    this.service.criar(pedido).subscribe({
      next: () => {
        this.mensagem.sucesso('Pedido realizado com sucesso.');
        this.router.navigate(['/pedidos']);
      },
      error: (e) => this.mensagem.erro(mensagemDeErro(e)),
    });
  }
}
