package br.unipar.loja.service;

import br.unipar.loja.dto.ProdutoRequest;
import br.unipar.loja.dto.ProdutoResponse;
import br.unipar.loja.model.Categoria;
import br.unipar.loja.model.Produto;
import br.unipar.loja.repository.CategoriaRepository;
import br.unipar.loja.repository.ItemPedidoRepository;
import br.unipar.loja.repository.ProdutoRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProdutoService {

    private final ProdutoRepository produtos;
    private final CategoriaRepository categorias;
    private final ItemPedidoRepository itens;

    public ProdutoService(ProdutoRepository produtos,
                          CategoriaRepository categorias,
                          ItemPedidoRepository itens) {
        this.produtos = produtos;
        this.categorias = categorias;
        this.itens = itens;
    }

    // Consulta com vários parâmetros: GET /produtos?nome=caneta&cor=azul&precoMax=10
    // Parâmetro que não foi informado não filtra nada.
    public List<ProdutoResponse> listar(String nome, String cor, BigDecimal precoMax) {
        String nomeBusca = nome == null ? "" : nome;
        String corBusca = cor == null ? "" : cor;
        BigDecimal precoBusca = precoMax == null ? new BigDecimal("999999999") : precoMax;

        return produtos
                .findByNomeContainingIgnoreCaseAndCorContainingIgnoreCaseAndPrecoLessThanEqual(
                        nomeBusca, corBusca, precoBusca)
                .stream().map(ProdutoResponse::de).toList();
    }

    public ProdutoResponse buscar(Long id) {
        return ProdutoResponse.de(obter(id));
    }

    public ProdutoResponse criar(ProdutoRequest request) {
        validar(request);
        var produto = new Produto(request.nome(), request.cor(), request.preco(),
                                  request.estoque(), obterCategoria(request.categoriaId()));
        return ProdutoResponse.de(produtos.save(produto));
    }

    public ProdutoResponse atualizar(Long id, ProdutoRequest request) {
        validar(request);
        var produto = obter(id);
        produto.atualizar(request.nome(), request.cor(), request.preco(),
                          request.estoque(), obterCategoria(request.categoriaId()));
        return ProdutoResponse.de(produtos.save(produto));
    }

    public void excluir(Long id) {
        var produto = obter(id);
        // regra de negócio: produto que já foi vendido não pode ser apagado
        if (itens.existsByProdutoId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Não é possível excluir: o produto já está em pedidos");
        }
        produtos.delete(produto);
    }

    private Produto obter(Long id) {
        return produtos.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
    }

    private Categoria obterCategoria(Long categoriaId) {
        return categorias.findById(categoriaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada"));
    }

    private void validar(ProdutoRequest request) {
        if (request == null || vazio(request.nome()) || vazio(request.cor())
                || request.categoriaId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Nome, cor e categoria são obrigatórios");
        }
        if (request.preco() == null || request.preco().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O preço deve ser maior que zero");
        }
        if (request.estoque() == null || request.estoque() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O estoque não pode ser negativo");
        }
    }

    private boolean vazio(String valor) {
        return valor == null || valor.isBlank();
    }
}
