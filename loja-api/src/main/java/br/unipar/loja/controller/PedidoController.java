package br.unipar.loja.controller;

import br.unipar.loja.dto.PedidoRequest;
import br.unipar.loja.dto.PedidoResponse;
import br.unipar.loja.service.PedidoService;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {
    private final PedidoService pedidos;

    public PedidoController(PedidoService pedidos) {
        this.pedidos = pedidos;
    }

    @GetMapping
    public List<PedidoResponse> listar() {
        return pedidos.listar();
    }

    @GetMapping("/{id}")
    public PedidoResponse buscar(@PathVariable Long id) {
        return pedidos.buscar(id);
    }

    @PostMapping
    public ResponseEntity<PedidoResponse> criar(@RequestBody PedidoRequest request) {
        var criado = pedidos.criar(request);
        return ResponseEntity.created(URI.create("/pedidos/" + criado.id())).body(criado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        pedidos.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
