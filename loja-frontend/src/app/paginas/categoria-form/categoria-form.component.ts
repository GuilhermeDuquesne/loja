import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoriaService } from '../../services/categoria.service';
import { mensagemDeErro } from '../../services/erro';
import { MensagemService } from '../../services/mensagem.service';

@Component({
  selector: 'app-categoria-form',
  imports: [FormsModule, RouterLink],
  templateUrl: './categoria-form.component.html',
  styleUrl: './categoria-form.component.css'
})
export class CategoriaFormComponent implements OnInit {
  private service = inject(CategoriaService);
  private mensagem = inject(MensagemService);
  private router = inject(Router);
  private rota = inject(ActivatedRoute);

  id: number | null = null; //null = cadastro novo, com valor = edição
  nome = '';

  ngOnInit() {
    const id = this.rota.snapshot.paramMap.get('id');
    if (id) {
      this.id = Number(id);
      this.service.buscar(this.id).subscribe({
        next: (categoria) => this.nome = categoria.nome,
        error: (e) => {
          this.mensagem.erro(mensagemDeErro(e));
          this.router.navigate(['/categorias']);
        },
      });
    }
  }

  salvar() {
    //Validação antes de enviar
    if (!this.nome.trim()) {
      this.mensagem.erro('Informe o nome da categoria.');
      return;
    }

    const categoria = { nome: this.nome.trim() };
    const chamada = this.id === null
      ? this.service.criar(categoria)
      : this.service.atualizar(this.id, categoria);

    chamada.subscribe({
      next: () => {
        this.mensagem.sucesso('Categoria salva com sucesso.');
        this.router.navigate(['/categorias']);
      },
      error: (e) => this.mensagem.erro(mensagemDeErro(e)),
    });
  }
}
