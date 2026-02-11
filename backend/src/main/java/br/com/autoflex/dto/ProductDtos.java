package br.com.autoflex.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.QueryParam;

import java.math.BigDecimal;
import java.util.List;

public class ProductDtos {
    private ProductDtos() {}

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
        public String productCode;

        @NotBlank
        public String name;

        @DecimalMin(value = "0.0", inclusive = true)
        public BigDecimal unitPrice;

        @NotEmpty
        public List<FeedstockQuantity> feedstocks;
    }

    public static class FeedstockQuantity {
        @NotNull
        public Long feedstockId;

        @DecimalMin(value = "0.0", inclusive = false) // > 0
        public BigDecimal quantity;
    }

    public static class UpdateRequest {
        @NotBlank
        public String productCode;

        @NotBlank
        public String name;

        @DecimalMin(value = "0.0", inclusive = true)
        public BigDecimal unitPrice;

        @NotEmpty
        public List<FeedstockQuantity> feedstocks;
    }

    public static class FeedstockItem {
        public Long id;
        public String feedstockCode;
        public String name;
        public BigDecimal stock;
        public BigDecimal quantity;
    }


    public static class Response {
        public Long id;
        public String productCode;
        public String name;
        public BigDecimal unitPrice;
        public List<FeedstockItem> feedstocks;
    }
}
