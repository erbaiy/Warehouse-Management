export const calculateStatistics = (products) => {
  let totalProducts = products.length;
  let totalWarehouses = new Set(); // Use a Set to store unique warehouse IDs
  let outOfStockProducts = 0;
  let totalStockValue = 0;
  let recentlyAdded = [];
  let recentlyRemoved = [];

  products.forEach((product) => {
    // Calculate total stock value
    if (product.stocks && product.stocks.length > 0) {
      product.stocks.forEach((stock) => {
        totalStockValue += stock.quantity * product.price;
        totalWarehouses.add(stock.id); // Add warehouse ID to the Set
      });
    } else {
      outOfStockProducts++; // Increment out-of-stock products count
    }

    // Track recently added/removed products
    if (product.editedBy && product.editedBy.length > 0) {
      const lastEdit = product.editedBy[product.editedBy.length - 1];
      if (lastEdit.at) {
        const editDate = new Date(lastEdit.at);
        const now = new Date();
        const timeDiff = now - editDate; // Time difference in milliseconds

        // Check if the product was edited within the last 7 days
        if (timeDiff <= 7 * 24 * 60 * 60 * 1000) {
          if (product.stocks && product.stocks.length > 0) {
            recentlyAdded.push({
              name: product.name,
              quantity: product.stocks.reduce((sum, stock) => sum + stock.quantity, 0),
            });
          } else {
            recentlyRemoved.push({
              name: product.name,
              quantity: 0,
            });
          }
        }
      }
    }
  });

  return {
    totalProducts,
    totalWarehouses: totalWarehouses.size, // Number of unique warehouses
    outOfStockProducts,
    totalStockValue,
    recentlyAdded,
    recentlyRemoved,
  };
};