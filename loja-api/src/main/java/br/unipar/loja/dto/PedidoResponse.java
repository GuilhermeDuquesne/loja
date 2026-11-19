package br.unipar.loja.dto;

import br.unipar.loja.model.Pedido;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoResponse(
        Long id,
        String cliente,
        LocalDateTime data,
        BigDecimal total,
        List<ItemPedidoResponse> itens) {

    public static PedidoResponse de(Pedido pedido) {
        return new PedidoResponse(pedido.getId(),
                                  pedido.getCliente(),
                                  pedido.getData(),
                                  pedido.getTotal(),
                                  pedido.getItens().stream().map(ItemPedidoResponse::de).toList());
    }
}
