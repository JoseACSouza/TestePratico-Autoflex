package br.com.autoflex.controller;

import br.com.autoflex.dto.ProductDtos;
import br.com.autoflex.entity.Feedstock;
import br.com.autoflex.entity.Product;
import br.com.autoflex.entity.ProductFeedstock;
import br.com.autoflex.service.ProductService;

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
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@QuarkusTest
class ProductControllerTest {

    @InjectMock
    ProductService service;

    @BeforeEach
    void setup() {
        // Configura o RestAssured para tratar números decimais do JSON como Double
        // Isso evita o erro de comparação entre Float e Double/BigDecimal
        RestAssured.config = RestAssuredConfig.config()
            .jsonConfig(jsonConfig().numberReturnType(JsonPathConfig.NumberReturnType.DOUBLE));
    }

    @Test
    void getOne_returns404_whenNotFound() {
        when(service.getById(anyLong())).thenReturn(null);

        given()
          .when().get("/products/999")
          .then()
            .statusCode(404);
    }

    @Test
    void getOne_returnsProductWithFeedstocks_whenFound() {
        Product p = productWithOneFeedstock(1L);
        when(service.getById(1L)).thenReturn(p);

        given()
          .when().get("/products/1")
          .then()
            .statusCode(200)
            .body("id", is(1))
            // Agora podemos usar valores decimais normais (Double) sem o 'f'
            .body("feedstocks[0].stock", is(250.5))
            .body("feedstocks[0].quantity", is(0.250));
    }

    @Test
    void list_returnsPagedResponse() {
        @SuppressWarnings("unchecked")
        PanacheQuery<Product> query = mock(PanacheQuery.class);
        Product p1 = productWithOneFeedstock(1L);

        when(service.list(anyString(), anyInt(), anyInt())).thenReturn(query);
        when(query.list()).thenReturn(List.of(p1));
        when(query.count()).thenReturn(1L);
        when(query.page()).thenReturn(Page.of(0, 20));

        given()
          .queryParam("q", "a")
          .queryParam("page", 0)
          .queryParam("size", 20)
          .when().get("/products")
          .then()
            .statusCode(200)
            .body("total", is(1));
    }

    @Test
    void create_returns201_andBody() {
        Product created = productWithOneFeedstock(10L);
        // Uso explícito do ArgumentMatchers do Mockito para evitar conflito com Hamcrest
        when(service.create(ArgumentMatchers.any(ProductDtos.CreateRequest.class))).thenReturn(created);

        String payload = """
        {
          "productCode": "P001",
          "name": "Produto",
          "unitPrice": 10.00,
          "feedstocks": [{ "feedstockId": 12, "quantity": 0.250 }]
        }
        """;

        given()
          .contentType("application/json")
          .body(payload)
          .when().post("/products")
          .then()
            .statusCode(201);
    }

    @Test
    void update_returns404_whenNotFound() {
        when(service.update(anyLong(), ArgumentMatchers.any(ProductDtos.UpdateRequest.class))).thenReturn(null);

        // Payload válido para passar pelas validações @NotBlank/@NotEmpty do Controller
        String payload = """
        {
          "productCode": "UPDATED",
          "name": "Produto Atualizado",
          "unitPrice": 15.50,
          "feedstocks": [{ "feedstockId": 1, "quantity": 1.0 }]
        }
        """;

        given()
          .contentType("application/json")
          .body(payload)
          .when().put("/products/77")
          .then()
            .statusCode(404);
    }

    @Test
    void delete_returns204_whenDeleted() {
        when(service.delete(anyLong())).thenReturn(true);

        given()
          .when().delete("/products/5")
          .then()
            .statusCode(204);
    }

    @Test
    void delete_returns404_whenNotFound() {
        when(service.delete(anyLong())).thenReturn(false);

        given()
          .when().delete("/products/5")
          .then()
            .statusCode(404);
    }

    private Product productWithOneFeedstock(Long id) {
        Product p = new Product();
        p.id = id;
        p.productCode = "P001";
        p.name = "Produto";
        p.unitPrice = new BigDecimal("10.00");

        Feedstock f = new Feedstock();
        f.id = 12L;
        f.feedstockCode = "F010";
        f.name = "Insumo Teste";
        f.stock = new BigDecimal("250.5");

        ProductFeedstock pf = new ProductFeedstock();
        pf.product = p;
        pf.feedstock = f;
        pf.quantity = new BigDecimal("0.250");

        p.feedstocks = Set.of(pf);
        return p;
    }
}