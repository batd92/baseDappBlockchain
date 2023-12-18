import React, { useState, useEffect } from "react";
import u_Socket from "../../utils/wss";

function EnvWallet({ }) {

  const [privateKey, setPrivateKey] = useState('');
  const [gasLimit, setGasLimit] = useState(50000);
  const [gasWei, setGasWei] = useState(10000);
  const socket = u_Socket();

  useEffect(() => {
    console.log('[get_envWallet]_on[recive_envWallet]');
    const fetchData = async () => {
      socket.emit('get_envWallet', JSON.stringify({}));
      socket.on("recive_envWallet", (data) => {
        try {
          const response = JSON.parse(data);
          if (response) {
            setPrivateKey(response.privateKey);
            setGasLimit(response.gasLimit);
            setGasWei(response.gasWei);
          }
        } catch (error) {
          console.log('recive_envWallet error: ', error);
        }
      });
    };
  
    fetchData();
  
    // Cleanup the socket on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // save data
  const saveConfigWallet = () => {
    console.log('[add_envWallet]');
    socket.emit('add_envWallet', JSON.stringify({
      privateKey,
      gasLimit,
      gasWei
    }));
  }

  return (
    <div className="shadow dark:bg-[#0D0D0D] bg-white p-8 rounded-[10px] flex flex-col gap-3 overflow-hidden">
      <table>
        <tbody>
          <tr>
            <td className="text-center font-bold px-6 dark:text-[#B3B3B3]">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-12">
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-md">
                      <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">Private Key</span>
                      <textarea
                        id="private"
                        name="private"
                        rows="4"
                        value={privateKey}
                        onChange={(e) => setPrivateKey(e.target.value)}
                        className="block w-full border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6">
                      </textarea>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">Gas Limit</span>
                      <input
                        type="text"
                        name="gas-limit"
                        id="gas-limit"
                        value={gasLimit}
                        onChange={(e) => setGasLimit(e.target.value)}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        placeholder="" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">Gas Wei</span>
                      <input
                        type="text"
                        name="gas-wei"
                        id="gas-wei"
                        value={gasWei}
                        onChange={(e) => setGasWei(e.target.value)}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        placeholder="" />
                    </div>
                  </div>
                  <div className="col-span-full mt-2">
                    <div className="mt-2 flex items-center gap-x-3">
                      <button
                        onClick={() => saveConfigWallet()}
                        type="button"
                        className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                        Save Setting
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default EnvWallet;
