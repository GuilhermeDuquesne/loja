package br.unipar.loja.controller;

import br.unipar.loja.dto.ProdutoRequest;
import br.unipar.loja.dto.ProdutoResponse;
import br.unipar.loja.service.ProdutoService;
import java.math.BigDecimal;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {
    private final ProdutoService produtos;

    public ProdutoController(ProdutoService produtos) {
        this.produtos = produtos;
    }

    // Consulta com vários parâmetros: /produtos?nome=caneta&cor=azul&precoMax=10
    @GetMapping
    public List<ProdutoResponse> listar(@RequestParam(required = false) String nome,
                                        @RequestParam(required = false) String cor,
                                        @RequestParam(required = false) BigDecimal precoMax) {
        return produtos.listar(nome, cor, precoMax);
    }

    @GetMapping("/{id}")
    public ProdutoResponse buscar(@PathVariable Long id) {
        return produtos.buscar(id);
    }

    @PostMapping
    public ResponseEntity<ProdutoResponse> criar(@RequestBody ProdutoRequest request) {
        var criado = produtos.criar(request);
        return ResponseEntity.created(URI.create("/produtos/" + criado.id())).body(criado);
    }

    @PutMapping("/{id}")
    public ProdutoResponse atualizar(@PathVariable Long id, @RequestBody ProdutoRequest request) {
        return produtos.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        produtos.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
