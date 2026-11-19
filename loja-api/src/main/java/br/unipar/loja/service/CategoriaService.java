package br.unipar.loja.service;

import br.unipar.loja.dto.CategoriaRequest;
import br.unipar.loja.dto.CategoriaResponse;
import br.unipar.loja.dto.ProdutoResponse;
import br.unipar.loja.model.Categoria;
import br.unipar.loja.repository.CategoriaRepository;
import br.unipar.loja.repository.ProdutoRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CategoriaService {

    private final CategoriaRepository categorias;
    private final ProdutoRepository produtos;

    public CategoriaService(CategoriaRepository categorias, ProdutoRepository produtos) {
        this.categorias = categorias;
        this.produtos = produtos;
    }

    public List<CategoriaResponse> listar() {
        return categorias.findAll().stream().map(CategoriaResponse::de).toList();
    }

    public CategoriaResponse buscar(Long id) {
        return CategoriaResponse.de(obter(id));
    }

    public CategoriaResponse criar(CategoriaRequest request) {
        validar(request);
        return CategoriaResponse.de(categorias.save(new Categoria(request.nome())));
    }

    public CategoriaResponse atualizar(Long id, CategoriaRequest request) {
        validar(request);
        var categoria = obter(id);
        categoria.atualizar(request.nome());
        return CategoriaResponse.de(categorias.save(categoria));
    }

    public void excluir(Long id) {
        var categoria = obter(id);
        // regra de negócio: não apaga categoria que ainda tem produtos
        if (produtos.existsByCategoriaId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Não é possível excluir: a categoria possui produtos");
        }
        categorias.delete(categoria);
    }

    // Consulta com filtro no path: GET /categorias/{id}/produtos
    public List<ProdutoResponse> listarProdutos(Long id) {
        obter(id); // garante o 404 se a categoria não existir
        return produtos.findByCategoriaId(id).stream().map(ProdutoResponse::de).toList();
    }

    private Categoria obter(Long id) {
        return categorias.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada"));
    }

    private void validar(CategoriaRequest request) {
        if (request == null || request.nome() == null || request.nome().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O nome da categoria é obrigatório");
        }
    }
}
