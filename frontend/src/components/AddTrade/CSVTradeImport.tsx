// src/components/CSVTradeImport.tsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

interface CSVTradeImportProps {
  onBack: () => void;
}

export default function CSVTradeImport({ onBack }: CSVTradeImportProps) {
  const navigate = useNavigate();
  const { addBulkTrades } = useTrades();
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsingError, setParsingError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-bl from-[#120322] via-[#0B0118] to-[#0B0118]">
      <Sidebar 
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />
      <div className={`transition-all duration-300 ${isCollapsed ? 'ml-[80px]' : 'ml-[280px]'} p-8`}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="text-purple-400 hover:text-purple-300"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-semibold text-purple-100">Import Trades from CSV</h1>
          </div>
          
          <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm space-y-6">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Select CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-purple-200
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-purple-800/20 file:text-purple-100
                  hover:file:bg-purple-800/30"
              />
              <p className="mt-2 text-sm text-purple-200">
                Please upload a CSV file containing your trade data
              </p>
              <p className="mt-2 text-sm text-purple-200">
                Don't know how? <a href="https://www.loom.com/share/04414cd4698147eea9ee8bf38915c6d9" target="_blank" rel="noreferrer" className="text-purple-400 hover:text-purple-300">Learn more</a>
              </p>
              
              {/* Provide Sample CSV Download */}
              <div className="mt-4">
                <a
                  href="/sample-trades.csv"
                  download
                  className="inline-flex items-center text-purple-400 hover:text-purple-300"
                >
                  <span>Download Sample CSV</span>
                </a>
              </div>
            </div>

            {parsingError && (
              <div className="p-4 bg-red-900/20 border border-red-800/30 rounded-lg">
                <p className="text-red-400">{parsingError}</p>
              </div>
            )}

            {csvFile && (
              <div>
                <p className="text-purple-200">Selected file: {csvFile.name}</p>
                <button
                  onClick={handleImport}
                  disabled={isProcessing}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    'Import Trades'
                  )}
                </button>
              </div>
            )}

            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4 text-purple-100">CSV Format Requirements</h2>
              <div className="bg-[#1A0F2E] p-4 rounded-lg border border-purple-800/30">
                <p className="text-purple-200 mb-2">Your CSV file should include the following columns:</p>
                <ul className="list-disc list-inside text-purple-200 space-y-1">
                  <li>Order ID</li>
                  <li>Side (Buy/Sell)</li>
                  <li>Contract</li>
                  <li>Product</li>
                  <li>Average Price</li>
                  <li>Filled Quantity</li>
                  <li>Fill Time</li>
                  <li>Status</li>
                  <li>Limit Price</li>
                  <li>Stop Price</li>
                  <li>Quantity</li>
                  <li>Type</li>
                  <li>Timestamp</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
