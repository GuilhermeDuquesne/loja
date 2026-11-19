package br.unipar.loja.config;

import br.unipar.loja.model.Categoria;
import br.unipar.loja.model.Perfil;
import br.unipar.loja.model.Produto;
import br.unipar.loja.model.Usuario;
import br.unipar.loja.repository.CategoriaRepository;
import br.unipar.loja.repository.ProdutoRepository;
import br.unipar.loja.repository.UsuarioRepository;
import java.math.BigDecimal;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

// Roda uma vez ao iniciar e cria usuários e alguns dados para testar.
// Só grava se o banco estiver vazio.
@Configuration
public class DadosIniciais {

    @Bean
    CommandLineRunner carregar(UsuarioRepository usuarios,
                               CategoriaRepository categorias,
                               ProdutoRepository produtos,
                               PasswordEncoder passwords) {
        return args -> {
            if (usuarios.count() == 0) {
                usuarios.save(new Usuario("Administrador", "admin", passwords.encode("admin123"), Perfil.ADMIN));
                usuarios.save(new Usuario("Cliente", "cliente", passwords.encode("cliente123"), Perfil.COMUM));
            }

            if (categorias.count() == 0) {
                var papelaria = categorias.save(new Categoria("Papelaria"));
                var informatica = categorias.save(new Categoria("Informática"));

                produtos.save(new Produto("Caneta", "azul", new BigDecimal("3.50"), 100, papelaria));
                produtos.save(new Produto("Caderno", "vermelho", new BigDecimal("18.90"), 40, papelaria));
                produtos.save(new Produto("Mouse", "preto", new BigDecimal("59.90"), 25, informatica));
            }
        };
    }
}
