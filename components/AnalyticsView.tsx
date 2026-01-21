
import React from 'react';
import { ModelResult } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const AnalyticsView: React.FC<{ results: ModelResult[] }> = ({ results }) => {
  const radarData = [
    { subject: 'Clarity', ...Object.fromEntries(results.map(r => [r.modelId, r.metrics.clarity])) },
    { subject: 'Creativity', ...Object.fromEntries(results.map(r => [r.modelId, r.metrics.creativity])) },
    { subject: 'Conciseness', ...Object.fromEntries(results.map(r => [r.modelId, r.metrics.conciseness])) },
    { subject: 'Professionalism', ...Object.fromEntries(results.map(r => [r.modelId, r.metrics.professionalism])) },
  ];

  const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];

  const barData = results.map(r => ({
    name: r.modelId,
    Score: (r.metrics.clarity + r.metrics.creativity + r.metrics.conciseness + r.metrics.professionalism) / 4
  }));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Radar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-[450px]">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Metric Comparison</h3>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 1]} />
              {results.map((r, i) => (
                <Radar
                  key={r.modelId}
                  name={r.modelId}
                  dataKey={r.modelId}
                  stroke={colors[i % colors.length]}
                  fill={colors[i % colors.length]}
                  fillOpacity={0.2}
                />
              ))}
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart Overall */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-[450px]">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Overall Strength Score</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 1]} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} />
              <Bar 
                dataKey="Score" 
                fill="#6366f1" 
                radius={[4, 4, 0, 0]} 
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Raw Comparison Table</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase">
              <th className="py-3 px-4">Model</th>
              <th className="py-3 px-4 text-center">Clarity</th>
              <th className="py-3 px-4 text-center">Creativity</th>
              <th className="py-3 px-4 text-center">Conciseness</th>
              <th className="py-3 px-4 text-center">Professionalism</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {results.map((r) => (
              <tr key={r.modelId} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-700">{r.modelId}</td>
                <td className="py-3 px-4 text-center">{(r.metrics.clarity * 100).toFixed(0)}%</td>
                <td className="py-3 px-4 text-center">{(r.metrics.creativity * 100).toFixed(0)}%</td>
                <td className="py-3 px-4 text-center">{(r.metrics.conciseness * 100).toFixed(0)}%</td>
                <td className="py-3 px-4 text-center">{(r.metrics.professionalism * 100).toFixed(0)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalyticsView;
