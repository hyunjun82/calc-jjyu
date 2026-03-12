'use client';

import { useState } from 'react';

type Unit = 'pyeong' | 'm2' | 'ft2';

export default function AreaConverterPage() {
  const [inputValue, setInputValue] = useState<string>('10');
  const [inputUnit, setInputUnit] = useState<Unit>('pyeong');

  const conversionFactors = {
    pyeong: 1,
    m2: 3.3058,
    ft2: 35.5832,
  };

  const convertValue = (value: number, fromUnit: Unit, toUnit: Unit): number => {
    const inPyeong = value / conversionFactors[fromUnit];
    return inPyeong * conversionFactors[toUnit];
  };

  const inputNum = parseFloat(inputValue) || 0;
  const pyeong = inputUnit === 'pyeong' ? inputNum : convertValue(inputNum, inputUnit, 'pyeong');
  const m2 = inputUnit === 'm2' ? inputNum : convertValue(inputNum, inputUnit, 'm2');
  const ft2 = inputUnit === 'ft2' ? inputNum : convertValue(inputNum, inputUnit, 'ft2');

  const presets = [10, 20, 25, 30, 33, 40, 50];

  const handlePreset = (value: number) => {
    setInputValue(value.toString());
    setInputUnit('pyeong');
  };

  const handleCalculate = () => {
    // Calculation happens automatically via state
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const formatNumber = (num: number, decimals: number = 2): string => {
    return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 text-sm text-gray-600">
          <span>홈</span>
          <span className="mx-2">&gt;</span>
          <span>부동산</span>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-900 font-medium">평수 환산</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">평수 환산 계산기</h1>
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
              부동산
            </span>
          </div>
          <p className="text-gray-600 text-lg">
            평(坪), 제곱미터(m²), 제곱피트(ft²) 사이의 면적을 쉽게 환산합니다.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Calculator Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-blue-25 px-8 py-6 border-b-2 border-blue-200">
            <h2 className="text-xl font-bold text-gray-900">단위 변환</h2>
          </div>

          <div className="p-8">
            {/* Quick Presets */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                자주 사용하는 평수
              </label>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handlePreset(preset)}
                    className={`py-2 px-3 rounded-lg font-semibold transition-all duration-200 ${
                      inputValue === preset.toString() && inputUnit === 'pyeong'
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {preset}평
                  </button>
                ))}
              </div>
            </div>

            {/* Input Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  입력값
                </label>
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
                  placeholder="값을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  단위
                </label>
                <select
                  value={inputUnit}
                  onChange={(e) => setInputUnit(e.target.value as Unit)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
                >
                  <option value="pyeong">평 (坪)</option>
                  <option value="m2">제곱미터 (m²)</option>
                  <option value="ft2">제곱피트 (ft²)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleCalculate}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  계산하기
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Pyeong Result */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6 border-2 border-blue-200">
            <div className="text-sm font-semibold text-blue-700 mb-2">평(坪)</div>
            <div className="text-4xl font-bold text-blue-900 mb-1">
              {formatNumber(pyeong, 2)}
            </div>
            <div className="text-xs text-blue-600">pyeong</div>
          </div>

          {/* Square Meters Result */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-6 border-2 border-green-200">
            <div className="text-sm font-semibold text-green-700 mb-2">제곱미터(m²)</div>
            <div className="text-4xl font-bold text-green-900 mb-1">
              {formatNumber(m2, 2)}
            </div>
            <div className="text-xs text-green-600">square meter</div>
          </div>

          {/* Square Feet Result */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-md p-6 border-2 border-purple-200">
            <div className="text-sm font-semibold text-purple-700 mb-2">제곱피트(ft²)</div>
            <div className="text-4xl font-bold text-purple-900 mb-1">
              {formatNumber(ft2, 2)}
            </div>
            <div className="text-xs text-purple-600">square foot</div>
          </div>
        </div>

        {/* Conversion Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-gray-50 to-gray-25 px-8 py-6 border-b-2 border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">변환 공식</h2>
          </div>

          <div className="p-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-700">1 평 (坪)</span>
                <span className="font-semibold text-gray-900">= 3.3058 m² = 35.5832 ft²</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-700">1 m² (제곱미터)</span>
                <span className="font-semibold text-gray-900">= 0.3025 평 = 10.764 ft²</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-700">1 ft² (제곱피트)</span>
                <span className="font-semibold text-gray-900">= 0.0281 평 = 0.0929 m²</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Reference Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-gray-50 to-gray-25 px-8 py-6 border-b-2 border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">빠른 참조표</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="px-8 py-4 text-left font-semibold text-gray-700">평(坪)</th>
                  <th className="px-8 py-4 text-left font-semibold text-gray-700">m²</th>
                  <th className="px-8 py-4 text-left font-semibold text-gray-700">ft²</th>
                </tr>
              </thead>
              <tbody>
                {[10, 20, 25, 30, 33, 40, 50].map((p) => (
                  <tr key={p} className="border-b border-gray-200 hover:bg-blue-50">
                    <td className="px-8 py-4 text-gray-700 font-medium">{p}평</td>
                    <td className="px-8 py-4 text-gray-700 font-medium">
                      {formatNumber(p * 3.3058, 2)}
                    </td>
                    <td className="px-8 py-4 text-gray-700 font-medium">
                      {formatNumber(p * 35.5832, 2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <span className="text-xl">💡</span> 알아두기
          </h3>
          <ul className="space-y-3 text-sm text-blue-800">
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                한국에서는 주로 <strong>평</strong>을 사용하며, 1평은 약 3.3058m²입니다.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                부동산 거래나 임대차 계약에서는 정확한 면적 표기가 중요하므로 확인 후 사용하세요.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                국제 거래나 해외 부동산에서는 주로 m² 또는 ft²을 사용합니다.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
