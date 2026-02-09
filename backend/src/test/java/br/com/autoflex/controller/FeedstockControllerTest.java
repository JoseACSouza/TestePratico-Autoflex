package br.com.autoflex.controller;

import br.com.autoflex.dto.FeedstockDtos;
import br.com.autoflex.entity.Feedstock;
import br.com.autoflex.entity.Product;
import br.com.autoflex.entity.ProductFeedstock;
import br.com.autoflex.service.FeedstockService;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Page;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.InjectMock;
import io.restassured.RestAssured;
import io.restassured.config.RestAssuredConfig;
import io.restassured.path.json.config.JsonPathConfig;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import static io.restassured.RestAssured.given;
import static io.restassured.config.JsonConfig.jsonConfig;
import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@QuarkusTest
class FeedstockControllerTest {

    @InjectMock
    FeedstockService service;

    @BeforeEach
    void setup() {
        // Resolve o problema de tipos numéricos (Float vs Double)
        RestAssured.config = RestAssuredConfig.config()
            .jsonConfig(jsonConfig().numberReturnType(JsonPathConfig.NumberReturnType.DOUBLE));
    }

    @Test
    void getOne_returns404_whenNotFound() {
        when(service.getById(anyLong())).thenReturn(null);

        given()
          .when().get("/feedstocks/999")
          .then()
            .statusCode(404);

        verify(service).getById(999L);
    }

    @Test
    void getOne_returnsFeedstockWithProducts_whenFound() {
        Feedstock f = feedstockWithOneProduct(12L);
        when(service.getById(12L)).thenReturn(f);

        given()
          .when().get("/feedstocks/12")
          .then()
            .statusCode(200)
            .body("id", is(12))
            .body("feedstockCode", is("F010"))
            .body("products", hasSize(1))
            .body("products[0].productCode", is("P001"))
            // Removido o 'f' pois agora usamos Double globalmente
            .body("products[0].quantity", is(0.25));

        verify(service).getById(12L);
    }

    @Test
    void list_returnsPagedResponse() {
        @SuppressWarnings("unchecked")
        PanacheQuery<Feedstock> query = mock(PanacheQuery.class);

        Feedstock f1 = feedstockWithOneProduct(1L);
        Feedstock f2 = feedstockWithOneProduct(2L);

        when(service.list(eq("a"), eq(0), eq(20))).thenReturn(query);
        when(query.list()).thenReturn(List.of(f1, f2));
        when(query.count()).thenReturn(2L);
        when(query.page()).thenReturn(Page.of(0, 20));

        given()
          .queryParam("q", "a")
          .queryParam("page", 0)
          .queryParam("size", 20)
          .when().get("/feedstocks")
          .then()
            .statusCode(200)
            .body("page", is(0))
            .body("size", is(20))
            .body("total", is(2))
            .body("items", hasSize(2));

        verify(service).list("a", 0, 20);
    }

    @Test
    void create_returns201_andBody() {
        Feedstock created = feedstockWithOneProduct(10L);
        // Uso de ArgumentMatchers explícito para evitar erro de ambiguidade
        when(service.create(ArgumentMatchers.any(FeedstockDtos.CreateRequest.class))).thenReturn(created);

        String payload = """
        {
          "feedstockCode": "F001",
          "name": "Mat",
          "stock": 10.0,
          "unitOfMeasure": "KG"
        }
        """;

        given()
          .contentType("application/json")
          .body(payload)
          .when().post("/feedstocks")
          .then()
            .statusCode(201)
            .body("id", is(10));

        verify(service).create(ArgumentMatchers.any(FeedstockDtos.CreateRequest.class));
    }

    @Test
    void update_returns404_whenNotFound() {
        when(service.update(eq(77L), ArgumentMatchers.any(FeedstockDtos.UpdateRequest.class))).thenReturn(null);

        String payload = """
        { "feedstockCode":"F077", "name":"X", "stock": 1.0, "unitOfMeasure":"KG" }
        """;

        given()
          .contentType("application/json")
          .body(payload)
          .when().put("/feedstocks/77")
          .then()
            .statusCode(404);

        verify(service).update(eq(77L), ArgumentMatchers.any(FeedstockDtos.UpdateRequest.class));
    }

    @Test
    void delete_returns204_whenDeleted() {
        when(service.delete(5L)).thenReturn(true);

        given()
          .when().delete("/feedstocks/5")
          .then()
            .statusCode(204);

        verify(service).delete(5L);
    }

    private Feedstock feedstockWithOneProduct(Long id) {
        Feedstock f = new Feedstock();
        f.id = id;
        f.feedstockCode = "F010";
        f.name = "Aço";
        f.stock = new BigDecimal("250.5");
        f.unitOfMeasure = "KG";

        Product p = new Product();
        p.id = 1L;
        p.productCode = "P001";
        p.name = "Produto";
        p.unitPrice = new BigDecimal("10.00");

        ProductFeedstock pf = new ProductFeedstock();
        pf.feedstock = f;
        pf.product = p;
        pf.quantity = new BigDecimal("0.250");

        f.products = Set.of(pf);
        return f;
    }
}