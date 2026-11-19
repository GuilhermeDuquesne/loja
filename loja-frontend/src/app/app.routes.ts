import { Routes } from '@angular/router';

import { adminGuard, authGuard } from './guards/auth.guard';
import { LoginComponent } from './paginas/login/login.component';
import { HomeComponent } from './paginas/home/home.component';
import { CategoriaListaComponent } from './paginas/categoria-lista/categoria-lista.component';
import { CategoriaFormComponent } from './paginas/categoria-form/categoria-form.component';
import { CategoriaProdutosComponent } from './paginas/categoria-produtos/categoria-produtos.component';
import { ProdutoListaComponent } from './paginas/produto-lista/produto-lista.component';
import { ProdutoDetalheComponent } from './paginas/produto-detalhe/produto-detalhe.component';
import { ProdutoFormComponent } from './paginas/produto-form/produto-form.component';
import { ProdutoBuscaComponent } from './paginas/produto-busca/produto-busca.component';
import { PedidoListaComponent } from './paginas/pedido-lista/pedido-lista.component';
import { PedidoFormComponent } from './paginas/pedido-form/pedido-form.component';
import { PedidoDetalheComponent } from './paginas/pedido-detalhe/pedido-detalhe.component';
import { NaoEncontradoComponent } from './paginas/nao-encontrado/nao-encontrado.component';

//Lista de rotas, cada URL aponta para um componente
//authGuard: só entra quem fez login | adminGuard: só entra o perfil ADMIN
export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'home', component: HomeComponent, canActivate: [authGuard]},

    {path: 'categorias', component: CategoriaListaComponent, canActivate: [authGuard]},
    {path: 'categorias/nova', component: CategoriaFormComponent, canActivate: [authGuard, adminGuard]},
    {path: 'categorias/:id/editar', component: CategoriaFormComponent, canActivate: [authGuard, adminGuard]},
    {path: 'categorias/:id/produtos', component: CategoriaProdutosComponent, canActivate: [authGuard]},

    {path: 'produtos', component: ProdutoListaComponent, canActivate: [authGuard]},
    {path: 'produtos/busca', component: ProdutoBuscaComponent, canActivate: [authGuard]},
    {path: 'produtos/novo', component: ProdutoFormComponent, canActivate: [authGuard, adminGuard]},
    {path: 'produtos/:id/editar', component: ProdutoFormComponent, canActivate: [authGuard, adminGuard]},
    {path: 'produtos/:id', component: ProdutoDetalheComponent, canActivate: [authGuard]},

    {path: 'pedidos', component: PedidoListaComponent, canActivate: [authGuard]},
    {path: 'pedidos/novo', component: PedidoFormComponent, canActivate: [authGuard]},
    {path: 'pedidos/:id', component: PedidoDetalheComponent, canActivate: [authGuard]},

    {path: '**', component: NaoEncontradoComponent},
];
