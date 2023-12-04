import * as React from "react";

function EnvTrade({ }) {

  return (
    <div className="shadow dark:bg-[#0D0D0D] bg-white p-8 rounded-[10px] flex flex-col gap-3 overflow-hidden">
      <table>
        <tbody>
          <tr>
            <td className="text-center font-bold px-6 dark:text-[#B3B3B3]">
              <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div class="sm:col-span-12">
                  <div class="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-md">
                      <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm">Private Key</span>
                      <textarea
                        id="private"
                        name="private"
                        rows="4"
                        className="block w-full border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6">
                      </textarea>
                    </div>
                  </div>
                  <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm">Gas Limit</span>
                      <input
                        type="text"
                        name="gas-limit"
                        id="gas-limit"
                        class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        placeholder="" />
                    </div>
                  </div>
                  <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm">Gas Wei</span>
                      <input
                        type="text"
                        name="gas-wei"
                        id="gas-wei"
                        class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        placeholder="" />
                    </div>
                  </div>
                  <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm">Fee Estimate</span>
                      <input
                        type="text"
                        name="Fee Estimate"
                        id="fee-est"
                        class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        placeholder="" />
                    </div>
                  </div>
                  <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm">Initial (USDT)</span>
                      <input
                        type="text"
                        name="Initial (USDT)"
                        id="init-usdt"
                        class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        placeholder="" />
                    </div>
                  </div>
                </div>
              </div>
            </td>
            <td className="text-center font-bold px-4 dark:text-[#B3B3B3]">
              <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div class="sm:col-span-12">
                  <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm">Profit sell (%)</span>
                      <input
                        type="text"
                        name="profit"
                        id="profit-sell"
                        class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        placeholder="" />
                    </div>
                  </div>
                  <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm">USDT Amount</span>
                      <input
                        type="text"
                        name="usdt-amount"
                        id="profit-sell"
                        class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        placeholder="" />
                    </div>
                  </div>
                  <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm">Quantity Token</span>
                      <input
                        type="text"
                        name="quantity"
                        id="quantity"
                        class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        placeholder="" />
                    </div>
                  </div>
                  <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm">Total (USDT)</span>
                      <input
                        type="text"
                        name="total-usdt"
                        id="total-usdt"
                        class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        placeholder="" />
                    </div>
                  </div>
                  <div class="mt-2">
                    <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm">Total (BNB)</span>
                      <input
                        type="text"
                        name="total-bnb"
                        id="total-bnb"
                        class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        placeholder="" />
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="col-span-full mt-2">
        <h6 class="text-lg font-bold dark:text-white">Trade</h6>
        <div class="mt-2 flex items-center gap-x-3">
          <button
            type="button"
            class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Auto
          </button>
          <button
            type="button"
            class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Manual
          </button>
        </div>
      </div>
      {/* <AddNetwork chain={chain} buttonOnly lang="en" /> */}
    </div>
  );
}

export default EnvTrade;
