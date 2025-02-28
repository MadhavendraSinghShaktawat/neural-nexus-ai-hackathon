import React, { useState } from 'react';
import { RiskFactor } from '../../types/risk-analysis-types';

interface RiskFactorsTableProps {
  factors: RiskFactor[];
}

/**
 * Displays a table of risk factors with their impact and category
 */
const RiskFactorsTable: React.FC<RiskFactorsTableProps> = ({ factors }) => {
  const [sortField, setSortField] = useState<keyof RiskFactor>('impact');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof RiskFactor) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedFactors = [...factors].sort((a, b) => {
    if (sortField === 'impact') {
      const impactValues = { high: 3, medium: 2, low: 1 };
      const aValue = a.impact ? impactValues[a.impact as keyof typeof impactValues] || 0 : 0;
      const bValue = b.impact ? impactValues[b.impact as keyof typeof impactValues] || 0 : 0;
      
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    // Safely handle potentially undefined values
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getImpactBadgeColor = (impact: string | undefined): string => {
    if (!impact) return 'bg-gray-100 text-gray-800';
    
    switch (impact.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Contributing Risk Factors</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Factor
                  {sortField === 'name' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center">
                  Category
                  {sortField === 'category' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('impact')}
              >
                <div className="flex items-center">
                  Impact
                  {sortField === 'impact' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedFactors.map((factor, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {factor.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {factor.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getImpactBadgeColor(factor.impact)}`}>
                    {factor.impact || 'Unknown'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {factors.length === 0 && (
        <p className="text-gray-500 text-center py-4">No risk factors identified.</p>
      )}
    </div>
  );
};

export default RiskFactorsTable; 