// src/components/CSVTradeImport.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrades } from '../../context/TradeContext';
import Sidebar from '../Sidebar';
import { parse } from 'papaparse';
import { calculatePNL } from '../../utils/calculatePNL';
import axios from 'axios';

// Unique ID Generator Function
const generateUniqueId = (): string => {
  // Combines current timestamp with a random number to ensure uniqueness
  return `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const CSVTradeImport: React.FC = () => {
  const navigate = useNavigate();
  const { addBulkTrades } = useTrades();
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsingError, setParsingError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const SERVER_URL = `${window.location.origin}/api`;

  // Define a header mapping to handle duplicate or varied headers
  const headerMapping: { [key: string]: string } = {
    'orderid': 'orderId',
    'order id': 'orderId',
    'orderid_1': 'orderId', // Handling duplicate
    'b/s': 'side',
    'filledqty': 'filledQty',
    'filled qty': 'filledQty',
    'filledqty_1': 'filledQty', // Handling duplicate
    'fill time': 'fillTime',
    'avgprice': 'avgPrice',
    'avg fill price': 'avgFillPrice',
    'limit price': 'limitPrice',
    'stop price': 'stopPrice',
    // Add more mappings as needed
  };

  const validateCSVData = (data: any[]) => {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No data found in CSV file');
    }

    // Essential fields expected in the CSV (in camelCase)
    const requiredFields = [
      'orderId',
      'side',
      'contract',
      'product',
      'avgPrice',
      'filledQty',
      'fillTime',
      'status',
      'limitPrice',
      'stopPrice',
      'quantity',
      'type',
      'timestamp',
    ];

    const firstRow = data[0];
    const rawHeaders = Object.keys(firstRow);
    console.log('First row raw keys:', rawHeaders); // Raw headers for debugging

    // Normalize headers by trimming and converting to lowercase
    const normalizedFirstRowKeys = rawHeaders.map(key => key.trim().toLowerCase());

    // Check if requiredFields are present
    const missingFields = requiredFields.filter(field => !normalizedFirstRowKeys.includes(field.toLowerCase()));

    console.log('Missing fields (after normalization):', missingFields); // Debugging for missing fields

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}. Please ensure your CSV has the correct headers.`);
    }

    return true;
  };

  const camelCase = (str: string): string => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    ).replace(/\s+/g, '');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParsingError(null);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        setParsingError('Please upload a valid CSV file');
        return;
      }
      setCsvFile(file);
    }
  };

  const handleImport = async () => {
    if (!csvFile) return;
    setIsProcessing(true);
    setParsingError(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (!event.target?.result) {
        setParsingError('Failed to read file');
        setIsProcessing(false);
        return;
      }

      // Clean the CSV data before parsing
      const csvData = event.target.result.toString()
        .replace(/\r\n|\n|\r/g, '\n') // Normalize line endings
        .trim();
      
      // Debugging logs
      console.log('First row:', csvData.split('\n')[0]);
      console.log('First 10 rows:', csvData.split('\n').slice(0, 10));

      parse(csvData, {
        header: true,
        skipEmptyLines: true, // Skip empty lines completely
        transformHeader: (header) => {
          const normalizedHeader = header.trim().toLowerCase();
          const mappedHeader = headerMapping[normalizedHeader] || camelCase(header);
          console.log(`Mapping header: "${header}" -> "${mappedHeader}"`); // Detailed logging
          return mappedHeader;
        },
        transform: (value) => value.trim(),
        dynamicTyping: {
          orderId: false, // Ensure 'orderId' is parsed as string
          filledQty: true,
          quantity: true,
          avgPrice: true,
          avgFillPrice: true,
          limitPrice: true,
          stopPrice: true,
        },
        complete: async (results) => {
          try {
            // Log transformed headers for verification
            const transformedHeaders = results.meta.fields;
            console.log('Transformed headers:', transformedHeaders);

            // Validate CSV data
            validateCSVData(results.data);

            // Map data to internal field names and consolidate duplicates
            const normalizedData = results.data.map((row, index) => {
              const newRow: any = {};
              for (const key in row) {
                const mappedKey = key.trim();
                if (newRow[mappedKey] === undefined || newRow[mappedKey] === '') {
                  newRow[mappedKey] = row[key];
                }
              }
              //console.log(`Normalized row ${index + 1}:`, newRow); // Detailed row logging
              return newRow;
            });

            console.log('First row after normalization:', normalizedData[0]);

            const trades = calculatePNL(normalizedData);
            console.log('Trades after PNL calculation:', trades);
            if (trades.length === 0) {
              setParsingError('No valid trades found in the CSV file');
              setIsProcessing(false);
              return;
            }

            // Assign unique string IDs to each trade to prevent duplicates
            const tradesWithUniqueIds = trades.map(trade => ({
              ...trade,
              id: generateUniqueId(), // Assign a unique string ID
            }));

            console.log('Trades with unique IDs:', tradesWithUniqueIds);

            // Send trades to backend using addBulkTrades
            await addBulkTrades(tradesWithUniqueIds);
            alert('Bulk trades uploaded successfully!');
            setCsvFile(null);
            navigate('/'); // Redirect to calendar
          } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            console.error('Error processing trades:', error);
            setParsingError(`Error processing trades: ${errorMessage}`);
            setIsProcessing(false);
          }
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          setParsingError(`Failed to parse CSV file: ${error.message}`);
          setIsProcessing(false);
        }
      });
    };

    reader.onerror = () => {
      setParsingError('Failed to read file');
      setIsProcessing(false);
    };

    reader.readAsText(csvFile);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-semibold">Import Trades from CSV</h1>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              <p className="mt-2 text-sm text-gray-500">
                Please upload a CSV file containing your trade data
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Don't know how? <a href="https://www.loom.com/share/04414cd4698147eea9ee8bf38915c6d9" target="_blank" rel="noreferrer" className="text-blue-600">Learn more</a>
              </p>
              
              {/* Provide Sample CSV Download */}
              <div className="mt-4">
                <a
                  href="/sample-trades.csv" // Ensure this path points to your sample CSV file
                  download
                  className="text-blue-600 underline"
                >
                  Download Sample CSV Template
                </a>
              </div>
            </div>

            {parsingError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                <strong className="font-medium">Error: </strong>
                <span className="block sm:inline">{parsingError}</span>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleImport}
                disabled={!csvFile || isProcessing}
                className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg
                  hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                  ${(!csvFile || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Import Trades'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSVTradeImport;
