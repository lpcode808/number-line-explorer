import React from 'react';
import './App.css';
import './index.css';

const NumberLineExplorer = () => {
  const [activeMode, setActiveMode] = React.useState('ruler');
  const [value, setValue] = React.useState(2.0);
  const [moneyValue, setMoneyValue] = React.useState(0.50);
  const [increment, setIncrement] = React.useState(0.125);
  const [unitSystem, setUnitSystem] = React.useState('imperial');
  const [metricDisplay, setMetricDisplay] = React.useState('mm');
  const [coinIncrement, setCoinIncrement] = React.useState(0.25);

  const formatValue = () => {
    if (unitSystem === 'decimal') {
      return value.toFixed(2);
    }

    if (unitSystem === 'metric') {
      return metricDisplay === 'mm' ? 
        `${(value * 10).toFixed(0)} mm` : 
        `${value.toFixed(1)} cm`;
    }
    
    const whole = Math.floor(value);
    const fraction = value - whole;
    
    if (fraction === 0) return `${whole}"`;
    
    const fractions = {
      0.125: "⅛",
      0.25: "¼",
      0.375: "⅜",
      0.5: "½",
      0.625: "⅝",
      0.75: "¾",
      0.875: "⅞"
    };
    
    const nearestFraction = Object.entries(fractions).reduce((a, b) => {
      return Math.abs(fraction - parseFloat(a[0])) < Math.abs(fraction - parseFloat(b[0])) ? a : b;
    });
    
    return whole === 0 ? nearestFraction[1] + '"' : `${whole} ${nearestFraction[1]}"`;
  };

  const renderMarks = () => {
    if (activeMode === 'money') {
      const marks = [];
      for (let i = 0; i <= 20; i++) {
        const isQuarter = i % 5 === 0;
        const isDime = i % 2 === 0;
        const value = i * 0.05;
        
        marks.push(
          <div 
            key={i}
            className="absolute bottom-0"
            style={{ left: `${i * 5}%` }}
          >
            <div className={`border-l ${isQuarter ? 'border-l-2 h-12' : isDime ? 'border-l h-10' : 'border-l h-8'} border-black`} />
            {isQuarter && (
              <div className="mt-2 text-sm text-center" style={{ width: '40px', marginLeft: '-20px' }}>
                ${value.toFixed(2)}
              </div>
            )}
          </div>
        );
      }
      return marks;
    }

    if (unitSystem === 'decimal') {
      const marks = [];
      for (let i = 0; i <= 20; i++) {
        const isTenth = i % 2 === 0;
        const position = i / 20;
        marks.push(
          <div 
            key={i}
            className="absolute bottom-0"
            style={{ left: `${position * 100}%` }}
          >
            <div className={`border-l ${isTenth ? 'border-l-2 h-12' : 'border-l h-8'} border-black`} />
            {isTenth && (
              <div className="mt-2 text-sm text-center" style={{ width: '32px', marginLeft: '-16px' }}>
                {position.toFixed(1)}
              </div>
            )}
          </div>
        );
      }
      return marks;
    }

    if (unitSystem === 'metric') {
      const marks = [];
      for (let i = 0; i <= 40; i++) {
        const isCentimeter = i % 10 === 0;
        const isHalfCentimeter = i % 5 === 0;
        const height = isCentimeter ? 'h-12' : isHalfCentimeter ? 'h-10' : 'h-6';
        marks.push(
          <div 
            key={i}
            className="absolute bottom-0"
            style={{ left: `${(i * (100/40))}%` }}
          >
            <div className={`border-l ${isCentimeter ? 'border-l-2' : 'border-l-1'} border-black ${height}`} />
            {isCentimeter && (
              <div className="mt-2 text-sm text-center" style={{ width: '24px', marginLeft: '-12px' }}>
                {metricDisplay === 'mm' ? i : i/10}
              </div>
            )}
          </div>
        );
      }
      return marks;
    }

    const marks = [];
    for (let i = 0; i <= 4 * 8; i++) {
      const isWhole = i % 8 === 0;
      const isHalf = i % 4 === 0;
      const isQuarter = i % 2 === 0;
      const height = isWhole ? 'h-12' : isHalf ? 'h-10' : isQuarter ? 'h-8' : 'h-6';
      marks.push(
        <div 
          key={i}
          className="absolute bottom-0"
          style={{ left: `${(i * (100/(4*8)))}%` }}
        >
          <div className={`border-l ${isWhole ? 'border-l-2' : 'border-l-1'} border-black ${height}`} />
          {isWhole && (
            <div className="mt-2 text-sm text-center" style={{ width: '20px', marginLeft: '-10px' }}>
              {i/8}"
            </div>
          )}
        </div>
      );
    }
    return marks;
  };

  const adjustValue = (increase) => {
    if (activeMode === 'money') {
      const newValue = Math.max(0, Math.min(1, moneyValue + (increase ? coinIncrement : -coinIncrement)));
      setMoneyValue(Number(newValue.toFixed(2)));
      return;
    }

    let maxValue = 4;
    if (unitSystem === 'decimal') {
      maxValue = 1;
    }

    const newValue = Math.max(0, Math.min(maxValue, value + (increase ? increment : -increment)));
    setValue(Number(newValue.toFixed(3)));
  };

  const IncrementToggle = () => {
    if (activeMode === 'money') {
      return (
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: 0.25, label: "Quarter (25¢)" },
            { value: 0.10, label: "Dime (10¢)" },
            { value: 0.05, label: "Nickel (5¢)" }
          ].map((coin) => (
            <button
              key={coin.value}
              className={`px-4 py-2 rounded ${coinIncrement === coin.value ? 
                'bg-green-600 text-white' : 'bg-green-100 hover:bg-green-200'}`}
              onClick={() => setCoinIncrement(coin.value)}
            >
              {coin.label}
            </button>
          ))}
        </div>
      );
    }

    if (unitSystem === 'decimal') {
      return (
        <div className="grid grid-cols-2 gap-4">
          <button
            className={`px-4 py-2 rounded ${increment === 0.1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setIncrement(0.1)}
          >
            0.10
          </button>
          <button
            className={`px-4 py-2 rounded ${increment === 0.05 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setIncrement(0.05)}
          >
            0.05
          </button>
        </div>
      );
    }

    if (unitSystem === 'metric') {
      return (
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 0.1, label: metricDisplay === 'mm' ? "1mm" : "0.1cm" },
            { value: 0.5, label: metricDisplay === 'mm' ? "5mm" : "0.5cm" },
            { value: 1.0, label: metricDisplay === 'mm' ? "10mm" : "1.0cm" }
          ].map((inc) => (
            <button
              key={inc.value}
              className={`px-3 py-1 rounded ${increment === inc.value ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setIncrement(inc.value)}
            >
              {inc.label}
            </button>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-4 gap-2">
        {[
          { value: 1, label: "1\"" },
          { value: 0.5, label: "½\"" },
          { value: 0.25, label: "¼\"" },
          { value: 0.125, label: "⅛\"" }
        ].map((inc) => (
          <button
            key={inc.value}
            className={`px-3 py-1 rounded ${increment === inc.value ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setIncrement(inc.value)}
          >
            {inc.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg">
      <div className="space-y-6">
        <div className="flex gap-4 mb-6">
          <button 
            className={`px-4 py-2 rounded flex items-center gap-2 ${activeMode === 'ruler' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => {
              setActiveMode('ruler');
              setValue(2.0);
              setIncrement(0.125);
            }}
          >
            R Ruler Mode
          </button>
          <button 
            className={`px-4 py-2 rounded flex items-center gap-2 ${activeMode === 'money' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
            onClick={() => {
              setActiveMode('money');
              setMoneyValue(0.50);
              setCoinIncrement(0.25);
            }}
          >
            $ Money Mode
          </button>
        </div>

        {activeMode === 'ruler' && (
          <div className="flex justify-center gap-4">
            <button
              className={`px-4 py-2 rounded ${unitSystem === 'imperial' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => {
                setUnitSystem('imperial');
                setValue(2.0);
                setIncrement(0.125);
              }}
            >
              Inches
            </button>
            <button
              className={`px-4 py-2 rounded ${unitSystem === 'metric' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => {
                setUnitSystem('metric');
                setValue(2.0);
                setIncrement(0.1);
              }}
            >
              Metric
            </button>
            <button
              className={`px-4 py-2 rounded ${unitSystem === 'decimal' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => {
                setUnitSystem('decimal');
                setValue(0.5);
                setIncrement(0.1);
              }}
            >
              Decimals
            </button>
            {unitSystem === 'metric' && (
              <button
                className="px-4 py-2 rounded bg-gray-100"
                onClick={() => setMetricDisplay(prev => prev === 'mm' ? 'cm' : 'mm')}
              >
                Show in {metricDisplay === 'mm' ? 'cm' : 'mm'}
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col items-center space-y-2">
          <div className="text-sm font-medium">Move by:</div>
          <IncrementToggle />
        </div>

        <div className="flex justify-center items-center gap-4">
          <button 
            className={`p-2 rounded ${activeMode === 'money' ? 'bg-green-100 hover:bg-green-200' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => adjustValue(false)}
          >
            {"<"}
          </button>
          <div className={`text-3xl font-bold min-w-[120px] text-center ${activeMode === 'money' ? 'text-green-600' : 'text-blue-600'}`}>
            {activeMode === 'money' ? `$${moneyValue.toFixed(2)}` : formatValue()}
          </div>
          <button 
            className={`p-2 rounded ${activeMode === 'money' ? 'bg-green-100 hover:bg-green-200' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => adjustValue(true)}
          >
            {">"}
          </button>
        </div>

        <div className="relative h-32 border-b-2 border-black">
          {renderMarks()}
          <div 
            className={`absolute bottom-0 w-1 h-24 ${activeMode === 'money' ? 'bg-green-600' : 'bg-red-500'}`}
            style={{ 
              left: `${activeMode === 'ruler' ? 
                (unitSystem === 'decimal' ? value * 100 : value * (100/4)) : 
                (moneyValue * 100)}%`,
              transition: 'left 0.3s ease-in-out'
            }}
          />
        </div>

        <div className="text-center text-lg mt-4">
          <p>Use left and right arrows to change the value</p>
          {activeMode === 'money' && (
            <div className="mt-4 text-sm text-gray-600">
              <div>Quarter marks shown at 0¢, 25¢, 50¢, 75¢, $1.00</div>
              <div>Dime marks at 10¢, 20¢, etc.</div>
              <div>Nickel marks at 5¢, 15¢, etc.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NumberLineExplorer;