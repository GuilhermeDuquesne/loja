package br.unipar.loja.dto;

import br.unipar.loja.model.ItemPedido;
import java.math.BigDecimal;

public record ItemPedidoResponse(
        Long produtoId,
        String produtoNome,
        Integer quantidade,
        BigDecimal precoUnitario,
        BigDecimal subtotal) {

    public static ItemPedidoResponse de(ItemPedido item) {
        return new ItemPedidoResponse(item.getProduto().getId(),
                                      item.getProduto().getNome(),
                                      item.getQuantidade(),
                                      item.getPrecoUnitario(),
                                      item.getSubtotal());
    }
}
