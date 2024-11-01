
import React, { useContext } from 'react';
import { TradeContext } from '../context/TradeContext';
import { calculatePnL } from '../utils/calculatePNL';

const TradeComponent: React.FC = () => {
  const { trades } = useContext(TradeContext);
  const pnl = calculatePnL(trades);

  return (
    <div>
      <h2>Profit and Loss</h2>
      <p>Total PNL: {pnl}</p>
      {/* Additional PNL details can be added here */}
    </div>
  );
};

export default TradeComponent;
