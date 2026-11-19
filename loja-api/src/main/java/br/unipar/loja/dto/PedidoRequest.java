package br.unipar.loja.dto;

import java.util.List;

public record PedidoRequest(String cliente, List<ItemPedidoRequest> itens) {}
