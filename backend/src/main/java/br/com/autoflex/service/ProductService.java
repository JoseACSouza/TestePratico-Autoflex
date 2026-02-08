package br.com.autoflex.service;

import br.com.autoflex.dto.ProductDtos;
import br.com.autoflex.entity.Feedstock;
import br.com.autoflex.entity.Product;
import br.com.autoflex.entity.ProductFeedstock;
import br.com.autoflex.entity.ProductFeedstockId;
import br.com.autoflex.repository.FeedstockRepository;
import br.com.autoflex.repository.ProductRepository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Page;

@ApplicationScoped
public class ProductService {

    @Inject
    ProductRepository repo;

    @Inject
    FeedstockRepository feedstockRepo;

    public PanacheQuery<Product> list(String q, Integer page, Integer size) {
        int p = (page == null || page < 0) ? 0 : page;
        int s = (size == null || size <= 0) ? 20 : Math.min(size, 100);

        PanacheQuery<Product> query = repo.search(q);
        query.page(Page.of(p, s));
        return query;
    }

    public Product getById(Long id) {
        return repo.findById(id);
    }

    @Transactional
    public Product create(ProductDtos.CreateRequest req) {
        Product p = new Product();
        p.productCode = req.productCode;
        p.name = req.name;
        p.unitPrice = req.unitPrice;

        repo.persist(p);
        repo.flush();

        for (ProductDtos.FeedstockQuantity item : req.feedstocks) {
            Feedstock f = feedstockRepo.findById(item.feedstockId);
            if (f == null) {
                throw new NotFoundException("Feedstock not found: " + item.feedstockId);
            }

            ProductFeedstock pf = new ProductFeedstock();
            pf.product = p;
            pf.feedstock = f;
            pf.quantity = item.quantity;
            pf.id = new ProductFeedstockId(p.id, f.id);

            p.feedstocks.add(pf);
        }

        return p;
    }

    @Transactional
    public Product update(Long id, ProductDtos.UpdateRequest req) {
        Product p = repo.findById(id);
        if (p == null) return null;

        p.productCode = req.productCode;
        p.name = req.name;
        p.unitPrice = req.unitPrice;

        return p;
    }

    @Transactional
    public boolean delete(Long id) {
        return repo.deleteById(id);
    }
}
