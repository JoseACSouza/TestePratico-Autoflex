package br.com.autoflex.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.ws.rs.QueryParam;

import java.math.BigDecimal;
import java.util.List;

public final class FeedstockDtos {
    private FeedstockDtos() {}

    // -------- REQUESTS --------

    public static class PaginateRequest {
        @QueryParam("q")
        public String q;

        @QueryParam("page")
        @Min(0)
        public Integer page;

        @QueryParam("size")
        @Min(1) @Max(100)
        public Integer size;
    }

    public static class CreateRequest {
        @NotBlank
        public String feedstockCode;

        @NotBlank
        public String name;

        @DecimalMin(value = "0.0", inclusive = true)
        public BigDecimal stock;

        @NotBlank
        public String unitOfMeasure;
    }

    public static class UpdateRequest {
        @NotBlank
        public String feedstockCode;

        @NotBlank
        public String name;

        @DecimalMin(value = "0.0", inclusive = true)
        public BigDecimal stock;

        @NotBlank
        public String unitOfMeasure;
    }

    // -------- RESPONSES --------

    public static class ProductItem {
        public Long id;
        public String productCode;
        public String name;
        public BigDecimal unitPrice;
        public BigDecimal quantity;
    }

    public static class Response {
        public Long id;
        public String feedstockCode;
        public String name;
        public BigDecimal stock;
        public String unitOfMeasure;

        public List<ProductItem> products;
    }
}
