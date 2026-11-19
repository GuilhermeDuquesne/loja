package br.unipar.loja.controller;

import br.unipar.loja.dto.CategoriaRequest;
import br.unipar.loja.dto.CategoriaResponse;
import br.unipar.loja.dto.ProdutoResponse;
import br.unipar.loja.service.CategoriaService;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {
    private final CategoriaService categorias;

    public CategoriaController(CategoriaService categorias) {
        this.categorias = categorias;
    }

    @GetMapping
    public List<CategoriaResponse> listar() {
        return categorias.listar();
    }

    @GetMapping("/{id}")
    public CategoriaResponse buscar(@PathVariable Long id) {
        return categorias.buscar(id);
    }

    // Consulta com filtro no path
    @GetMapping("/{id}/produtos")
    public List<ProdutoResponse> listarProdutos(@PathVariable Long id) {
        return categorias.listarProdutos(id);
    }

    @PostMapping
    public ResponseEntity<CategoriaResponse> criar(@RequestBody CategoriaRequest request) {
        var criada = categorias.criar(request);
        return ResponseEntity.created(URI.create("/categorias/" + criada.id())).body(criada);
    }

    @PutMapping("/{id}")
    public CategoriaResponse atualizar(@PathVariable Long id, @RequestBody CategoriaRequest request) {
        return categorias.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        categorias.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
