package br.unipar.loja.repository;

import br.unipar.loja.model.Produto;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    // Consulta com filtro no path: GET /categorias/{id}/produtos
    List<Produto> findByCategoriaId(Long categoriaId);

    // Consulta com vários parâmetros: GET /produtos?nome=...&cor=...&precoMax=...
    List<Produto> findByNomeContainingIgnoreCaseAndCorContainingIgnoreCaseAndPrecoLessThanEqual(
            String nome, String cor, BigDecimal precoMax);

    boolean existsByCategoriaId(Long categoriaId);
}
