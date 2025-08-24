

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search, Filter, Download, Eye, Edit, Trash2, Plus, RefreshCw,
  TrendingUp, TrendingDown, Users, DollarSign, Upload, FileText, CheckCircle,
  Send
} from 'lucide-react';
import CustomToast from '../Components/CustomToast';
import axios from 'axios';

// Define types
interface CustomerRecord {
  id: number;
  name: string;
  email: string;
  phoneno: string;
  debt: number;
  sentiment?: string;
  response?: string;
  send_status?: boolean;
  chat_id?: string;
}

type SortField = keyof CustomerRecord;
type SentimentFilter = 'all' | 'positive' | 'negative' | 'neutral';

const Dashboard = () => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [records, setRecords] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSentiment, setFilterSentiment] = useState<SentimentFilter>('all');
  const [sortField, setSortField] = useState<SortField | ''>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const [showToast, setShowToast] = useState(false);
  const [toastConfig, setToastConfig] = useState<{ success: boolean; message: string }>({
    success: true,
    message: "",
  });

  const recordsPerPage = 10;
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const getAllRecords = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(`${baseUrl}/api/document/get_records`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setRecords(response.data.data);
        console.log(response.data.data)
        setShowDashboard(true);
      }
    } catch (error: any) {
      console.error("Error fetching records:", error);
      // Optionally show toast
      setToastConfig({ success: false, message: error?.response?.data?.message || "Failed to fetch records" });
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getAllRecords();
  }, []);

  const processFileUpload = async (file: File) => {
    if (file.type !== "text/csv") return;

    setUploadedFileName(file.name);
    setFileUploaded(true);

    const text = await file.text();
    const lines = text.split("\n");
    const headers = lines[0].split(",");
    const rows = lines
      .slice(1)
      .filter((line) => line.trim())
      .map((line) => {
        const values = line.split(",");
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header.trim()] = values[index]?.trim();
        });
        return obj;
      });

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User is not authenticated. Please login.");
        return;
      }

      const response = await axios.post(
        `${baseUrl}/api/document/upload_file`,
        { rows },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Axios automatically parses JSON and throws error if status >= 400
      if (response.data.success) {
        setToastConfig({ success: true, message: response.data.message });
        setShowToast(true);
        await getAllRecords();
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      setToastConfig({
        success: false,
        message: error.response?.data?.message || "Upload failed",
      });
      setShowToast(true);
    }
  };


  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFileUpload(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) await processFileUpload(files[0]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  /** 🔹 Initial fetch */

  /** 🔹 Search + Filter + Sort */
  const filteredData = useMemo(() => {
    let filtered = records.filter(record => {
      const matchesSearch =
        record.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.phoneno?.includes(searchTerm);

      const matchesSentiment =
        filterSentiment === 'all' || record.sentiment === filterSentiment;

      return matchesSearch && matchesSentiment;
    });

    if (sortField) {
      filtered.sort((a, b) => {
        let aValue: any = a[sortField];
        let bValue: any = b[sortField];

        if (sortField === 'debt') {
          aValue = parseFloat(aValue?.toString() || '0');
          bValue = parseFloat(bValue?.toString() || '0');
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [records, searchTerm, filterSentiment, sortField, sortDirection]);

  /** 🔹 Pagination */
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + recordsPerPage);

  /** 🔹 Stats */
  const totalDebt = records.reduce((sum, record) => sum + (parseFloat(record.debt?.toString() || '0')), 0);
  const positiveCount = records.filter(record => record.sentiment === 'positive').length;
  const negativeCount = records.filter(record => record.sentiment === 'negative').length;

  /** 🔹 Helpers */
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSentimentBadge = (sentiment?: string) => {
    const styles: Record<string, string> = {
      positive: 'bg-green-100 text-green-800 border border-green-200',
      negative: 'bg-red-100 text-red-800 border border-red-200',
      neutral: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    };
    return styles[sentiment || 'neutral'];
  };

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(isNaN(numAmount) ? 0 : numAmount);
  };

  const handleSendMessage = async (recordId: number) => {
    try {
      if (!recordId) {
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User is not authenticated. Please login.");
        return;
      }
      const response = await axios.post(
        `${baseUrl}/api/message/send_message`,
        { recordId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      console.log(response)
      if (response.data.success) {
        setToastConfig({ success: true, message: response.data.message });
        setShowToast(true);
      }
    } catch (error: any) {
      console.log(error)
      setToastConfig({ success: false, message: error?.response?.data?.message });
      setShowToast(true)
    }

  }

  // File Upload Component
  if (!fileUploaded && !showDashboard) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Customer Records Dashboard</h1>
              <p className="text-gray-600 mt-2">Upload your CSV file to get started</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload CSV File</h3>
                <p className="text-gray-600 mb-6">Drag and drop your CSV file here, or click to browse</p>

                <label className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium cursor-pointer transition-colors">
                  <FileText className="w-4 h-4 mr-2" />
                  Choose File
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <p className="text-sm text-gray-500 mt-4">
                  Supported format: CSV files only
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success Message Component
  if (fileUploaded && !showDashboard) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        {showToast && (
          <CustomToast
            success={toastConfig.success}
            message={toastConfig.message}
            onClose={() => setShowToast(false)}
          />
        )}

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Successful!</h3>
              <p className="text-gray-600 mb-2">Your CSV file "{uploadedFileName}" has been processed successfully.</p>
              <p className="text-lg font-medium text-blue-600 mb-6">Please visit the dashboard for more information</p>

              <button
                onClick={() => setShowDashboard(true)}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Component (original dashboard code)
  return (
    <div className="min-h-screen bg-gray-50">
      {showToast && (
        <CustomToast
          success={toastConfig.success}
          message={toastConfig.message}
          onClose={() => setShowToast(false)}
        />
      )}
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Customer Records Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage and analyze customer debt records</p>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Record</span>
              </button>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium flex items-center space-x-2">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Records</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{records.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Debt</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(totalDebt)}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Positive Sentiment</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{positiveCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Negative Sentiment</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{negativeCount}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="md:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterSentiment}
                  onChange={(e) => setFilterSentiment(e.target.value as SentimentFilter)}
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Sentiments</option>
                  <option value="positive">Positive</option>
                  <option value="neutral">Neutral</option>
                  <option value="negative">Negative</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phone</th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('debt')}
                  >
                    Debt Amount {sortField === 'debt' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('sentiment')}
                  >
                    Sentiment {sortField === 'sentiment' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Response</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Send</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedData.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{record.name}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{record.email}</td>
                    <td className="px-6 py-4 text-gray-600">{record.phoneno}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">{formatCurrency(record.debt)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getSentimentBadge(record.sentiment)}`}>
                        {record.sentiment}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs truncate text-gray-600" title={record.response}>
                        {record.response}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => { handleSendMessage(record.id) }}
                        disabled={!record.chat_id}
                        className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 
      ${record.chat_id
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(startIndex + recordsPerPage, filteredData.length)} of {filteredData.length} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${page === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;