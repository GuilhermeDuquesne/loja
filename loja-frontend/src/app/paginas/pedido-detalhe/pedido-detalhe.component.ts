import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { mensagemDeErro } from '../../services/erro';
import { MensagemService } from '../../services/mensagem.service';
import { Pedido, PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-pedido-detalhe',
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './pedido-detalhe.component.html',
  styleUrl: './pedido-detalhe.component.css'
})
export class PedidoDetalheComponent implements OnInit {
  private service = inject(PedidoService);
  private mensagem = inject(MensagemService);
  private router = inject(Router);
  private rota = inject(ActivatedRoute);

  protected pedido = signal<Pedido | null>(null);

  ngOnInit() {
    const id = Number(this.rota.snapshot.paramMap.get('id'));

    //GET /pedidos/{id}
    this.service.buscar(id).subscribe({
      next: (pedido) => this.pedido.set(pedido),
      error: (e) => {
        this.mensagem.erro(mensagemDeErro(e));
        this.router.navigate(['/pedidos']);
      },
    });
  }
}
