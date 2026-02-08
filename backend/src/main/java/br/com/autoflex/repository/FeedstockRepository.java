package br.com.autoflex.repository;

import br.com.autoflex.entity.Feedstock;

import jakarta.enterprise.context.ApplicationScoped;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import io.quarkus.panache.common.Sort;

@ApplicationScoped
public class FeedstockRepository implements PanacheRepository<Feedstock> {

    public PanacheQuery<Feedstock> search(String q) {
        Sort sort = Sort.by("stock").descending();

        if (q == null || q.isBlank()) {
            return findAll(sort);
        }

        String like = "%" + q.toLowerCase() + "%";
        return find("lower(name) like ?1 or lower(feedstockCode) like ?1", sort, like);
    }
}
