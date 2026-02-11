package br.com.autoflex.service;

import br.com.autoflex.dto.FeedstockDtos;
import br.com.autoflex.entity.Feedstock;
import br.com.autoflex.repository.FeedstockRepository;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Page;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.InjectMock;

import jakarta.inject.Inject;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

@QuarkusTest
class FeedstockServiceTest {

    @Inject
    FeedstockService service;

    @InjectMock
    FeedstockRepository repo;

    @Test
    void list_appliesDefaultsAndPagesQuery() {
        @SuppressWarnings("unchecked")
        PanacheQuery<Feedstock> query = mock(PanacheQuery.class);

        when(repo.search("x")).thenReturn(query);
        when(query.page(any(Page.class))).thenReturn(query);

        PanacheQuery<Feedstock> result = service.list("x", null, null);

        assertSame(query, result);
        verify(repo).search("x");
        
        verify(query).page(argThat(page -> 
            page.index == 0 && page.size == 20
        ));
    }

    @Test
    void create_persistsEntity() {
        FeedstockDtos.CreateRequest req = new FeedstockDtos.CreateRequest();
        req.feedstockCode = "F001";
        req.name = "Mat";
        req.stock = new BigDecimal("10.0");
        req.unitOfMeasure = "KG";

        Feedstock created = service.create(req);

        assertNotNull(created);
        assertEquals("F001", created.feedstockCode);
        verify(repo).persist(any(Feedstock.class));
    }

    @Test
    void update_returnsNullWhenNotFound() {
        when(repo.findById(9L)).thenReturn(null);

        FeedstockDtos.UpdateRequest req = new FeedstockDtos.UpdateRequest();
        req.feedstockCode = "F009";
        req.name = "X";
        req.stock = new BigDecimal("1.0");
        req.unitOfMeasure = "KG";

        Feedstock updated = service.update(9L, req);

        assertNull(updated);
        verify(repo).findById(9L);
    }

    @Test
    void delete_delegatesToDeleteById() {
        when(repo.deleteById(3L)).thenReturn(true);

        boolean ok = service.delete(3L);

        assertTrue(ok);
        verify(repo).deleteById(3L);
    }
}