import React, {
  createContext,
  useContext,
  useCallback,
  ReactNode,
} from "react";
import { parse } from "papaparse";
import { Trade } from "../types/trade";
import { calculatePNL } from "../utils/calculatePNL";

interface CSVTrade {
  orderId: string;
  side: string;
  contract: string;
  product: string;
  avgPrice: number;
  filledQty: number;
  fillTime: string;
  status: string;
  text: string;
  limitPrice: number;
  stopPrice: number;
  avgFillPrice: number;
}

type CsvParser = (csv: string) => Trade[];

interface CsvImportContextProps {
  parseCsv: (csv: string, brokerage: string) => Trade[];
  supportedBrokers: string[];
}

// Create CsvImportContext
const CsvImportContext = createContext<CsvImportContextProps | undefined>(
  undefined
);

// Header mappings for different brokerages
const headerMappings: Record<string, { [key: string]: string }> = {
  Tradovate: {
    orderid: "orderId",
    "order id": "orderId",
    "b/s": "side",
    filledqty: "filledQty",
    "filled qty": "filledQty",
    filltime: "fillTime",
    "fill time": "fillTime",
    avgprice: "avgPrice",
    "average price": "avgPrice",
    contract: "contract",
    product: "product",
    status: "status",
    text: "text",
    "limit price": "limitPrice",
    limitprice: "limitPrice",
    "stop price": "stopPrice",
    stopprice: "stopPrice",
    "avg fill price": "avgFillPrice",
    avgfillprice: "avgFillPrice",
  },
};

// Parses CSV rows into CSVTrade objects
const processRows = (
  data: Record<string, any>[],
  brokerage: string
): CSVTrade[] => {
  return data.map((row, index) => ({
    orderId: row.orderId || "",
    side: row.side || "",
    contract: row.contract || "",
    product: row.product || "",
    avgPrice: parseFloat(row.avgPrice) || 0,
    filledQty: parseInt(row.filledQty, 10) || 0,
    fillTime: row.fillTime || "",
    status: row.status || "",
    text: row.text || "",
    limitPrice: parseFloat(row.limitPrice) || 0,
    stopPrice: parseFloat(row.stopPrice) || 0,
    avgFillPrice: parseFloat(row.avgFillPrice) || 0,
  }));
};

// Main CSV parsing function
const parseCsvForBrokerage = (csv: string, brokerage: string): CSVTrade[] => {
  const headerMapping = headerMappings[brokerage];
  if (!headerMapping) {
    throw new Error(`Unsupported brokerage: ${brokerage}`);
  }

  let parsedData: CSVTrade[] = [];

  parse(csv, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => {
      const normalizedHeader = header.trim().toLowerCase();
      return headerMapping[normalizedHeader] || normalizedHeader;
    },
    complete: (results) => {
      const data = results.data as Record<string, any>[];
      parsedData = processRows(data, brokerage);
    },
    error: (error) => {
      throw new Error(`Error parsing CSV: ${error.message}`);
    },
  });

  return parsedData;
};

// CsvImportProvider implementation
const CsvImportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const supportedBrokers = Object.keys(headerMappings);

  const parseCsv = useCallback((csv: string, brokerage: string): Trade[] => {
    const csvTrades = parseCsvForBrokerage(csv, brokerage);
    return calculatePNL(csvTrades); // Converts CSVTrade to Trade
  }, []);

  return (
    <CsvImportContext.Provider value={{ parseCsv, supportedBrokers }}>
      {children}
    </CsvImportContext.Provider>
  );
};

const useCsvImport = (): CsvImportContextProps => {
  const context = useContext(CsvImportContext);
  if (!context) {
    throw new Error("useCsvImport must be used within a CsvImportProvider");
  }
  return context;
};

export { CsvImportProvider, useCsvImport };
