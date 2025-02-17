

  const calculateStatistics = (products) => {
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



  
  // Helper function to format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };
  
  // Example usage:
  // const stats = calculateStatistics(products, warehousemans);
  // console.log(stats);

export function updateStatistics(statistics, action, product, quantity) {
  if (!statistics) {
      statistics = { ...initialStatistics };
  }

  try {
      switch (action) {
          case "add":
              statistics.totalProducts += 1;
              statistics.totalStockValue += quantity;
              statistics.mostAddedProducts.push({ 
                  product: {
                      id: product.id,
                      name: product.name,
                      price: product.price
                  }, 
                  quantity,
                  date: new Date().toISOString()
              });
              break;
          case "remove":
              statistics.totalProducts = Math.max(0, statistics.totalProducts - 1);
              statistics.totalStockValue = Math.max(0, statistics.totalStockValue - quantity);
              statistics.mostRemovedProducts.push({ 
                  product: {
                      id: product.id,
                      name: product.name,
                      price: product.price
                  }, 
                  quantity,
                  date: new Date().toISOString()
              });
              break;
          case "outOfStock":
              statistics.outOfStock += 1;
              break;
          case "restock":
              statistics.outOfStock = Math.max(0, statistics.outOfStock - 1);
              statistics.totalStockValue += quantity;
              break;
          default:
              console.log("Invalid action");
      }

      // Keep only last 10 items in history
      statistics.mostAddedProducts = statistics.mostAddedProducts.slice(-10);
      statistics.mostRemovedProducts = statistics.mostRemovedProducts.slice(-10);

      return statistics;
  } catch (error) {
      console.error('Error updating statistics:', error);
      return statistics;
  }
}



