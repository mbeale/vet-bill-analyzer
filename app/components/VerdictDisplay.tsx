'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LineItem {
  description: string;
  price: number;
  median_price?: number;
  status: 'green' | 'yellow' | 'red';
}

interface Verdict {
  clinic_name: string;
  total_amount: number;
  verdict_status: 'green' | 'yellow' | 'red';
  verdict_message: string;
  comparison_percentage: number;
  species: string;
  line_items: LineItem[];
  regional_median: number;
  z_score: number;
}

const statusConfig = {
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-800',
    title: 'Fair Price',
    icon: '✓',
  },
  yellow: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    badge: 'bg-yellow-100 text-yellow-800',
    title: 'Higher Than Average',
    icon: '!',
  },
  red: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-800',
    title: 'Potential Outlier',
    icon: '⚠',
  },
};

export default function VerdictDisplay({ verdict }: { verdict: Verdict }) {
  const config = statusConfig[verdict.verdict_status];
  const chartData = verdict.line_items.map((item) => ({
    name: item.description.substring(0, 20),
    price: item.price,
    median: item.median_price || 0,
  }));

  return (
    <div className="space-y-6">
      {/* Verdict Header */}
      <div
        className={`border-2 rounded-lg p-6 ${config.bg} ${config.border}`}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <span
              className={`inline-block ${config.badge} px-3 py-1 rounded-full text-sm font-semibold mb-2`}
            >
              {config.title}
            </span>
            <h2 className="text-2xl font-bold text-gray-900">
              {verdict.clinic_name}
            </h2>
          </div>
          <div
            className={`text-4xl font-bold ${
              verdict.verdict_status === 'green'
                ? 'text-green-600'
                : verdict.verdict_status === 'yellow'
                  ? 'text-yellow-600'
                  : 'text-red-600'
            }`}
          >
            {config.icon}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-gray-700">{verdict.verdict_message}</p>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-600">Your Total</p>
              <p className="text-xl font-bold text-gray-900">
                ${verdict.total_amount.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Regional Median</p>
              <p className="text-xl font-bold text-gray-900">
                ${verdict.regional_median.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Difference</p>
              <p
                className={`text-xl font-bold ${
                  verdict.comparison_percentage >= 0
                    ? 'text-red-600'
                    : 'text-green-600'
                }`}
              >
                {verdict.comparison_percentage >= 0 ? '+' : ''}
                {verdict.comparison_percentage.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Line Items Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Line Item Breakdown
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {verdict.line_items.map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${
                item.status === 'green'
                  ? 'bg-green-50 border-green-200'
                  : item.status === 'yellow'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900">
                    {item.description}
                  </p>
                  {item.median_price && (
                    <p className="text-sm text-gray-600">
                      Regional median: ${item.median_price.toFixed(2)}
                    </p>
                  )}
                </div>
                <p className="text-lg font-bold text-gray-900">
                  ${item.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price Comparison Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Price Comparison
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="price" fill="#8b5cf6" name="Your Price" />
              <Bar dataKey="median" fill="#10b981" name="Regional Median" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
