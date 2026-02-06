package br.com.autoflex.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="FEEDSTOCK")
public class Feedstock {

    @Id
    @Column(name = "ID_FEEDSTOCK")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(name = "FEEDSTOCK_CODE", nullable = false, unique = true, length = 30)
    public String feedStockCode;

    @Column(name = "NAME", nullable = false, length = 100)
    public String name;

    @Column(name = "STOCK", nullable = false, precision = 18, scale = 6)
    public BigDecimal stock;

    @Column(name = "UNIT_OF_MEASURE", nullable = false, length = 4)
    public String unitOfMeasure;

    @OneToMany(mappedBy = "feedstock")
    public Set<ProductFeedstock> products = new HashSet<>();
}
