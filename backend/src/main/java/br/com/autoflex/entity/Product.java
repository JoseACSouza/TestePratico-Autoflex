package br.com.autoflex.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="PRODUCT")
public class Product {
    @Id
    @Column(name="ID_PRODUCT")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(name = "PRODUCT_CODE", nullable = false, unique = true, length = 30)
    public String productCode;

    @Column(name = "NAME", nullable = false, length = 100)
    public  String name;

    @Column(name = "UNIT_PRICE", nullable = false, precision = 15, scale = 2)
    public BigDecimal unitPrice;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    public Set<ProductFeedstock> feedstocks = new HashSet<>();
}
