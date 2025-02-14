import React from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import * as IntentLauncher from 'expo-intent-launcher';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

const generateProductHTML = (products) => {
  const tableRows = products.map(product => {
    const totalStock = product.stocks.reduce((acc, stock) => acc + stock.quantity, 0);
    const stockStatus = totalStock <= 0 ? 'Out of Stock' : 'In Stock';
    const stockColor = totalStock <= 0 ? '#ff4444' : '#4CAF50';
    
    return `
      <tr>
        <td>
          <img src="${product.image}" style="width: 50px; height: 50px; object-fit: contain;">
        </td>
        <td>${product.name}</td>
        <td>${product.type}</td>
        <td>${product.supplier}</td>
        <td>$${product.price.toFixed(2)}</td>
        <td style="color: ${stockColor}">${stockStatus} (${totalStock})</td>
      </tr>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            padding: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .summary {
            margin-bottom: 30px;
            padding: 15px;
            background-color: #f5f5f5;
            border-radius: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #f8f9fa;
          }
          tr:nth-child(even) {
            background-color: #f8f9fa;
          }
          img {
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Inventory Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="summary">
          <h2>Inventory Summary</h2>
          <p>Total Products: ${products.length}</p>
          <p>Out of Stock Items: ${products.filter(p => p.stocks.reduce((acc, s) => acc + s.quantity, 0) <= 0).length}</p>
          <p>Total Value: $${products.reduce((acc, p) => acc + (p.price * p.stocks.reduce((sum, s) => sum + s.quantity, 0)), 0).toFixed(2)}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Type</th>
              <th>Supplier</th>
              <th>Price</th>
              <th>Stock Status</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
    </html>
  `;
};

export const generatePDF = async (products) => {
  try {
    // Generate HTML
    const html = generateProductHTML(products);
    
    // Create PDF file
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false
    });

    // Create a new filename
    const filename = `inventory-report-${Date.now()}.pdf`;
    const destination = FileSystem.documentDirectory + filename;
    
    // Copy the file to documents directory
    await FileSystem.copyAsync({
      from: uri,
      to: destination
    });

    // Show options to user
    Alert.alert(
      'PDF Generated',
      'What would you like to do with the PDF?',
      [
        {
          text: 'View',
          onPress: async () => {
            if (Platform.OS === 'ios') {
              // For iOS, use WebBrowser
              await WebBrowser.openBrowserAsync(`file://${destination}`);
            } else {
              // For Android, use Intent Launcher
              const cUri = await FileSystem.getContentUriAsync(destination);
              await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                data: cUri,
                flags: 1,
                type: 'application/pdf',
              });
            }
          },
        },
        {
          text: 'Share',
          onPress: async () => {
            const isAvailable = await Sharing.isAvailableAsync();
            if (isAvailable) {
              await Sharing.shareAsync(destination, {
                UTI: '.pdf',
                mimeType: 'application/pdf',
                dialogTitle: 'Share PDF Report'
              });
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    Alert.alert('Error', 'Failed to generate PDF report');
    return false;
  }
};

const ProductPDFButton = ({ product, theme }) => {
  return (
    <TouchableOpacity 
      style={{ 
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.cardBackground,
        padding: 8,
        borderRadius: 6
      }}
      onPress={() => generatePDF([product])}
    >
      <Ionicons name="document-outline" size={20} color={theme.text} />
    </TouchableOpacity>
  );
};

export default ProductPDFButton;






















// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import * as Print from 'expo-print';
// import { shareAsync } from 'expo-sharing';

// const generateProductHTML = (products) => {
//   const tableRows = products.map(product => {
//     const totalStock = product.stocks.reduce((acc, stock) => acc + stock.quantity, 0);
//     const stockStatus = totalStock <= 0 ? 'Out of Stock' : 'In Stock';
//     const stockColor = totalStock <= 0 ? '#ff4444' : '#4CAF50';
    
//     return `
//       <tr>
//         <td>
//           <img src="${product.image}" style="width: 50px; height: 50px; object-fit: contain;">
//         </td>
//         <td>${product.name}</td>
//         <td>${product.type}</td>
//         <td>${product.supplier}</td>
//         <td>$${product.price.toFixed(2)}</td>
//         <td style="color: ${stockColor}">${stockStatus} (${totalStock})</td>
//       </tr>
//     `;
//   }).join('');

//   return `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
//         <style>
//           body {
//             font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
//             padding: 20px;
//             color: #333;
//           }
//           .header {
//             text-align: center;
//             margin-bottom: 30px;
//           }
//           .summary {
//             margin-bottom: 30px;
//             padding: 15px;
//             background-color: #f5f5f5;
//             border-radius: 5px;
//           }
//           table {
//             width: 100%;
//             border-collapse: collapse;
//             margin-top: 20px;
//           }
//           th, td {
//             border: 1px solid #ddd;
//             padding: 12px;
//             text-align: left;
//           }
//           th {
//             background-color: #f8f9fa;
//           }
//           tr:nth-child(even) {
//             background-color: #f8f9fa;
//           }
//           img {
//             border-radius: 4px;
//           }
//         </style>
//       </head>
//       <body>
//         <div class="header">
//           <h1>Inventory Report</h1>
//           <p>Generated on ${new Date().toLocaleDateString()}</p>
//         </div>
        
//         <div class="summary">
//           <h2>Inventory Summary</h2>
//           <p>Total Products: ${products.length}</p>
//           <p>Out of Stock Items: ${products.filter(p => p.stocks.reduce((acc, s) => acc + s.quantity, 0) <= 0).length}</p>
//           <p>Total Value: $${products.reduce((acc, p) => acc + (p.price * p.stocks.reduce((sum, s) => sum + s.quantity, 0)), 0).toFixed(2)}</p>
//         </div>

//         <table>
//           <thead>
//             <tr>
//               <th>Image</th>
//               <th>Name</th>
//               <th>Type</th>
//               <th>Supplier</th>
//               <th>Price</th>
//               <th>Stock Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${tableRows}
//           </tbody>
//         </table>
//       </body>
//     </html>
//   `;
// };

// export const generatePDFReport = async (products) => {
//   try {
//     const html = generateProductHTML(products);
//     const { uri } = await Print.printToFileAsync({
//       html,
//       base64: false
//     });
    
//     await shareAsync(uri, {
//       UTI: '.pdf',
//       mimeType: 'application/pdf'
//     });

//     return true;
//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     return false;
//   }
// };

// export default generatePDFReport;