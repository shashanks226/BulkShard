CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,

    order_id VARCHAR(100) NOT NULL UNIQUE,
    customer_id VARCHAR(100) NOT NULL,
    order_date TIMESTAMP NOT NULL,
    order_amount NUMERIC(12,2) NOT NULL,
    status VARCHAR(50) NOT NULL,

    shard_key INTEGER NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_order_id
ON orders(order_id);

CREATE INDEX idx_orders_customer_id
ON orders(customer_id);

CREATE INDEX idx_orders_shard_key
ON orders(shard_key);