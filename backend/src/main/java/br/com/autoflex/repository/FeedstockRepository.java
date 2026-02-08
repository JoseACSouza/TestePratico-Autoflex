package br.com.autoflex.repository;

import br.com.autoflex.entity.Feedstock;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class FeedstockRepository implements PanacheRepository<Feedstock> {

    public PanacheQuery<Feedstock> search(String q) {
        if (q == null || q.isBlank()) {
            return findAll();
        }
        return find("lower(name) like ?1", "%" + q.toLowerCase() + "%");
    }
}