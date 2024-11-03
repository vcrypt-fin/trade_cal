// src/components/CSVTradeImport.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrades } from '../../context/TradeContext';
import Sidebar from '../Sidebar';
import { parse } from 'papaparse';
import { calculatePNL } from '../../utils/calculatePNL';
import axios from 'axios';

const CSVTradeImport: React.FC = () => {
  const navigate = useNavigate();
  const { addTrade } = useTrades();
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsingError, setParsingError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const SERVER_URL = `${window.location.origin}/api`;

  const validateCSVData = (data: any[]) => {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No data found in CSV file');
    }

    // Only check for essential fields
    const requiredFields = [
      'orderId',
      'B/S',
      'Contract',
      'Product',
      'avgPrice',
      'filledQty',
      'Fill Time',
      'Status',
      'Limit Price',
      'Stop Price',
    ];

    const firstRow = data[0];
    const missingFields = requiredFields.filter(field => {
      // Check for both exact match and case-insensitive match
      return !Object.keys(firstRow).some(key => 
        key.toLowerCase() === field.toLowerCase()
      );
    });

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParsingError(null);
    if (e.target.files && e.target.files[0]) {
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
        .replace(/,,+/g, ',') // Remove consecutive commas
        .replace(/,\n/g, '\n') // Remove trailing commas
        .trim();

      parse(csvData, {
        header: true,
        skipEmptyLines: 'greedy',
        transformHeader: (header) => header.trim(),
        transform: (value) => value.trim(),
        dynamicTyping: {
          orderId: false, // Ensure 'orderId' is parsed as string
          // You can specify other fields here if needed
        },
        complete: async (results) => {
          try {
            // Ignore field count errors since we only need specific fields
            const relevantErrors = results.errors.filter(error => 
              !error.message.includes('fields') && 
              !error.message.includes('delimiter')
            );

            if (relevantErrors.length > 0) {
              const errorMessage = relevantErrors
                .map(error => `Row ${error.row}: ${error.message}`)
                .join('; ');
              setParsingError(`CSV parsing errors: ${errorMessage}`);
              setIsProcessing(false);
              return;
            }

            validateCSVData(results.data);
            const trades = calculatePNL(results.data);
            
            if (trades.length === 0) {
              setParsingError('No valid trades found in the CSV file');
              setIsProcessing(false);
              return;
            }

            // Send trades to backend
            const apiResponse = await axios.post(`${SERVER_URL}/trades/bulk`, trades, {
              headers: {
                'Content-Type': 'application/json'
              }
            });

            if (apiResponse.status === 201) {
              const { added, skipped } = apiResponse.data;
              added.forEach((trade: any) => addTrade(trade)); // Update local state
              if (skipped.length > 0) {
                alert(`${skipped.length} duplicate trades were skipped.`);
              }
              setIsProcessing(false);
              navigate('/');
            }

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
