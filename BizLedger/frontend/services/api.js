/**
 * API Service for BizLedger
 *
 * This service handles all API calls to the backend services.
 */

import axios from "axios";
import * as FileSystem from "expo-file-system";

// Base URLs for different services - UPDATE WITH YOUR ACTUAL IP
const BIZLEDGER_BACKEND_URL = "http://172.16.222.232:8000"; // FastAPI backend
const DATABASE_API_URL = "http://172.16.222.232:3000"; // Express backend

/**
 * Test the connection to the BizLedger backend
 * @returns {Promise} Promise with the response
 */
export const testBackendConnection = async () => {
  try {
    const response = await axios.get(`${BIZLEDGER_BACKEND_URL}/health`);
    console.log("✅ Health check response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Health check failed:", error.message);
    throw error;
  }
};

/**
 * Upload audio recording to the backend for transcription
 * @param {string} uri - URI of the audio file
 * @param {string} type - Transaction type (credit/debit)
 * @returns {Promise} Promise with the transcription result
 */
export const uploadAudioForTranscription = async (uri, type) => {
  try {
    console.log(
      `Uploading ${type} audio to ${BIZLEDGER_BACKEND_URL}/transcribe`
    );

    const uploadResult = await FileSystem.uploadAsync(
      `${BIZLEDGER_BACKEND_URL}/transcribe`,
      uri,
      {
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: "file",
        mimeType: "audio/x-m4a",
        parameters: {
          name: "recording.m4a",
          transaction_type: type,
        },
      }
    );

    console.log("✅ Upload complete");
    const result = JSON.parse(uploadResult.body);

    if (result && result.parsed) {
      console.log("✅ Transcription successful with parsed data");
      console.log(`   Parsed transactions: ${result.parsed.length}`);
    } else if (result && result.transcription) {
      console.log(
        "✅ Transcription successful: ",
        result.transcription.substring(0, 50) + "..."
      );
    }

    return result;
  } catch (error) {
    console.error("❌ Upload failed:", error.message);
    throw error;
  }
};

/**
 * Get all transactions from the database
 * @returns {Promise} Promise with the transactions
 */
export const getAllTransactions = async () => {
  try {
    console.log(
      `Fetching transactions from ${DATABASE_API_URL}/ledger`
    );

    // Add timeout to avoid long waits
    const response = await axios.get(`${DATABASE_API_URL}/ledger`, {
      timeout: 10000, // 10 seconds timeout
    });

    const transactions = response.data.ledger || [];

    console.log(`✅ Fetched ${transactions.length} transactions`);

    if (transactions.length > 0) {
      console.log("Sample transaction:", transactions[0]);
    }

    return transactions;
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      console.error(
        "❌ Request timed out. The server might be down or too slow to respond."
      );
    } else if (error.message.includes("Network Error")) {
      console.error(
        "❌ Network error. Make sure the server is running and accessible at:",
        DATABASE_API_URL
      );
      console.error(
        "   Check that the IP address is correct and the server is running on port 3000"
      );
    } else {
      console.error("❌ Failed to get transactions:", error.message);
    }

    // Return empty array instead of throwing to prevent app crashes
    return [];
  }
};

/**
 * Get transaction summary by period
 * @param {string} period - Period (day, week, month, year)
 * @returns {Promise} Promise with the summary
 */
export const getTransactionSummary = async (period = "month") => {
  try {
    const response = await axios.get(
      `${DATABASE_API_URL}/analytics/monthly-summary?period=${period}`
    );
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to get ${period} summary:`, error.message);
    throw error;
  }
};

/**
 * Get profit/loss by period
 * @param {string} period - Period (day, week, month, year)
 * @returns {Promise} Promise with the profit/loss
 */
export const getProfitLoss = async (period = "month") => {
  try {
    const incomeResponse = await axios.get(`${DATABASE_API_URL}/analytics/total-income?period=${period}`);
    const expenseResponse = await axios.get(`${DATABASE_API_URL}/analytics/total-expense?period=${period}`);

    const income = incomeResponse.data.total_income || 0;
    const expense = expenseResponse.data.total_expense || 0;
    const profitOrLoss = income - expense;

    return { profitOrLoss };
  } catch (error) {
    console.error(`❌ Failed to get ${period} profit/loss:`, error.message);
    throw error;
  }
};

/**
 * Get cash flow trend
 * @param {string} period - Period (day, week, month, year)
 * @returns {Promise} Promise with the cash flow trend
 */
export const getCashFlowTrend = async (period = "month") => {
  try {
    const response = await axios.get(`${DATABASE_API_URL}/analytics/daily-spending?period=${period}`);
    return response.data || [];
  } catch (error) {
    console.error("❌ Failed to get cash flow trend:", error.message);
    throw error;
  }
};

/**
 * Get top spending categories
 * @param {string} period - Period (day, week, month, year)
 * @returns {Promise} Promise with the top spending categories
 */
export const getTopSpendingCategories = async (period = "month") => {
  try {
    const response = await axios.get(
      `${DATABASE_API_URL}/analytics/top-categories?period=${period}`
    );
    return response.data || [];
  } catch (error) {
    console.error("❌ Failed to get top spending categories:", error.message);
    throw error;
  }
};

/**
 * Get top income categories
 * @param {string} period - Period (day, week, month, year)
 * @returns {Promise} Promise with the top income categories
 */
export const getTopIncomeCategories = async (period = "month") => {
  try {
    const response = await axios.get(
      `${DATABASE_API_URL}/analytics/top-categories?period=${period}&type=credit`
    );
    return response.data || [];
  } catch (error) {
    console.error("❌ Failed to get top income categories:", error.message);
    throw error;
  }
};

/**
 * Get biggest transaction
 * @returns {Promise} Promise with the biggest transaction
 */
export const getBiggestTransaction = async () => {
  try {
    console.log(`Fetching biggest transaction from ${DATABASE_API_URL}/analytics/biggest-transaction`);
    const response = await axios.get(`${DATABASE_API_URL}/analytics/biggest-transaction`);
    const biggestData = response.data.biggest_transaction;

    if (!biggestData) {
      console.log("No biggest transaction data found");
      return null;
    }

    console.log("Biggest transaction data:", biggestData);

    return {
      amount: biggestData.amount?.toString() || '0',
      type: biggestData.transaction_type || 'unknown',
      description: biggestData.description || 'No description',
      date: biggestData.date || 'No date',
      customer: biggestData.customer || 'Unknown',
      category: biggestData.category || 'Unknown',
      item: biggestData.item || 'Unknown'
    };
  } catch (error) {
    console.error("❌ Failed to get biggest transaction:", error.message);
    throw error;
  }
};

/**
 * Get spending to income ratio
 * @returns {Promise} Promise with the spending ratio
 */
export const getSpendingRatio = async () => {
  try {
    const incomeResponse = await axios.get(`${DATABASE_API_URL}/analytics/total-income`);
    const expenseResponse = await axios.get(`${DATABASE_API_URL}/analytics/total-expense`);

    const income = incomeResponse.data.total_income || 0;
    const expense = expenseResponse.data.total_expense || 0;

    if (income === 0) return 0;

    const ratio = expense / income;
    return ratio;
  } catch (error) {
    console.error("❌ Failed to get spending ratio:", error.message);
    throw error;
  }
};

/**
 * Get customer balances
 * @returns {Promise} Promise with customer balances
 */
export const getCustomerBalances = async () => {
  try {
    const response = await axios.get(`${DATABASE_API_URL}/analytics/customer-balances`);
    return response.data.customer_balances || [];
  } catch (error) {
    console.error("❌ Failed to get customer balances:", error.message);
    throw error;
  }
};

/**
 * Get all credits
 * @returns {Promise} Promise with credits
 */
export const getAllCredits = async () => {
  try {
    const response = await axios.get(`${DATABASE_API_URL}/credits`);
    return response.data.credits || [];
  } catch (error) {
    console.error("❌ Failed to get credits:", error.message);
    throw error;
  }
};

/**
 * Get unpaid credits
 * @returns {Promise} Promise with unpaid credits
 */
export const getUnpaidCredits = async () => {
  try {
    const response = await axios.get(`${DATABASE_API_URL}/credits/unpaid`);
    return response.data.unpaid || [];
  } catch (error) {
    console.error("❌ Failed to get unpaid credits:", error.message);
    throw error;
  }
};

/**
 * Get all items
 * @returns {Promise} Promise with items
 */
export const getAllItems = async () => {
  try {
    const response = await axios.get(`${DATABASE_API_URL}/items`);
    return response.data.items || [];
  } catch (error) {
    console.error("❌ Failed to get items:", error.message);
    throw error;
  }
};

/**
 * Send MCP query to backend
 * @param {string} query - Natural language query
 * @returns {Promise} Promise with the response
 */
export const sendMCPQuery = async (query) => {
  try {
    const response = await axios.post(`${DATABASE_API_URL}/mcp/query`, {
      query: query
    });
    return response.data;
  } catch (error) {
    console.error("❌ Failed to send MCP query:", error.message);
    throw error;
  }
};

/**
 * Send MCP audio query to FastAPI backend
 * @param {string} uri - URI of the audio file
 * @returns {Promise} Promise with the response
 */
export const sendMCPAudioQuery = async (uri) => {
  try {
    console.log(`Uploading audio query to ${BIZLEDGER_BACKEND_URL}/mcp/audio`);

    const uploadResult = await FileSystem.uploadAsync(
      `${BIZLEDGER_BACKEND_URL}/mcp/audio`,
      uri,
      {
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: "file",
        mimeType: "audio/x-m4a",
        parameters: {
          name: "query.m4a",
        },
      }
    );

    console.log("✅ MCP Audio query complete");
    const result = JSON.parse(uploadResult.body);
    return result;
  } catch (error) {
    console.error("❌ MCP Audio query failed:", error.message);
    throw error;
  }
};

/**
 * Get transaction history data for the history page
 * Uses the transactionsController.getAllTransactionsSummary function
 * @returns {Promise} Promise with the transaction history data
 */
export const getTransactionHistory = async () => {
  try {
    console.log(
      `Fetching transaction history from ${DATABASE_API_URL}/transactions/summary`
    );

    // Add timeout to avoid long waits
    const response = await axios.get(`${DATABASE_API_URL}/transactions/summary`, {
      timeout: 10000, // 10 seconds timeout
    });

    const historyData = response.data.transactions || [];

    console.log(`✅ Fetched ${historyData.length} transaction history entries`);

    if (historyData.length > 0) {
      console.log("Sample history entry:", historyData[0]);
    }

    return historyData;
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      console.error(
        "❌ Transaction history request timed out. The server might be down or too slow to respond."
      );
    } else if (error.message.includes("Network Error")) {
      console.error(
        "❌ Network error. Make sure the server is running and accessible at:",
        DATABASE_API_URL
      );
      console.error(
        "   Check that the IP address is correct and the server is running on port 3000"
      );
    } else {
      console.error("❌ Failed to get transaction history:", error.message);
    }

    // Return empty array instead of throwing to prevent app crashes
    return [];
  }
};

export default {
  testBackendConnection,
  uploadAudioForTranscription,
  getAllTransactions,
  getTransactionHistory,
  getTransactionSummary,
  getProfitLoss,
  getCashFlowTrend,
  getTopSpendingCategories,
  getTopIncomeCategories,
  getBiggestTransaction,
  getSpendingRatio,
  getCustomerBalances,
  getAllCredits,
  getUnpaidCredits,
  getAllItems,
  sendMCPQuery,
  sendMCPAudioQuery,
};


