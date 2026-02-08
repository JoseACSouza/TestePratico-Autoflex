package br.com.autoflex.service;

import br.com.autoflex.dto.FeedstockDtos;
import br.com.autoflex.entity.Feedstock;
import br.com.autoflex.repository.FeedstockRepository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Page;

@ApplicationScoped
public class FeedstockService {

    @Inject
    FeedstockRepository repo;

    public PanacheQuery<Feedstock> list(String q, Integer page, Integer size) {
        int p = (page == null || page < 0) ? 0 : page;
        int s = (size == null || size <= 0) ? 20 : Math.min(size, 100);

        PanacheQuery<Feedstock> query = repo.search(q);
        query.page(Page.of(p, s));
        return query;
    }

    public Feedstock getById(Long id) {
        return repo.findById(id);
    }

    @Transactional
    public Feedstock create(FeedstockDtos.CreateRequest req) {
        Feedstock f = new Feedstock();
        f.feedstockCode = req.feedstockCode;
        f.name = req.name;
        f.stock = req.stock;
        f.unitOfMeasure = req.unitOfMeasure;

        repo.persist(f);
        return f;
    }

    @Transactional
    public Feedstock update(Long id, FeedstockDtos.UpdateRequest req) {
        Feedstock f = repo.findById(id);
        if (f == null) return null;

        f.feedstockCode = req.feedstockCode;
        f.name = req.name;
        f.stock = req.stock;
        f.unitOfMeasure = req.unitOfMeasure;

        return f;
    }

    @Transactional
    public boolean delete(Long id) {
        return repo.deleteById(id);
    }
}
