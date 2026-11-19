import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { mensagemDeErro } from '../../services/erro';
import { MensagemService } from '../../services/mensagem.service';
import { Pedido, PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-pedido-lista',
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './pedido-lista.component.html',
  styleUrl: './pedido-lista.component.css'
})
export class PedidoListaComponent implements OnInit {
  private service = inject(PedidoService);
  private mensagem = inject(MensagemService);
  protected auth = inject(AuthService);

  protected pedidos = signal<Pedido[]>([]);
  protected carregando = signal(false);

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.carregando.set(true);
    this.service.listar().subscribe({
      next: (lista) => {
        this.pedidos.set(lista);
        this.carregando.set(false);
      },
      error: (e) => {
        this.mensagem.erro(mensagemDeErro(e));
        this.carregando.set(false);
      },
    });
  }

  excluir(pedido: Pedido) {
    //Confirmação antes de excluir
    if (!confirm(`Deseja excluir o pedido ${pedido.id}? Os produtos voltam para o estoque.`)) return;

    this.service.excluir(pedido.id).subscribe({
      next: () => {
        this.mensagem.sucesso('Pedido excluído com sucesso.');
        this.carregar();
      },
      error: (e) => this.mensagem.erro(mensagemDeErro(e)),
    });
  }
}
