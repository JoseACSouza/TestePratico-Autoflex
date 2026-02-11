package br.com.autoflex.repository;

import br.com.autoflex.entity.Product;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import io.quarkus.panache.common.Sort;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ProductRepository implements PanacheRepository<Product> {

    public PanacheQuery<Product> searchByProduct(String q) {
        Sort sort = Sort.by("unitPrice").descending();

        if (q == null || q.isBlank()) {
            return findAll(sort);
        }

        String like = "%" + q.toLowerCase() + "%";
        return find("lower(name) like ?1 or lower(productCode) like ?1", sort, like);
    }

    public PanacheQuery<Product> searchByFeedstockName(String q) {
        if (q == null || q.isBlank()) {
            return findAll(Sort.by("unitPrice").descending());
        }

        String like = "%" + q.toLowerCase() + "%";


        return find("""
                select distinct p
                from Product p
                join p.feedstocks pf
                join pf.feedstock f
                where lower(f.name) like ?1
                order by p.unitPrice desc
                """, like);
    }
}

