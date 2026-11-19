package br.unipar.loja.service;

import br.unipar.loja.dto.ItemPedidoRequest;
import br.unipar.loja.dto.PedidoRequest;
import br.unipar.loja.dto.PedidoResponse;
import br.unipar.loja.model.ItemPedido;
import br.unipar.loja.model.Pedido;
import br.unipar.loja.repository.PedidoRepository;
import br.unipar.loja.repository.ProdutoRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class PedidoService {

    private final PedidoRepository pedidos;
    private final ProdutoRepository produtos;

    public PedidoService(PedidoRepository pedidos, ProdutoRepository produtos) {
        this.pedidos = pedidos;
        this.produtos = produtos;
    }

    public List<PedidoResponse> listar() {
        return pedidos.findAll().stream().map(PedidoResponse::de).toList();
    }

    public PedidoResponse buscar(Long id) {
        return PedidoResponse.de(obter(id));
    }

    public PedidoResponse criar(PedidoRequest request) {
        if (request == null || request.cliente() == null || request.cliente().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O nome do cliente é obrigatório");
        }
        if (request.itens() == null || request.itens().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O pedido precisa ter ao menos um item");
        }

        var pedido = new Pedido(request.cliente());

        for (ItemPedidoRequest itemRequest : request.itens()) {
            if (itemRequest.produtoId() == null || itemRequest.quantidade() == null
                    || itemRequest.quantidade() <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Cada item precisa de produto e quantidade maior que zero");
            }
            var produto = produtos.findById(itemRequest.produtoId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Produto " + itemRequest.produtoId() + " não encontrado"));

            // regra de negócio: não vende mais do que tem em estoque
            if (produto.getEstoque() < itemRequest.quantidade()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Estoque insuficiente para o produto " + produto.getNome());
            }
            produto.diminuirEstoque(itemRequest.quantidade());
            pedido.adicionarItem(new ItemPedido(pedido, produto, itemRequest.quantidade()));
        }

        return PedidoResponse.de(pedidos.save(pedido));
    }

    public void excluir(Long id) {
        var pedido = obter(id);
        // regra de negócio: ao apagar o pedido, os produtos voltam para o estoque
        for (ItemPedido item : pedido.getItens()) {
            item.getProduto().aumentarEstoque(item.getQuantidade());
        }
        pedidos.delete(pedido);
    }

    private Pedido obter(Long id) {
        return pedidos.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado"));
    }
}
