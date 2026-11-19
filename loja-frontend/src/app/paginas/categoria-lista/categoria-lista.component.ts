import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Categoria, CategoriaService } from '../../services/categoria.service';
import { mensagemDeErro } from '../../services/erro';
import { MensagemService } from '../../services/mensagem.service';

@Component({
  selector: 'app-categoria-lista',
  imports: [RouterLink],
  templateUrl: './categoria-lista.component.html',
  styleUrl: './categoria-lista.component.css'
})
export class CategoriaListaComponent implements OnInit {
  private service = inject(CategoriaService);
  private mensagem = inject(MensagemService);
  protected auth = inject(AuthService);

  protected categorias = signal<Categoria[]>([]);
  protected carregando = signal(false);

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.carregando.set(true);
    this.service.listar().subscribe({
      next: (lista) => {
        this.categorias.set(lista);
        this.carregando.set(false);
      },
      error: (e) => {
        this.mensagem.erro(mensagemDeErro(e));
        this.carregando.set(false);
      },
    });
  }

  excluir(categoria: Categoria) {
    //Confirmação antes de excluir
    if (!confirm(`Deseja excluir a categoria "${categoria.nome}"?`)) return;

    this.service.excluir(categoria.id).subscribe({
      next: () => {
        this.mensagem.sucesso('Categoria excluída com sucesso.');
        this.carregar();
      },
      error: (e) => this.mensagem.erro(mensagemDeErro(e)),
    });
  }
}
