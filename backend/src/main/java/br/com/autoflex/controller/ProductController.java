package br.com.autoflex.controller;

import br.com.autoflex.dto.PagedResponse;
import br.com.autoflex.dto.ProductDtos;
import br.com.autoflex.entity.Product;
import br.com.autoflex.service.ProductService;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.BeanParam;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import io.quarkus.hibernate.orm.panache.PanacheQuery;

import java.util.List;

@Path("/products")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductController {

    private ProductDtos.Response toDto(Product p) {
        ProductDtos.Response dto = new ProductDtos.Response();
        dto.id = p.id;
        dto.productCode = p.productCode;
        dto.name = p.name;
        dto.unitPrice = p.unitPrice;

        dto.feedstocks = p.feedstocks.stream().map(pf -> {
            ProductDtos.FeedstockItem item = new ProductDtos.FeedstockItem();
            item.id = pf.feedstock.id;
            item.feedstockCode = pf.feedstock.feedstockCode;
            item.name = pf.feedstock.name;
            item.stock = pf.feedstock.stock;
            item.quantity = pf.quantity;
            return item;
        }).toList();

        return dto;
    }

    @Inject
    ProductService service;

    @GET
    @Transactional
    public Response list(@BeanParam ProductDtos.PaginateRequest req) {

        PanacheQuery<Product> query = service.list(req.q, req.page, req.size);

        List<ProductDtos.Response> items =
                query.list().stream()
                        .map(this::toDto)
                        .toList();

        return Response.ok(
                new PagedResponse<>(
                        items,
                        query.count(),
                        query.page().index,
                        query.page().size
                )
        ).build();
    }

    @GET
    @Path("/{id}")
    @Transactional
    public Response getOne(@PathParam("id") Long id) {
        Product p = service.getById(id);

        return p != null
                ? Response.ok(toDto(p)).build()
                : Response.status(Response.Status.NOT_FOUND).build();
    }

    @POST
    public Response create(@Valid ProductDtos.CreateRequest req) {
        Product p = service.create(req);

        return Response.status(Response.Status.CREATED)
                .entity(toDto(p))
                .build();
    }

    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, @Valid ProductDtos.UpdateRequest req) {
        Product updated = service.update(id, req);

        return updated != null
                ? Response.ok(toDto(updated)).build()
                : Response.status(Response.Status.NOT_FOUND).build();
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        return service.delete(id)
                ? Response.noContent().build()
                : Response.status(Response.Status.NOT_FOUND).build();
    }

}