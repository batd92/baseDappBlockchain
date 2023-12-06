import React, { useEffect, useState } from 'react';
import { notTranslation as useTranslations } from "../../utils";
import Ratio from "../ratio";
import u_Socket from "../../utils/wss";
const addressWBNB = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c';

function Contract({ lang, data }) {

  const t = useTranslations('Common', lang);
  const [contractInput, setContractInput] = useState('');

  const [price, setPrice] = useState({});
  const [token0, setToken0] = useState({});
  const [token1, setToken1] = useState({});
  const socket = u_Socket();

  socket.on("h_getPrice", (data) => {
    try {
      console.log('___ Reciver h_getPrice ___');
      const { token0, token1, price } = JSON.parse(data);
      setToken0(token0);
      setToken1(token1);
      setPrice(price);
    } catch (error) {
      console.log('h_getPrice error: ', error);
    }
  });

  useEffect(() => {
    if (!(/^0x[0-9a-fA-F]+$/).test(contractInput) || contractInput === addressWBNB) {
      setToken0({});
      setToken1({});
      setPrice({});
      return;
    };
    const intervalId = setInterval(() => {
      console.log('___ Emit check_h_getPrice ___');
      socket.emit('check_h_getPrice', JSON.stringify(
        {
          address_token0: addressWBNB,
          address_token1: contractInput,
        }
      ));
    }, 5000);

    return () => clearInterval(intervalId);
  }, [contractInput]);

  const enterKeyPress = (e) => {
    if (e.key === 'Enter') {
      socket.emit('check_h_getPrice', JSON.stringify(
        {
          address_token0: addressWBNB,
          address_token1: contractInput,
        }
      ));
    }
  };

  return (
    <div className="sticky top-0 z-50 rounded-[10px] dark:bg-[#181818] bg-[#f3f3f3] p-5 -m-5">
      <header className="flex items-end gap-2 w-full sticky top-4 shadow rounded-[10px] z-50">
        <div className="flex flex-col dark:bg-[#0D0D0D] bg-white rounded-[10px] flex-1">
          <div className="rounded-t-[10px] shadow-sm">
            <label className="flex sm:items-center flex-col sm:flex-row focus-within:ring-2 dark:ring-[#2F80ED] ring-[#2F80ED] rounded-t-[10px]">
              <span className="font-bold text-sm dark:text-[#B3B3B3] text-black whitespace-nowrap px-3 pt-4 sm:pt-0">
              <h6 class="text-lg font-bold dark:text-white">BNN Chain</h6>
              </span>
              <input
                value={addressWBNB}
                readOnly
                className="dark:bg-[#0D0D0D] bg-white dark:text-[#B3B3B3] text-blue-600 flex-1 px-3 sm:px-2 pb-4 pt-2 sm:py-4 outline-none"
              />
            </label>
          </div>
          <div className="rounded-t-[10px] shadow-sm">
            <label className="flex sm:items-center flex-col sm:flex-row focus-within:ring-2 dark:ring-[#2F80ED] ring-[#2F80ED] rounded-t-[10px]">
              <span className="font-bold text-sm dark:text-[#B3B3B3] text-black whitespace-nowrap px-3 pt-4 sm:pt-0">
                {t("search-contracts")}
              </span>
              <input
                placeholder="Fill in the smart contract address. But not WBNB's address."
                value={contractInput}
                onChange={(e) => setContractInput(e.target.value)}
                onKeyDown={enterKeyPress}
                className="dark:bg-[#0D0D0D] bg-white dark:text-[#B3B3B3] text-black flex-1 px-3 sm:px-2 pb-4 pt-2 sm:py-4 outline-none"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                className="dark:stroke-[#B3B3B3] stroke-black w-4 h-4 mr-3 hidden sm:block"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </label>
          </div>
          { 
            (
              (token0 && Object.keys(token0).length > 0 && token1 && Object.keys(token1).length > 0 && price && Object.keys(price).length > 0) 
                &&
              <Ratio token1={token1} token0={token0} price={price} />
            )
          }
        </div>
      </header>
    </div>
  );
}

export default Contract;
