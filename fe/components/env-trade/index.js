import React, { useState, useEffect } from "react";
import HttpClient from "../../utils/http-client";
const httpClient = new HttpClient();

function EnvTrade({ }) {
  const [maxGasLimit, setMaxGasLimit] = useState('0');
  const [gasLimit, setGasLimit] = useState('0');
  const [gasWei, setGasWei] = useState('0');
  const [feeEstimate, setFeeEstimate] = useState('0');
  const [usdtInitial, setUsdtInitial] = useState('0');
  const [profitSell, setProfitSell] = useState('0');
  const [percentageToSell, setPercentageToSell] = useState('0');
  const [slippage, setSlippage] = useState('0');
  const [amountSell, setAmountSell] = useState('0');
  const [bnbAmount, setBnbAmount] = useState('0');
  const [usdtAmount, setUsdtAmount] = useState('0');
  const [quantityToken, setQuantityToken] = useState('0');
  const [bnbTotal, setBnbTotal] = useState('0');
  const [usdtTotal, setUsdtTotal] = useState('0');

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await httpClient.request("/config", "GET");
        if (data && data.statusText === 'OK') {
          const { 
            gasLimit,
            gasWei,
            feeEstimate,
            usdtInitial,
            profitSell,
            amountSell,
            quantityToken,
            slippage,
            percentageToSell,
            maxGasLimit
          } = data.data.config;
  
          setMaxGasLimit(maxGasLimit);
          setGasLimit(gasLimit);
          setGasWei(gasWei);
          setFeeEstimate(feeEstimate);
          setUsdtInitial(usdtInitial);
          setProfitSell(profitSell);
          setPercentageToSell(percentageToSell);
          setSlippage(slippage);
          setAmountSell(amountSell);
          setBnbAmount(bnbAmount);
          setUsdtAmount(usdtAmount);
          setQuantityToken(quantityToken);
          setBnbTotal(bnbTotal);
          setUsdtTotal(usdtTotal);
          return;
        }
        if (data.statusText === 'NG') {
          return;
        }
      } catch (error) {
        console.error('Error during fetch:', error);
      }
    };

    fetchConfig();
  }, []);

  const saveConfig = async () => {
    try {
      const data = await httpClient.request("/save-config", "POST", {
        gasLimit,
        gasWei,
        feeEstimate,
        usdtInitial,
        profitSell,
        amountSell,
        quantityToken,
        slippage,
        percentageToSell,
        maxGasLimit
      });

      if (data.statusText === 'OK') {
        const { 
          gasLimit,
          gasWei,
          feeEstimate,
          usdtInitial,
          profitSell,
          amountSell,
          quantityToken,
          slippage,
          percentageToSell,
          maxGasLimit
        } = data.data;

        setMaxGasLimit(maxGasLimit);
        setGasLimit(gasLimit);
        setGasWei(gasWei);
        setFeeEstimate(feeEstimate);
        setUsdtInitial(usdtInitial);
        setProfitSell(profitSell);
        setPercentageToSell(percentageToSell);
        setSlippage(slippage);
        setAmountSell(amountSell);
        setBnbAmount(bnbAmount);
        setUsdtAmount(usdtAmount);
        setQuantityToken(quantityToken);
        setBnbTotal(bnbTotal);
        setUsdtTotal(usdtTotal);
        return;
      }
      if (data.statusText === 'NG') {
        return;
      }
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  };


  return (
    <div className="shadow dark:bg-[#0D0D0D] bg-white p-8 rounded-[10px] flex flex-col gap-3 overflow-hidden">
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-12">
          <div className="flex flex-wrap gap-2 mt-2">
            <div className="w-30">
              <div className="flex items-center">
                <label
                  htmlFor="maxGasLimit"
                  className="text-gray-900 text-sm font-bold mb-1 w-30"
                >
                  Gas Limit
                </label>
                <input
                  type="text"
                  name="Max GasLimit"
                  id="maxGasLimit"
                  value={maxGasLimit}
                  onChange={(e) => setMaxGasLimit(e.target.value)}
                  className="border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 text-sm leading-6 w-30 mr-auto text-center mx-5"
                  placeholder=""
                  style={{ borderBottom: "2px solid red" }}
                />
              </div>
            </div>
            <div className="w-30">
              <div className="flex items-center">
                <label
                  htmlFor="feeEstimate1"
                  className="text-gray-900 text-sm font-bold mb-1 w-30"
                >
                  Gas Limit
                </label>
                <input
                  type="text"
                  name="Gas Limit"
                  id="gasLimit"
                  value={gasLimit}
                  onChange={(e) => setGasLimit(e.target.value)}
                  className="border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 text-sm leading-6 w-30 mr-auto text-center mx-5"
                  placeholder=""
                  style={{ borderBottom: "2px solid red" }}
                />
              </div>
            </div>
            <div className="w-30">
              <div className="flex items-center">
                <label
                  htmlFor="gasWei"
                  className="text-gray-900 text-sm font-bold mb-1 w-30"
                >
                  Gas Wei
                </label>
                <input
                  type="text"
                  name="gasWei"
                  id="gasWei"
                  value={gasWei}
                  onChange={(e) => setGasWei(e.target.value)}
                  className="border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 text-sm leading-6 w-30 mr-auto text-center mx-5"
                  placeholder=""
                  style={{ borderBottom: "2px solid red" }}
                />
              </div>
            </div>
            <div className="w-30">
              <div className="flex items-center">
                <label
                  htmlFor="feeEstimate1"
                  className="text-gray-900 text-sm font-bold mb-1 w-30"
                >
                  Fee Estimate
                </label>
                <input
                  type="text"
                  name="Fee Estimate"
                  id="feeEstimate1"
                  value={feeEstimate}
                  onChange={(e) => setFeeEstimate(e.target.value)}
                  className="border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 text-sm leading-6 w-30 mr-auto text-center mx-5"
                  placeholder=""
                  style={{ borderBottom: "2px solid red" }}
                />
              </div>
            </div>
            <div className="w-30">
              <div className="flex items-center">
                <label
                  htmlFor="Initial (USDT)"
                  className="text-gray-900 text-sm font-bold mb-1 w-30"
                >
                  Initial (USDT)
                </label>
                <input
                  type="text"
                  name="Fee Estimate"
                  id="initial"
                  value={usdtInitial}
                  onChange={(e) => setUsdtInitial(e.target.value)}
                  className="border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 text-sm leading-6 w-30 mr-auto text-center mx-5"
                  placeholder=""
                  style={{ borderBottom: "2px solid red" }}
                />
              </div>
            </div>
            <div className="w-30">
              <div className="flex items-center">
                <label
                  htmlFor="profitSell"
                  className="text-gray-900 text-sm font-bold mb-1 w-30"
                >
                  Profit Sell (%)
                </label>
                <input
                  type="text"
                  name="profitSell"
                  id="profitSell"
                  value={profitSell}
                  onChange={(e) => setProfitSell(e.target.value)}
                  className="border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 text-sm leading-6 w-30 mr-auto text-center mx-5"
                  placeholder=""
                  style={{ borderBottom: "2px solid red" }}
                />
              </div>
            </div>
            <div className="w-30">
              <div className="flex items-center">
                <label
                  htmlFor="amountSell"
                  className="text-gray-900 text-sm font-bold mb-1 w-30"
                >
                  Amount Sell (%)
                </label>
                <input
                  type="text"
                  name="Fee Estimate"
                  id="amountSell"
                  value={amountSell}
                  onChange={(e) => setAmountSell(e.target.value)}
                  className="border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 text-sm leading-6 w-30 mr-auto text-center mx-5"
                  placeholder=""
                  style={{ borderBottom: "2px solid red" }}
                />
              </div>
            </div>
            <div className="w-30">
              <div className="flex items-center">
                <label
                  htmlFor="Percentage To Sell"
                  className="text-gray-900 text-sm font-bold mb-1 w-30"
                >
                  Percentage To Sell
                </label>
                <input
                  type="text"
                  name="Percentage To Sell"
                  id="percentageToSell"
                  value={percentageToSell}
                  onChange={(e) => setPercentageToSell(e.target.value)}
                  className="border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 text-sm leading-6 w-30 mr-auto text-center mx-5"
                  placeholder=""
                  style={{ borderBottom: "2px solid red" }}
                />
              </div>
            </div>
            <div className="w-30">
              <div className="flex items-center">
                <label
                  htmlFor="Slippage"
                  className="text-gray-900 text-sm font-bold mb-1 w-30"
                >
                  Percentage To Sell
                </label>
                <input
                  type="text"
                  name="Slippage"
                  id="slippage"
                  value={slippage}
                  onChange={(e) => setSlippage(e.target.value)}
                  className="border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 text-sm leading-6 w-30 mr-auto text-center mx-5"
                  placeholder=""
                  style={{ borderBottom: "2px solid red" }}
                />
              </div>
            </div>
            <div className="w-30">
              <div className="flex items-center">
                <label
                  htmlFor="BNBAmount"
                  className="text-gray-900 text-sm font-bold mb-1 w-30"
                >
                  BNB Amount
                </label>
                <input
                  type="text"
                  name="BNB Amount"
                  id="BNBAmount"
                  value={bnbAmount}
                  readOnly
                  onChange={(e) => setBnbAmount(e.target.value)}
                  className="border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 text-sm leading-6 w-30 mr-auto text-center mx-5"
                  placeholder=""
                  style={{ borderBottom: "2px solid red" }}
                />
              </div>
            </div>
            <div className="w-30">
              <div className="flex items-center">
                <label
                  htmlFor="USDT Amount"
                  className="text-gray-900 text-sm font-bold mb-1 w-30"
                >
                  USDT Amount
                </label>
                <input
                  type="text"
                  name="USDT Amount"
                  id="USDT Amount"
                  value={usdtAmount}
                  readOnly
                  onChange={(e) => setUsdtAmount(e.target.value)}
                  className="border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 text-sm leading-6 w-30 mr-auto text-center mx-5"
                  placeholder=""
                  style={{ borderBottom: "2px solid red" }}
                />
              </div>
            </div>
            <div className="w-30">
              <div className="flex items-center">
                <label
                  htmlFor="Quantity Token"
                  className="text-gray-900 text-sm font-bold mb-1 w-30"
                >
                  Quantity Token
                </label>
                <input
                  type="text"
                  name="Quantity Token"
                  id="quantityToken"
                  value={quantityToken}
                  readOnly
                  onChange={(e) => setQuantityToken(e.target.value)}
                  className="border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 text-sm leading-6 w-30 mr-auto text-center mx-5"
                  placeholder=""
                  style={{ borderBottom: "2px solid red" }}
                />
              </div>
            </div>
            <div className="w-30">
              <div className="flex items-center">
                <label
                  htmlFor="Total (BNB)"
                  className="text-gray-900 text-sm font-bold mb-1 w-30"
                >
                  Total (BNB)
                </label>
                <input
                  type="text"
                  name="Total (BNB)"
                  id="bnbTotal"
                  readOnly
                  value={bnbTotal}
                  onChange={(e) => setBnbTotal(e.target.value)}
                  className="border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 text-sm leading-6 w-30 mr-auto text-center mx-5"
                  placeholder=""
                  style={{ borderBottom: "2px solid red" }}
                />
              </div>
            </div>
            <div className="w-30">
              <div className="flex items-center">
                <label
                  htmlFor="Total (BNB)"
                  className="text-gray-900 text-sm font-bold mb-1 w-30"
                >
                  Total (USDT)
                </label>
                <input
                  type="text"
                  name="Total (USDT)"
                  id="usdtTotal"
                  value={usdtTotal}
                  readOnly
                  onChange={(e) => setUsdtTotal(e.target.value)}
                  className="border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 text-sm leading-6 w-30 mr-auto text-center mx-5"
                  placeholder=""
                  style={{ borderBottom: "2px solid red" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-full mt-2">
        <div className="mt-2 flex items-center gap-x-3">
          <button
            type="button"
            onClick={() => saveConfig()}
            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EnvTrade;
