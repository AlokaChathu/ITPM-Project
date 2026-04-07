import React, { useState } from "react";
import { FileText, Download, Printer, TrendingUp } from "lucide-react";

const ReportsPage = () => {
  const [generating, setGenerating] = useState(false);
  const [reportType, setReportType] = useState("");

  const handleDownloadCSV = async (type) => {
    setGenerating(true);
    setReportType(type);
    
    // Mock CSV generation
    setTimeout(() => {
      const csvData = type === 'students' 
        ? "Name,Email,Role,Status,Registration Date\nJohn Doe,john@example.com,Student,Active,2024-01-15\nJane Smith,jane@example.com,Student,Active,2024-01-16"
        : "Company,Position,Status,Submitted Date,Tech Corp,Software Engineer,Approved,2024-01-15\nData Inc,Data Analyst,Pending,2024-01-16";
      
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_report_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      
      setGenerating(false);
      setReportType("");
    }, 1500);
  };

  const handlePrintPDF = () => {
    setGenerating(true);
    setReportType("pdf");
    
    // Mock PDF generation
    setTimeout(() => {
      const printContent = `
        <html>
          <head>
            <title>Admin Analitics Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #1f2937; }
              h2 { color: #4b5563; margin-top: 30px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
              th { background-color: #f9fafb; }
              .summary { background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <h1>University Internship Management System</h1>
            <h2>Admin Analitics Report</h2>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            
            <div class="summary">
              <h3>Summary Statistics</h3>
              <p>Total Users: 1,250</p>
              <p>Active Internships: 320</p>
              <p>Pending Approvals: 15</p>
              <p>System Health: Excellent</p>
            </div>
            
            <h2>Recent Users</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>John Doe</td>
                  <td>john@example.com</td>
                  <td>Student</td>
                  <td>Active</td>
                </tr>
                <tr>
                  <td>Jane Smith</td>
                  <td>jane@example.com</td>
                  <td>Lecturer</td>
                  <td>Active</td>
                </tr>
              </tbody>
            </table>
            
            <h2>Recent Internships</h2>
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Position</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Tech Corp</td>
                  <td>Software Engineer</td>
                  <td>Approved</td>
                </tr>
                <tr>
                  <td>Data Inc</td>
                  <td>Data Analyst</td>
                  <td>Pending</td>
                </tr>
              </tbody>
            </table>
          </body>
        </html>
      `;
      
      const printWindow = window.open('', '_blank');
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
      
      setGenerating(false);
      setReportType("");
    }, 1500);
  };

  const reportOptions = [
    {
      title: "Student Report",
      description: "Export all student data including registration details and status",
      icon: <FileText className="h-6 w-6 text-blue-600" />,
      type: "students",
      action: "csv"
    },
    {
      title: "Internship Report", 
      description: "Export all internship postings with company and status information",
      icon: <FileText className="h-6 w-6 text-green-600" />,
      type: "internships",
      action: "csv"
    },
    {
      title: "Combined Report",
      description: "Generate comprehensive PDF report with all system data",
      icon: <Printer className="h-6 w-6 text-purple-600" />,
      type: "combined",
      action: "pdf"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <TrendingUp className="h-4 w-4" />
          System Reports
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Reports</h3>
        <p className="text-gray-600 mb-6">
          Export system data in various formats for analysis and record-keeping. All reports include current data as of generation time.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportOptions.map((report, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 hover:border-indigo-300 transition-colors">
              <div className="flex items-center mb-4">
                {report.icon}
                <h4 className="ml-3 text-lg font-semibold text-gray-900">{report.title}</h4>
              </div>
              <p className="text-gray-600 text-sm mb-4">{report.description}</p>
              <button
                onClick={() => report.action === 'pdf' ? handlePrintPDF() : handleDownloadCSV(report.type)}
                disabled={generating}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating && reportType === report.type ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white border-t-transparent"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    {report.action === 'pdf' ? 'Generate PDF' : 'Download CSV'}
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Student Report</p>
              <p className="text-sm text-gray-600">Generated on January 15, 2024</p>
            </div>
            <span className="text-sm text-gray-500">CSV</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Internship Report</p>
              <p className="text-sm text-gray-600">Generated on January 14, 2024</p>
            </div>
            <span className="text-sm text-gray-500">CSV</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Combined Report</p>
              <p className="text-sm text-gray-600">Generated on January 13, 2024</p>
            </div>
            <span className="text-sm text-gray-500">PDF</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
