import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Activity,
  Layers,
  BarChart2,
  LineChart as LineChartIcon,
  Maximize2,
  Clock,
} from 'lucide-react';
import { translations, Language } from '../locales/translations';
import { CryptoCoin, User } from '../types';

interface Props {
  selectedCoin: CryptoCoin;
  onSelectCoin: (coin: CryptoCoin) => void;
  allCoins: CryptoCoin[];
  currentUser: User;
  language: Language;
}

interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  vol: number;
}

export const MarketScreen: React.FC<Props> = ({
  selectedCoin,
  onSelectCoin,
  allCoins,
  language,
}) => {
  const t = translations[language];

  const [timeframe, setTimeframe] = useState<string>('15Minute');
  const [chartType, setChartType] = useState<'candles' | 'line'>('candles');
  const [showCoinDropdown, setShowCoinDropdown] = useState<boolean>(false);
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);

  // High fidelity candle dataset
  const [candles, setCandles] = useState<Candle[]>([]);

  useEffect(() => {
    // Generate realistic, smooth candles based on current coin price and timeframe
    const base = selectedCoin.price;
    const list: Candle[] = [];
    const count = 30;
    let current = base * (1 + (Math.random() - 0.5) * 0.02);

    for (let i = 0; i < count; i++) {
      const volatility = base * 0.004;
      const delta = (Math.random() - 0.49) * volatility;
      const open = current;
      const close = Math.max(open * 0.95, open + delta);
      const high = Math.max(open, close) + Math.random() * (volatility * 0.7);
      const low = Math.min(open, close) - Math.random() * (volatility * 0.7);
      const vol = Math.floor(40 + Math.random() * 120);

      const d = new Date(Date.now() - (count - i) * 15 * 60 * 1000);
      const timeStr = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;

      list.push({ time: timeStr, open, high, low, close, vol });
      current = close;
    }

    // Ensure the last candle reflects the live coin price
    list[list.length - 1].close = selectedCoin.price;
    list[list.length - 1].high = Math.max(list[list.length - 1].high, selectedCoin.price);
    list[list.length - 1].low = Math.min(list[list.length - 1].low, selectedCoin.price);

    setCandles(list);
    setHoveredCandle(list[list.length - 1]);
  }, [selectedCoin.symbol, timeframe]);

  // Update latest candle smoothly whenever selectedCoin price fluctuates
  useEffect(() => {
    setCandles((prev) => {
      if (!prev.length) return prev;
      const copy = [...prev];
      const last = { ...copy[copy.length - 1] };
      last.close = selectedCoin.price;
      last.high = Math.max(last.high, selectedCoin.price);
      last.low = Math.min(last.low, selectedCoin.price);
      copy[copy.length - 1] = last;
      return copy;
    });
  }, [selectedCoin.price]);

  const isUp = selectedCoin.change24h >= 0;

  // Chart coordinate math
  const allPrices = candles.flatMap((c) => [c.high, c.low]);
  const minPrice = allPrices.length ? Math.min(...allPrices) : selectedCoin.price * 0.98;
  const maxPrice = allPrices.length ? Math.max(...allPrices) : selectedCoin.price * 1.02;
  const priceRange = maxPrice - minPrice || 1;

  // Moving Average MA7 and MA25 calculation
  const ma7Points: Array<{ x: number; y: number }> = [];
  const ma25Points: Array<{ x: number; y: number }> = [];

  const svgWidth = 340;
  const svgHeight = 200;
  const chartHeight = 150; // top 150px for candles, bottom 40px for volume

  candles.forEach((c, idx) => {
    const x = 12 + idx * (svgWidth / (candles.length || 1));

    // MA7
    if (idx >= 6) {
      const slice7 = candles.slice(idx - 6, idx + 1);
      const avg7 = slice7.reduce((s, it) => s + it.close, 0) / 7;
      const y7 = chartHeight - ((avg7 - minPrice) / priceRange) * chartHeight;
      ma7Points.push({ x, y: y7 });
    }

    // MA25
    if (idx >= 15) {
      const slice25 = candles.slice(idx - 14, idx + 1);
      const avg25 = slice25.reduce((s, it) => s + it.close, 0) / slice25.length;
      const y25 = chartHeight - ((avg25 - minPrice) / priceRange) * chartHeight;
      ma25Points.push({ x, y: y25 });
    }
  });

  const ma7Path = ma7Points.length
    ? ma7Points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '')
    : '';

  const ma25Path = ma25Points.length
    ? ma25Points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '')
    : '';

  // Area Path for line mode
  const linePoints = candles.map((c, idx) => {
    const x = 12 + idx * (svgWidth / (candles.length || 1));
    const y = chartHeight - ((c.close - minPrice) / priceRange) * chartHeight;
    return { x, y };
  });

  const areaPath = linePoints.length
    ? `${linePoints.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '')} L ${linePoints[linePoints.length - 1].x} ${chartHeight} L ${linePoints[0].x} ${chartHeight} Z`
    : '';

  const currentY = chartHeight - ((selectedCoin.price - minPrice) / priceRange) * chartHeight;

  const activeCandle = hoveredCandle || (candles.length ? candles[candles.length - 1] : null);

  return (
    <div className="pb-24 pt-3 px-3 max-w-md mx-auto space-y-3">
      {/* Top Header / Pair Selector */}
      <div className="flex items-center justify-between relative bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-md">
        <div className="relative">
          <button
            onClick={() => setShowCoinDropdown(!showCoinDropdown)}
            className="flex items-center gap-1.5 text-base font-extrabold text-white hover:text-blue-400 transition"
          >
            <span>{selectedCoin.pair}</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {showCoinDropdown && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 max-h-60 overflow-y-auto">
              {allCoins.map((coin) => (
                <button
                  key={coin.symbol}
                  onClick={() => {
                    onSelectCoin(coin);
                    setShowCoinDropdown(false);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-800 text-xs ${
                    selectedCoin.symbol === coin.symbol ? 'text-blue-400 font-bold bg-slate-800/60' : 'text-slate-300'
                  }`}
                >
                  <span>{coin.pair}</span>
                  <span className={coin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(1)}%
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="text-right">
          <div className="text-base font-extrabold font-mono text-white">
            ${selectedCoin.price > 10 ? selectedCoin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : selectedCoin.price.toFixed(5)}
          </div>
          <div className={`text-xs font-bold font-mono ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isUp ? '+' : ''}{selectedCoin.change24h.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* 24h Stats Grid matching Screen 3 */}
      <div className="grid grid-cols-4 gap-1.5 bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-[10px]">
        <div>
          <span className="text-slate-500 block truncate">{t.highest24h}</span>
          <span className="font-mono font-bold text-slate-200">
            {selectedCoin.high24h.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block truncate">{t.lowest24h}</span>
          <span className="font-mono font-bold text-slate-200">
            {selectedCoin.low24h.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block truncate">24H High(USDT)</span>
          <span className="font-mono font-bold text-slate-200">
            1,817.21
          </span>
        </div>
        <div>
          <span className="text-slate-500 block truncate">{t.volume24h}</span>
          <span className="font-mono font-bold text-slate-200 truncate block">
            {selectedCoin.volume24h}
          </span>
        </div>
      </div>

      {/* Timeframes Bar & Chart Style Switcher */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto py-1 scrollbar-none text-[11px] font-semibold">
        <div className="flex items-center gap-1">
          <span className="text-slate-500 px-1 text-[10px]">Time</span>
          {['1Min', '5Min', '15Min', '30Min', '1Hour', '4H', '1D'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2 py-1 rounded-lg transition whitespace-nowrap ${
                timeframe === tf
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Toggle between Candlestick and Area/Line */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
          <button
            onClick={() => setChartType('candles')}
            title="Candlestick Chart"
            className={`p-1 rounded ${chartType === 'candles' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setChartType('line')}
            title="Line Area Chart"
            className={`p-1 rounded ${chartType === 'line' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <LineChartIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* UPGRADED PROFESSIONAL GRAPH (ហ្រ្វាបកែសម្រួលដើរបានល្អ) */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 shadow-xl relative overflow-hidden">
        {/* HUD Data Ribbon (Shows Open, High, Low, Close, Vol on Hover) */}
        {activeCandle && (
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 pb-2 border-b border-slate-800/80 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">{activeCandle.time}</span>
              <span>O: <b className="text-slate-200">{activeCandle.open.toFixed(2)}</b></span>
              <span>H: <b className="text-emerald-400">{activeCandle.high.toFixed(2)}</b></span>
              <span>L: <b className="text-rose-400">{activeCandle.low.toFixed(2)}</b></span>
              <span>C: <b className={activeCandle.close >= activeCandle.open ? 'text-emerald-400' : 'text-rose-400'}>{activeCandle.close.toFixed(2)}</b></span>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <span className="text-amber-400 font-bold">MA7</span>
              <span className="text-purple-400 font-bold">MA25</span>
            </div>
          </div>
        )}

        {/* SVG Interactive Canvas */}
        <div className="h-64 w-full relative pt-2">
          <svg
            className="w-full h-full overflow-visible select-none"
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="none"
          >
            <defs>
              {/* Gradient for Area line mode */}
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Background Grid Horizontal Lines */}
            <line x1="0" y1="35" x2={svgWidth} y2="35" stroke="#1e293b" strokeDasharray="3 3" opacity="0.6" />
            <line x1="0" y1="75" x2={svgWidth} y2="75" stroke="#1e293b" strokeDasharray="3 3" opacity="0.6" />
            <line x1="0" y1="115" x2={svgWidth} y2="115" stroke="#1e293b" strokeDasharray="3 3" opacity="0.6" />
            <line x1="0" y1="150" x2={svgWidth} y2="150" stroke="#334155" strokeWidth="0.8" />

            {/* AREA CHART MODE */}
            {chartType === 'line' && (
              <>
                <path d={areaPath} fill="url(#areaGradient)" />
                <path
                  d={linePoints.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '')}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
              </>
            )}

            {/* CANDLESTICK MODE */}
            {chartType === 'candles' &&
              candles.map((candle, idx) => {
                const candleWidth = 6.5;
                const x = 8 + idx * (svgWidth / (candles.length || 1));
                const isGreen = candle.close >= candle.open;
                const strokeColor = isGreen ? '#10b981' : '#f43f5e';
                const fillColor = isGreen ? '#10b981' : '#f43f5e';

                const yHigh = chartHeight - ((candle.high - minPrice) / priceRange) * chartHeight;
                const yLow = chartHeight - ((candle.low - minPrice) / priceRange) * chartHeight;
                const yOpen = chartHeight - ((candle.open - minPrice) / priceRange) * chartHeight;
                const yClose = chartHeight - ((candle.close - minPrice) / priceRange) * chartHeight;

                const topBody = Math.min(yOpen, yClose);
                const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));

                // Volume Bar at bottom (height 35px max)
                const volHeight = (candle.vol / 160) * 35;

                return (
                  <g
                    key={idx}
                    className="cursor-pointer transition-opacity hover:opacity-80"
                    onMouseEnter={() => setHoveredCandle(candle)}
                  >
                    {/* Candle Wick */}
                    <line
                      x1={x + candleWidth / 2}
                      y1={yHigh}
                      x2={x + candleWidth / 2}
                      y2={yLow}
                      stroke={strokeColor}
                      strokeWidth="1.2"
                    />

                    {/* Candle Body */}
                    <rect
                      x={x}
                      y={topBody}
                      width={candleWidth}
                      height={bodyHeight}
                      fill={fillColor}
                      rx="1"
                    />

                    {/* Volume Bar */}
                    <rect
                      x={x}
                      y={svgHeight - volHeight - 5}
                      width={candleWidth}
                      height={volHeight}
                      fill={fillColor}
                      opacity="0.4"
                      rx="0.5"
                    />
                  </g>
                );
              })}

            {/* Moving Average MA7 Curve (Amber) */}
            {ma7Path && <path d={ma7Path} fill="none" stroke="#f59e0b" strokeWidth="1.2" opacity="0.85" />}

            {/* Moving Average MA25 Curve (Purple) */}
            {ma25Path && <path d={ma25Path} fill="none" stroke="#a855f7" strokeWidth="1.2" opacity="0.85" />}

            {/* Live Pulsing Price Reference Line */}
            <line
              x1="0"
              y1={currentY}
              x2={svgWidth}
              y2={currentY}
              stroke="#10b981"
              strokeDasharray="2 2"
              strokeWidth="1"
              opacity="0.8"
            />

            {/* Beacon Circle at Current Price */}
            <circle
              cx={svgWidth - 10}
              cy={currentY}
              r="3.5"
              fill="#10b981"
              className="animate-ping"
              opacity="0.75"
            />
            <circle cx={svgWidth - 10} cy={currentY} r="3" fill="#10b981" />
          </svg>

          {/* Right Y-Axis Dynamic Price Badges */}
          <div className="absolute right-1 top-2 bottom-12 flex flex-col justify-between text-[9px] font-mono text-slate-500 pointer-events-none text-right">
            <span className="text-emerald-400 font-bold">${maxPrice.toFixed(1)}</span>
            <span>${((maxPrice + minPrice) / 2).toFixed(1)}</span>
            <span className="text-rose-400 font-bold">${minPrice.toFixed(1)}</span>
          </div>

          {/* Live Price Tag at current line */}
          <div
            className="absolute right-0 bg-emerald-600 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-l shadow pointer-events-none transition-all duration-300"
            style={{ top: `${Math.max(5, Math.min(135, (currentY / chartHeight) * 135))}px` }}
          >
            {selectedCoin.price.toFixed(1)}
          </div>
        </div>

        {/* Live WebSocket status footer */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-400">Live Crypto Candlestick Engine</span>
          </div>
          <span className="font-mono text-slate-400">
            MA7: <b className="text-amber-400 font-normal">Active</b> • MA25: <b className="text-purple-400 font-normal">Active</b>
          </span>
        </div>
      </div>

      {/* Order Book & Depth Ladder (Informational for investor) */}
      <div className="grid grid-cols-2 gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-md">
        {/* Bids (Green) */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-400 font-bold pb-1 border-b border-slate-800">
            <span>{t.bids}</span>
            <span>Qty</span>
          </div>
          {[0.001, 0.003, 0.006, 0.009, 0.014].map((offset, i) => {
            const price = selectedCoin.price * (1 - offset);
            const qty = (0.4 + i * 0.35).toFixed(3);
            return (
              <div key={i} className="flex justify-between text-[10px] font-mono">
                <span className="text-emerald-400 font-bold">{price > 10 ? price.toFixed(2) : price.toFixed(5)}</span>
                <span className="text-slate-400">{qty}</span>
              </div>
            );
          })}
        </div>

        {/* Asks (Red) */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-400 font-bold pb-1 border-b border-slate-800">
            <span>{t.asks}</span>
            <span>Qty</span>
          </div>
          {[0.001, 0.003, 0.006, 0.009, 0.014].map((offset, i) => {
            const price = selectedCoin.price * (1 + offset);
            const qty = (0.35 + i * 0.28).toFixed(3);
            return (
              <div key={i} className="flex justify-between text-[10px] font-mono">
                <span className="text-rose-400 font-bold">{price > 10 ? price.toFixed(2) : price.toFixed(5)}</span>
                <span className="text-slate-400">{qty}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
