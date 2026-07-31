export function validateOrder(row) {
  const order = {
    order_id: row.order_id?.trim(),
    customer_id: row.customer_id?.trim(),
    order_date: new Date(row.order_date),
    order_amount: Number(row.order_amount),
    status: row.status?.trim(),
  };

  if (!order.order_id) {
    throw new Error("Invalid order_id");
  }

  if (!order.customer_id) {
    throw new Error("Invalid customer_id");
  }

  if (Number.isNaN(order.order_date.getTime())) {
    throw new Error("Invalid order_date");
  }

  if (Number.isNaN(order.order_amount)) {
    throw new Error("Invalid order_amount");
  }

  if (!order.status) {
    throw new Error("Invalid status");
  }

  return order;
}