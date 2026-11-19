package br.unipar.loja.dto;

import java.math.BigDecimal;

public record ProdutoRequest(
        String nome,
        String cor,
        BigDecimal preco,
        Integer estoque,
        Long categoriaId) {}
