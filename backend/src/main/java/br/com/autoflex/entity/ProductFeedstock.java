package br.com.autoflex.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "PRODUCT_FEEDSTOCK")
public class ProductFeedstock {

    @EmbeddedId
    public ProductFeedstockId id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("idProduct")
    @JoinColumn(name = "ID_PRODUCT")
    public Product product;


    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("idFeedstock")
    @JoinColumn(name = "ID_FEEDSTOCK")
    public Feedstock feedstock;

    @Column(name = "QUANTITY", nullable = false, precision = 18, scale = 6)
    public BigDecimal quantity;
}
