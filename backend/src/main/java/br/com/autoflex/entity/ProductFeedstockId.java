package br.com.autoflex.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ProductFeedstockId implements Serializable {

    @Column(name = "ID_PRODUCT")
    public Long idProduct;

    @Column(name = "ID_FEEDSTOCK")
    public Long idFeedstock;

    public ProductFeedstockId() {}

    public ProductFeedstockId(Long idProduct, Long idFeedstock) {
        this.idProduct = idProduct;
        this.idFeedstock = idFeedstock;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProductFeedstockId that)) return false;
        return Objects.equals(idProduct, that.idProduct)
                && Objects.equals(idFeedstock, that.idFeedstock);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idProduct, idFeedstock);
    }
}

