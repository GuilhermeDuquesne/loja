package br.unipar.loja.dto;

import br.unipar.loja.model.Produto;
import java.math.BigDecimal;

public record ProdutoResponse(
        Long id,
        String nome,
        String cor,
        BigDecimal preco,
        Integer estoque,
        Long categoriaId,
        String categoriaNome) {

    public static ProdutoResponse de(Produto produto) {
        return new ProdutoResponse(produto.getId(),
                                   produto.getNome(),
                                   produto.getCor(),
                                   produto.getPreco(),
                                   produto.getEstoque(),
                                   produto.getCategoria().getId(),
                                   produto.getCategoria().getNome());
    }
}
