package br.com.autoflex.controller;

import br.com.autoflex.dto.FeedstockDtos;
import br.com.autoflex.dto.PagedResponse;
import br.com.autoflex.entity.Feedstock;
import br.com.autoflex.service.FeedstockService;

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

@Path("/feedstocks")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class FeedstockController {

    @Inject
    FeedstockService service;

    @GET
    @Transactional
    public Response list(@BeanParam FeedstockDtos.PaginateRequest req) {

        PanacheQuery<Feedstock> query = service.list(req.q, req.page, req.size);

        List<FeedstockDtos.Response> items =
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
        Feedstock f = service.getById(id);

        return f != null
                ? Response.ok(toDto(f)).build()
                : Response.status(Response.Status.NOT_FOUND).build();
    }

    @POST
    public Response create(@Valid FeedstockDtos.CreateRequest req) {
        Feedstock f = service.create(req);

        return Response.status(Response.Status.CREATED)
                .entity(toDto(f))
                .build();
    }

    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, @Valid FeedstockDtos.UpdateRequest req) {
        Feedstock updated = service.update(id, req);

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

    private FeedstockDtos.Response toDto(Feedstock f) {
        FeedstockDtos.Response dto = new FeedstockDtos.Response();
        dto.id = f.id;
        dto.feedstockCode = f.feedstockCode;
        dto.name = f.name;
        dto.stock = f.stock;
        dto.unitOfMeasure = f.unitOfMeasure;

        dto.products = f.products.stream().map(pf -> {
            FeedstockDtos.ProductItem item = new FeedstockDtos.ProductItem();
            item.id = pf.product.id;
            item.productCode = pf.product.productCode;
            item.name = pf.product.name;
            item.unitPrice = pf.product.unitPrice;
            item.quantity = pf.quantity;
            return item;
        }).toList();

        return dto;
    }
}
