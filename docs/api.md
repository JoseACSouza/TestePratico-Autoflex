AUTOFLEX API DOCUMENTATION
==========================

OVERVIEW
--------

AutoFlex is a RESTful API for managing Products and Feedstocks.

Each Product may use multiple Feedstocks.
Each Feedstock may be used by multiple Products.
The relationship between them stores a "quantity" value representing how much of a feedstock is required to produce a product.

Base URL (local development):
http://localhost:8080

All requests and responses use:
Content-Type: application/json


====================================================
PAGINATION
====================================================

List endpoints support pagination.

Query Parameters:

- page (number)    → Page index (default: 0)
- size (number)    → Page size (default: 20, max: 100)
- q (string)       → Search term
- searchType       → Only for Products (product | feedstock)

Paginated Response Structure:

{
  "items": [],
  "total": 0,
  "page": 0,
  "size": 20
}


====================================================
PRODUCT ENDPOINTS
====================================================

1) LIST PRODUCTS
----------------

GET /products

Optional Query Parameters:
- q
- searchType (product | feedstock)
- page
- size

Example:
GET /products?q=steel&searchType=feedstock&page=0&size=10

Response:

{
  "items": [
    {
      "id": 1,
      "productCode": "P001",
      "name": "Bolt",
      "unitPrice": 1.50,
      "feedstocks": [
        {
          "id": 12,
          "feedstockCode": "F010",
          "name": "Steel",
          "stock": 250.500000,
          "quantity": 0.250000
        }
      ]
    }
  ],
  "total": 1,
  "page": 0,
  "size": 10
}


2) GET PRODUCT BY ID
---------------------

GET /products/{id}

Example:
GET /products/1

Response:

{
  "id": 1,
  "productCode": "P001",
  "name": "Bolt",
  "unitPrice": 1.50,
  "feedstocks": [
    {
      "id": 12,
      "feedstockCode": "F010",
      "name": "Steel",
      "stock": 250.500000,
      "quantity": 0.250000
    }
  ]
}

If not found:
404 Not Found


3) CREATE PRODUCT
-----------------

POST /products

Request Body:

{
  "productCode": "P010",
  "name": "New Product",
  "unitPrice": 10.00,
  "feedstocks": [
    {
      "feedstockId": 12,
      "quantity": 0.200000
    }
  ]
}

Response (201 Created):

{
  "id": 10,
  "productCode": "P010",
  "name": "New Product",
  "unitPrice": 10.00,
  "feedstocks": [
    {
      "id": 12,
      "feedstockCode": "F010",
      "name": "Steel",
      "stock": 250.500000,
      "quantity": 0.200000
    }
  ]
}


4) UPDATE PRODUCT
-----------------

PUT /products/{id}

Request Body:

{
  "productCode": "P010",
  "name": "Updated Product",
  "unitPrice": 12.50
}

Response (200 OK):

{
  "id": 10,
  "productCode": "P010",
  "name": "Updated Product",
  "unitPrice": 12.50,
  "feedstocks": [...]
}

If not found:
404 Not Found


5) DELETE PRODUCT
-----------------

DELETE /products/{id}

Responses:
204 No Content
404 Not Found


====================================================
FEEDSTOCK ENDPOINTS
====================================================

1) LIST FEEDSTOCKS
------------------

GET /feedstocks

Example:
GET /feedstocks?q=steel&page=0&size=10

Response:

{
  "items": [
    {
      "id": 12,
      "feedstockCode": "F010",
      "name": "Steel",
      "stock": 250.500000,
      "unitOfMeasure": "KG",
      "products": [
        {
          "id": 1,
          "productCode": "P001",
          "name": "Bolt",
          "unitPrice": 1.50,
          "quantity": 0.250000
        }
      ]
    }
  ],
  "total": 1,
  "page": 0,
  "size": 10
}


2) GET FEEDSTOCK BY ID
----------------------

GET /feedstocks/{id}

Response:

{
  "id": 12,
  "feedstockCode": "F010",
  "name": "Steel",
  "stock": 250.500000,
  "unitOfMeasure": "KG",
  "products": [...]
}

If not found:
404 Not Found


3) CREATE FEEDSTOCK
-------------------

POST /feedstocks

Request Body:

{
  "feedstockCode": "F100",
  "name": "Rubber",
  "stock": 80.000000,
  "unitOfMeasure": "KG"
}

Response (201 Created):

{
  "id": 100,
  "feedstockCode": "F100",
  "name": "Rubber",
  "stock": 80.000000,
  "unitOfMeasure": "KG",
  "products": []
}


4) UPDATE FEEDSTOCK
-------------------

PUT /feedstocks/{id}

Request Body:

{
  "feedstockCode": "F100",
  "name": "Updated Rubber",
  "stock": 75.500000,
  "unitOfMeasure": "KG"
}

Response (200 OK):

{
  "id": 100,
  "feedstockCode": "F100",
  "name": "Updated Rubber",
  "stock": 75.500000,
  "unitOfMeasure": "KG",
  "products": []
}


5) DELETE FEEDSTOCK
-------------------

DELETE /feedstocks/{id}

Responses:
204 No Content
404 Not Found


====================================================
ERROR HANDLING
====================================================

400 Bad Request
Occurs when validation fails (e.g., missing required fields).

Example:
{
  "details": "name must not be blank"
}

404 Not Found
Returned when the requested resource does not exist.

500 Internal Server Error
Returned when an unexpected server-side error occurs.
