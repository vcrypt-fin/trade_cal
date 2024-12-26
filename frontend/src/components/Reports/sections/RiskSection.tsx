import React from 'react';
import { useTrades } from '../../../context/TradeContext';
import StatWidget from '../../../components/widgets/StatWidget';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  ReferenceLine
} from 'recharts';

interface RiskStats {
  forecastedRRDistribution: { rr: number; frequency: number }[];
  actualRRDistribution: { rr: number; frequency: number }[];
  averageForcastedRR: number;
  averageActualRR: number;
  totalTrades: number;
  tradesWithRR: number;
  perfectExecutions: number;
  perfectExecutionRate: number;
  maxRR: number;
}

const RiskSection: React.FC<{ view: string }> = ({ view }) => {
  const { trades } = useTrades();

  const stats = React.useMemo(() => {
    // Get trades with RR data
    const tradesWithRR = trades.filter(trade => trade.forecasted_rr && trade.actual_rr);
    
    // Calculate average RRs
    const avgForecasted = tradesWithRR.length > 0 
      ? tradesWithRR.reduce((sum, trade) => sum + (trade.forecasted_rr || 0), 0) / tradesWithRR.length 
      : 0;
    const avgActual = tradesWithRR.length > 0 
      ? tradesWithRR.reduce((sum, trade) => sum + (trade.actual_rr || 0), 0) / tradesWithRR.length 
      : 0;
    
    // Count perfect executions (where forecasted_rr equals actual_rr)
    const perfectExecutions = tradesWithRR.filter(trade => 
      trade.forecasted_rr && trade.actual_rr && 
      Math.abs(trade.forecasted_rr - trade.actual_rr) < 0.01 // Using small threshold for float comparison
    ).length;

    // Find max RR to determine chart range
    const maxForecasted = Math.max(...tradesWithRR.map(t => t.forecasted_rr || 0));
    const maxActual = Math.max(...tradesWithRR.map(t => t.actual_rr || 0));
    const maxRR = Math.max(10, Math.ceil(Math.max(maxForecasted, maxActual)));

    // Create distribution data with fixed bins from 0 to maxRR
    const createDistribution = (getRR: (t: any) => number) => {
      const bins = Array.from({ length: maxRR + 1 }, (_, i) => ({
        rr: i,
        frequency: 0
      }));

      tradesWithRR.forEach(trade => {
        const rr = getRR(trade);
        if (rr !== null && rr !== undefined) {
          const binIndex = Math.min(Math.floor(rr), maxRR);
          bins[binIndex].frequency++;
        }
      });

      // Normalize frequencies to 0-1 scale
      const maxFrequency = Math.max(...bins.map(b => b.frequency));
      if (maxFrequency > 0) {
        bins.forEach(bin => {
          bin.frequency = bin.frequency / maxFrequency;
        });
      }

      return bins;
    };

    const forecastedRRDistribution = createDistribution(t => t.forecasted_rr);
    const actualRRDistribution = createDistribution(t => t.actual_rr);

    return {
      forecastedRRDistribution,
      actualRRDistribution,
      averageForcastedRR: avgForecasted,
      averageActualRR: avgActual,
      totalTrades: trades.length,
      tradesWithRR: tradesWithRR.length,
      perfectExecutions,
      perfectExecutionRate: perfectExecutions / (tradesWithRR.length || 1) * 100,
      maxRR
    };
  }, [trades]);

  const renderMetricsGrid = (isRiskView = false) => {
    if (isRiskView) {
      // Find most common RR values
      const getMostCommonRR = (distribution: { rr: number; frequency: number }[]) => {
        const maxFreq = Math.max(...distribution.map(d => d.frequency));
        return distribution.find(d => d.frequency === maxFreq)?.rr || 0;
      };

      const mostCommonForecasted = getMostCommonRR(stats.forecastedRRDistribution);
      const mostCommonActual = getMostCommonRR(stats.actualRRDistribution);

      return (
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
            <h4 className="text-sm text-purple-200 mb-2">Most Common Forecasted RR</h4>
            <p className="text-2xl font-semibold text-purple-100">
              {mostCommonForecasted.toFixed(1)}
            </p>
            <p className="text-sm text-purple-300">
              ({(stats.forecastedRRDistribution.find(d => d.rr === mostCommonForecasted)?.frequency ?? 0 * 100).toFixed(1)}% of trades)
            </p>
          </div>
          
          <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
            <h4 className="text-sm text-purple-200 mb-2">Most Common Actual RR</h4>
            <p className="text-2xl font-semibold text-purple-100">
              {mostCommonActual.toFixed(1)}
            </p>
            <p className="text-sm text-purple-300">
              ({(stats.actualRRDistribution.find(d => d.rr === mostCommonActual)?.frequency ?? 0 * 100).toFixed(1)}% of trades)
            </p>
          </div>

          <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
            <h4 className="text-sm text-purple-200 mb-2">Trades with Forecasted RR</h4>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-semibold text-purple-100">
                {stats.tradesWithRR}
              </p>
              <p className="text-sm text-purple-300">
                ({((stats.tradesWithRR / stats.totalTrades) * 100).toFixed(1)}%)
              </p>
            </div>
          </div>

          <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
            <h4 className="text-sm text-purple-200 mb-2">Perfect Executions</h4>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-semibold text-purple-100">{stats.perfectExecutions}</p>
              <p className="text-sm text-purple-300">
                ({stats.perfectExecutionRate.toFixed(1)}%)
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
          <h4 className="text-sm text-purple-200 mb-2">Average Forecasted RR</h4>
          <p className="text-2xl font-semibold text-purple-100">
            {Number.isFinite(stats.averageForcastedRR) ? stats.averageForcastedRR.toFixed(2) : '0.00'}
          </p>
        </div>
        
        <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
          <h4 className="text-sm text-purple-200 mb-2">Average Actual RR</h4>
          <p className="text-2xl font-semibold text-purple-100">
            {Number.isFinite(stats.averageActualRR) ? stats.averageActualRR.toFixed(2) : '0.00'}
          </p>
        </div>

        <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
          <h4 className="text-sm text-purple-200 mb-2">Perfect Executions</h4>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-semibold text-purple-100">{stats.perfectExecutions}</p>
            <p className="text-sm text-purple-300">
              ({Number.isFinite(stats.perfectExecutionRate) ? stats.perfectExecutionRate.toFixed(1) : '0.0'}%)
            </p>
          </div>
        </div>

        <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
          <h4 className="text-sm text-purple-200 mb-2">Trades with RR</h4>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-semibold text-purple-100">{stats.tradesWithRR}</p>
            <p className="text-sm text-purple-300">
              ({Number.isFinite((stats.tradesWithRR / stats.totalTrades) * 100) ? ((stats.tradesWithRR / stats.totalTrades) * 100).toFixed(1) : '0.0'}%)
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (view) {
      case 'forecastedRR':
        return (
          <div className="space-y-6">
            {renderMetricsGrid()}
            <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-purple-100 mb-4">Forecasted Risk/Reward Distribution</h3>
              <div className="h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={stats.forecastedRRDistribution}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A1A4A" />
                    <XAxis 
                      dataKey="rr" 
                      stroke="#A78BFA"
                      label={{ value: 'Risk/Reward Ratio', position: 'bottom', fill: '#A78BFA', offset: -10 }}
                      domain={[0, stats.maxRR]}
                      ticks={Array.from({ length: stats.maxRR + 1 }, (_, i) => i)}
                      type="number"
                      padding={{ left: 20, right: 20 }}
                    />
                    <YAxis 
                      stroke="#A78BFA"
                      label={{ 
                        value: 'Number of Trades', 
                        angle: -90, 
                        position: 'left', 
                        fill: '#A78BFA',
                        offset: 0
                      }}
                      domain={[0, 1]}
                      ticks={[0, 0.25, 0.5, 0.75, 1]}
                      tickFormatter={(value) => value.toFixed(2)}
                      padding={{ top: 20 }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#120322',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: '0.5rem',
                        color: '#E9D5FF'
                      }}
                      formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Trades']}
                    />
                    <Bar 
                      dataKey="frequency" 
                      fill="#4CAF50" 
                      name="Trades"
                      maxBarSize={60}
                    />
                    <ReferenceLine
                      x={Math.floor(stats.averageForcastedRR)}
                      stroke="#FF4081"
                      strokeWidth={2}
                      label={{
                        value: `Avg: ${stats.averageForcastedRR.toFixed(2)}`,
                        fill: '#FF4081',
                        position: 'top'
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case 'actualRR':
        return (
          <div className="space-y-6">
            {renderMetricsGrid()}
            <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-purple-100 mb-4">Actual Risk/Reward Distribution</h3>
              <div className="h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={stats.actualRRDistribution}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A1A4A" />
                    <XAxis 
                      dataKey="rr" 
                      stroke="#A78BFA"
                      label={{ value: 'Risk/Reward Ratio', position: 'bottom', fill: '#A78BFA', offset: -10 }}
                      domain={[0, stats.maxRR]}
                      ticks={Array.from({ length: stats.maxRR + 1 }, (_, i) => i)}
                      type="number"
                      padding={{ left: 20, right: 20 }}
                    />
                    <YAxis 
                      stroke="#A78BFA"
                      label={{ 
                        value: 'Number of Trades', 
                        angle: -90, 
                        position: 'left', 
                        fill: '#A78BFA',
                        offset: 0
                      }}
                      domain={[0, 1]}
                      ticks={[0, 0.25, 0.5, 0.75, 1]}
                      tickFormatter={(value) => value.toFixed(2)}
                      padding={{ top: 20 }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#120322',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: '0.5rem',
                        color: '#E9D5FF'
                      }}
                      formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Trades']}
                    />
                    <Bar 
                      dataKey="frequency" 
                      fill="#4CAF50" 
                      name="Trades"
                      maxBarSize={60}
                    />
                    <ReferenceLine
                      x={Math.floor(stats.averageActualRR)}
                      stroke="#FF4081"
                      strokeWidth={2}
                      label={{
                        value: `Avg: ${stats.averageActualRR.toFixed(2)}`,
                        fill: '#FF4081',
                        position: 'top'
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case 'risk':
        // For the comparison view, we need to normalize across both distributions
        const maxFrequency = Math.max(
          ...stats.forecastedRRDistribution.map(d => d.frequency),
          ...stats.actualRRDistribution.map(d => d.frequency)
        );

        const combinedData = stats.forecastedRRDistribution.map((item, index) => ({
          rr: item.rr,
          forecasted: item.frequency,
          actual: stats.actualRRDistribution[index].frequency
        }));

        return (
          <div className="space-y-6">
            {renderMetricsGrid(true)}
            <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-purple-100 mb-4">Risk/Reward Comparison</h3>
              <div className="h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={combinedData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A1A4A" />
                    <XAxis 
                      dataKey="rr" 
                      stroke="#A78BFA"
                      label={{ value: 'Risk/Reward Ratio', position: 'bottom', fill: '#A78BFA', offset: -10 }}
                      domain={[0, stats.maxRR]}
                      ticks={Array.from({ length: stats.maxRR + 1 }, (_, i) => i)}
                      type="number"
                      padding={{ left: 20, right: 20 }}
                    />
                    <YAxis 
                      stroke="#A78BFA"
                      label={{ 
                        value: 'Number of Trades', 
                        angle: -90, 
                        position: 'left', 
                        fill: '#A78BFA',
                        offset: 0
                      }}
                      domain={[0, 1]}
                      ticks={[0, 0.25, 0.5, 0.75, 1]}
                      tickFormatter={(value) => value.toFixed(2)}
                      padding={{ top: 20 }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#120322',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: '0.5rem',
                        color: '#E9D5FF'
                      }}
                      formatter={(value: number, name: string) => [`${(value * 100).toFixed(1)}%`, name]}
                    />
                    <Legend />
                    <Bar 
                      dataKey="forecasted" 
                      fill="#4CAF50" 
                      name="Forecasted RR"
                      maxBarSize={60}
                    />
                    <Bar 
                      dataKey="actual" 
                      fill="#FF4081" 
                      name="Actual RR"
                      maxBarSize={60}
                    />
                    <ReferenceLine
                      x={Math.floor(stats.averageForcastedRR)}
                      stroke="#4CAF50"
                      strokeWidth={2}
                      label={{
                        value: `Forecasted Avg: ${stats.averageForcastedRR.toFixed(2)}`,
                        fill: '#4CAF50',
                        position: 'top'
                      }}
                    />
                    <ReferenceLine
                      x={Math.floor(stats.averageActualRR)}
                      stroke="#FF4081"
                      strokeWidth={2}
                      label={{
                        value: `Actual Avg: ${stats.averageActualRR.toFixed(2)}`,
                        fill: '#FF4081',
                        position: 'insideTopLeft'
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {renderContent()}
    </div>
  );
};

export const calculateAverageActualRR = (trades: any[]) => {
  const tradesWithRR = trades.filter(trade => trade.actual_rr);
  if (!tradesWithRR.length) return 0;
  
  const avgActual = tradesWithRR.reduce((sum, trade) => sum + (trade.actual_rr || 0), 0) / tradesWithRR.length;
  return avgActual;
};

export default RiskSection;