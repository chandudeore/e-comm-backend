// src/docs/components.js
module.exports = {
  securitySchemes: {
    BearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      description: "Enter your JWT token as: Bearer <token>",
    },
  },
  schemas: {
    ErrorResponse: {
      type: "object",
      properties: {
        success: { type: "boolean", example: false },
        message: { type: "string", example: "Validation failed" },
        details: {
          type: "array",
          items: { type: "string" },
          nullable: true,
        },
      },
    },
    User: {
      type: "object",
      properties: {
        id: { type: "integer", example: 1 },
        first_name: { type: "string", example: "Aarav" },
        last_name: { type: "string", example: "Sharma" },
        email: { type: "string", format: "email", example: "aarav@example.com" },
        role: { type: "string", enum: ["customer", "admin"], example: "customer" },
        status: { type: "integer", example: 1 },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
      },
    },
    Product: {
      type: "object",
      properties: {
        id: { type: "integer", example: 101 },
        title: { type: "string", example: "Wireless Noise-Cancelling Headphones" },
        price: { type: "number", format: "float", example: 149.99 },
        description: { type: "string", example: "Over-ear wireless headphones with 30h battery" },
        category: { type: "string", example: "electronics" },
        image: { type: "string", format: "uri", example: "https://example.com/headphones.jpg" },
        stock: { type: "integer", example: 25 },
        rating_rate: { type: "number", format: "float", example: 4.5 },
        rating_count: { type: "integer", example: 120 },
        created_at: { type: "string", format: "date-time" },
      },
    },
    CartItem: {
      type: "object",
      properties: {
        cart_item_id: { type: "integer", example: 12 },
        quantity: { type: "integer", example: 2 },
        product_id: { type: "integer", example: 101 },
        title: { type: "string", example: "Wireless Noise-Cancelling Headphones" },
        price: { type: "number", format: "float", example: 149.99 },
        image: { type: "string", format: "uri" },
        category: { type: "string", example: "electronics" },
        subtotal: { type: "number", format: "float", example: 299.98 },
      },
    },
    CartSummary: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: { $ref: "#/components/schemas/CartItem" },
        },
        totalAmount: { type: "number", format: "float", example: 299.98 },
      },
    },
  },
  responses: {
    UnauthorizedError: {
      description: "Missing or invalid JWT token",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorResponse" },
        },
      },
    },
    ForbiddenError: {
      description: "Insufficient permissions for this resource",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorResponse" },
        },
      },
    },
    NotFoundError: {
      description: "Requested resource not found",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ErrorResponse" },
        },
      },
    },
  },
};