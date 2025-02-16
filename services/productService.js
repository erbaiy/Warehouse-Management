// export const calculateStatistics = (products, warehousemans) => {
//     // Initialize statistics object
//     const statistics = {
//       totalProducts: 0,
//       totalWarehouses: new Set(), // Using Set to avoid duplicates
//       outOfStock: 0,
//       totalStockValue: 0,
//       recentlyAdded: [],
//       recentlyRemoved: [],
//       productsByWarehouse: {},
//       warehouseUtilization: {},
//       averageProductPrice: 0,
//       mostActiveWarehouses: []
//     };
  
//     // Calculate basic statistics
//     statistics.totalProducts = products.length;
  
//     // Process each product
//     products.forEach(product => {
//       // Count warehouses and calculate stock values
//       if (product.stocks && product.stocks.length > 0) {
//         product.stocks.forEach(stock => {
//           statistics.totalWarehouses.add(stock.id);
          
//           // Calculate total stock value
//           const stockValue = (stock.quantity || 0) * (product.price || 0);
//           statistics.totalStockValue += stockValue;
  
//           // Track products by warehouse
//           if (!statistics.productsByWarehouse[stock.id]) {
//             statistics.productsByWarehouse[stock.id] = [];
//           }
//           statistics.productsByWarehouse[stock.id].push({
//             productId: product.id,
//             name: product.name,
//             quantity: stock.quantity,
//             value: stockValue
//           });
//         });
//       } else {
//         // Count out of stock products
//         statistics.outOfStock++;
//       }
  
//       // Track recently added/edited products
//       if (product.editedBy && product.editedBy.length > 0) {
//         const latestEdit = product.editedBy[product.editedBy.length - 1];
//         const editInfo = {
//           name: product.name,
//           quantity: product.stocks.reduce((total, stock) => total + (stock.quantity || 0), 0),
//           date: new Date(latestEdit.at),
//           warehousemanId: latestEdit.warehousemanId
//         };
  
//         // Add to recently added/edited list (keeping last 5 entries)
//         statistics.recentlyAdded.push(editInfo);
//       }
//     });
  
//     // Calculate warehouse utilization
//     Object.keys(statistics.productsByWarehouse).forEach(warehouseId => {
//       const warehouse = statistics.productsByWarehouse[warehouseId];
//       statistics.warehouseUtilization[warehouseId] = {
//         totalProducts: warehouse.length,
//         totalValue: warehouse.reduce((sum, product) => sum + product.value, 0),
//         averageProductQuantity: warehouse.reduce((sum, product) => sum + product.quantity, 0) / warehouse.length
//       };
//     });
  
//     // Calculate average product price
//     const totalPrice = products.reduce((sum, product) => sum + (product.price || 0), 0);
//     statistics.averageProductPrice = totalPrice / statistics.totalProducts;
  
//     // Sort and limit recently added products to last 5
//     statistics.recentlyAdded.sort((a, b) => b.date - a.date);
//     statistics.recentlyAdded = statistics.recentlyAdded.slice(0, 5);
  
//     // Calculate most active warehouses based on number of products and total value
//     statistics.mostActiveWarehouses = Object.entries(statistics.warehouseUtilization)
//       .map(([id, data]) => ({
//         id,
//         ...data,
//         warehouseman: warehousemans.find(w => w.warehouseId === parseInt(id))?.name || 'Unknown'
//       }))
//       .sort((a, b) => b.totalValue - a.totalValue)
//       .slice(0, 3);
  
//     // Convert totalWarehouses Set to number
//     statistics.totalWarehouses = statistics.totalWarehouses.size;
  
//     return statistics;
//   };
  



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



