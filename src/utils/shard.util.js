const TOTAL_SHARDS = 4;

export function getShardKey(customerId) {
  let hash = 0;

  for (let i = 0; i < customerId.length; i++) {
    hash += customerId.charCodeAt(i);
  }

  return hash % TOTAL_SHARDS;
}
