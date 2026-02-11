package br.com.autoflex.service;

import br.com.autoflex.dto.ProductDtos;
import br.com.autoflex.entity.Feedstock;
import br.com.autoflex.entity.Product;
import br.com.autoflex.repository.FeedstockRepository;
import br.com.autoflex.repository.ProductRepository;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Page;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.InjectMock;

import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@QuarkusTest
class ProductServiceTest {

    @Inject
    ProductService service;

    @InjectMock
    ProductRepository productRepo;

    @InjectMock
    FeedstockRepository feedstockRepo;

    @Test
    void list_appliesDefaultsAndPagesQuery() {
        @SuppressWarnings("unchecked")
        PanacheQuery<Product> query = mock(PanacheQuery.class);

        when(productRepo.search("abc")).thenReturn(query);
        when(query.page(any(Page.class))).thenReturn(query);

        PanacheQuery<Product> result = service.list("abc", null, null);

        assertSame(query, result);
        verify(productRepo).search("abc");
        
        // CORREÇÃO: Usando argThat para validar o conteúdo da página (index 0, size 20)
        verify(query).page(argThat(p -> p.index == 0 && p.size == 20));
    }

    @Test
    void list_capsSizeTo100() {
        @SuppressWarnings("unchecked")
        PanacheQuery<Product> query = mock(PanacheQuery.class);

        when(productRepo.search(null)).thenReturn(query);
        when(query.page(any(Page.class))).thenReturn(query);

        service.list(null, 2, 999);

        // CORREÇÃO: Validando se o limite de 100 foi aplicado no objeto Page
        verify(query).page(argThat(p -> p.index == 2 && p.size == 100));
    }

    @Test
    void getById_returnsEntityOrNull() {
        Product p = new Product();
        p.id = 10L;

        when(productRepo.findById(10L)).thenReturn(p);

        Product found = service.getById(10L);

        assertNotNull(found);
        assertEquals(10L, found.id);
        verify(productRepo).findById(10L);
    }

    @Test
    void delete_delegatesToDeleteById() {
        when(productRepo.deleteById(5L)).thenReturn(true);

        boolean ok = service.delete(5L);

        assertTrue(ok);
        verify(productRepo).deleteById(5L);
    }

    @Test
    void update_returnsNullWhenNotFound() {
        when(productRepo.findById(1L)).thenReturn(null);

        ProductDtos.UpdateRequest req = new ProductDtos.UpdateRequest();
        req.productCode = "P1";
        req.name = "X";
        req.unitPrice = new BigDecimal("10.00");

        Product updated = service.update(1L, req);

        assertNull(updated);
        verify(productRepo).findById(1L);
    }

    @Test
    void update_updatesFieldsWhenFound() {
        Product p = new Product();
        p.id = 1L;
        p.productCode = "OLD";
        p.name = "OLD";
        p.unitPrice = new BigDecimal("1.00");

        when(productRepo.findById(1L)).thenReturn(p);

        ProductDtos.UpdateRequest req = new ProductDtos.UpdateRequest();
        req.productCode = "NEW";
        req.name = "NEW";
        req.unitPrice = new BigDecimal("9.99");

        Product updated = service.update(1L, req);

        assertNotNull(updated);
        assertEquals("NEW", updated.productCode);
        assertEquals("NEW", updated.name);
        assertEquals(new BigDecimal("9.99"), updated.unitPrice);
    }

    @Test
    void create_throwsNotFoundWhenFeedstockDoesNotExist() {
        ProductDtos.CreateRequest req = new ProductDtos.CreateRequest();
        req.productCode = "P001";
        req.name = "Produto";
        req.unitPrice = new BigDecimal("10.00");

        ProductDtos.FeedstockQuantity fq = new ProductDtos.FeedstockQuantity();
        fq.feedstockId = 999L;
        fq.quantity = new BigDecimal("1.000");

        req.feedstocks = List.of(fq);

        when(feedstockRepo.findById(999L)).thenReturn(null);

        assertThrows(NotFoundException.class, () -> service.create(req));
        verify(feedstockRepo).findById(999L);
    }

    @Test
    void create_persistsProductAndAddsJoinRows() {
        ProductDtos.CreateRequest req = new ProductDtos.CreateRequest();
        req.productCode = "P001";
        req.name = "Produto";
        req.unitPrice = new BigDecimal("10.00");

        ProductDtos.FeedstockQuantity fq1 = new ProductDtos.FeedstockQuantity();
        fq1.feedstockId = 10L;
        fq1.quantity = new BigDecimal("0.250");

        ProductDtos.FeedstockQuantity fq2 = new ProductDtos.FeedstockQuantity();
        fq2.feedstockId = 11L;
        fq2.quantity = new BigDecimal("1.500");

        req.feedstocks = List.of(fq1, fq2);

        Feedstock f1 = new Feedstock();
        f1.id = 10L;
        f1.feedstockCode = "F10";
        f1.name = "Mat 10";
        f1.stock = new BigDecimal("100.0");

        Feedstock f2 = new Feedstock();
        f2.id = 11L;
        f2.feedstockCode = "F11";
        f2.name = "Mat 11";
        f2.stock = new BigDecimal("50.0");

        when(feedstockRepo.findById(10L)).thenReturn(f1);
        when(feedstockRepo.findById(11L)).thenReturn(f2);

        doAnswer(inv -> {
            Product p = inv.getArgument(0);
            p.id = 123L;
            return null;
        }).when(productRepo).persist(any(Product.class));

        Product created = service.create(req);

        assertNotNull(created);
        assertEquals(123L, created.id);
        assertEquals("P001", created.productCode);
        assertEquals(2, created.feedstocks.size());

        verify(productRepo).persist(any(Product.class));
        verify(productRepo).flush();
        verify(feedstockRepo).findById(10L);
        verify(feedstockRepo).findById(11L);
    }
}