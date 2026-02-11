package br.com.autoflex.repository;

import br.com.autoflex.entity.Product;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import io.quarkus.panache.common.Sort;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ProductRepository implements PanacheRepository<Product> {

    public PanacheQuery<Product> search(String q) {
        Sort sort = Sort.by("unitPrice").descending();

        if (q == null || q.isBlank()) {
            return findAll(sort);
        }

        String like = "%" + q.toLowerCase() + "%";
        return find("lower(name) like ?1 or lower(productCode) like ?1", sort, like);
    }
}
