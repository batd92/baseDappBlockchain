import React from 'react';

function Ratio({ token0, token1, price }) {
  return (
    <>
      <div className="dark:text-[#B3B3B3] text-black py-2 px-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <label className="flex items-center gap-2">
          <span className="leading-5">Pool: </span>
          <span className="text-blue-700">Số lượng {token0.symbol}: </span> {price._reserve0}
          <span className="text-blue-700">Số lượng {token1.symbol}: </span> {price._reserve1}
        </label>
      </div>
      <div className="dark:text-[#B3B3B3] text-black py-2 px-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <label className="flex items-center gap-2">
        <span className="leading-5">Ratio: </span>
          <span className="text-yellow-400">{token0.symbol}/{token1.symbol}: </span> {price.fromRatio}
          <span className="text-yellow-400">{token1.symbol}/{token0.symbol}: </span> {price.toRatio}
        </label>
      </div>
    </>
  );
}

export default Ratio;
