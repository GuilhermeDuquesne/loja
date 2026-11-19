package br.unipar.loja.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String cor;

    @Column(nullable = false)
    private BigDecimal preco;

    @Column(nullable = false)
    private Integer estoque;

    // N:1 -> cada produto pertence a uma categoria
    @ManyToOne(optional = false)
    private Categoria categoria;

    public Produto(String nome, String cor, BigDecimal preco, Integer estoque, Categoria categoria) {
        atualizar(nome, cor, preco, estoque, categoria);
    }

    public void atualizar(String nome, String cor, BigDecimal preco, Integer estoque, Categoria categoria) {
        this.nome = nome;
        this.cor = cor;
        this.preco = preco;
        this.estoque = estoque;
        this.categoria = categoria;
    }

    public void diminuirEstoque(int quantidade) {
        this.estoque = this.estoque - quantidade;
    }

    public void aumentarEstoque(int quantidade) {
        this.estoque = this.estoque + quantidade;
    }
}
