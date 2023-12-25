import React, { useState, useEffect } from "react";
import HttpClient from "../../utils/http-client";
const httpClient = new HttpClient();

function EnvWallet() {
  const [privateKey, setPrivateKey] = useState('');
  const [isMetamask, setIsMetamask] = useState(false);
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await httpClient.request("/config", "GET");
        if (data.statusText === 'OK') {
          setPrivateKey(data.data.config.privateKey);
          setIsMetamask(true);
          return;
        }
        if (data.statusText === 'NG') {
          setIsMetamask(false);
          return;
        }
      } catch (error) {
        console.error('Error during fetch:', error);
      }
    };

    fetchConfig();
  }, []);

  const saveConfigWallet = async () => {
    try {
      const data = await httpClient.request("/connect-wallet", "POST", {
        privateKey,
      });
      if (data.statusText === 'OK') {
        setPrivateKey(data.data.config.privateKey);
        setIsMetamask(true);
        return;
      }
      if (data.statusText === 'NG') {
        setIsMetamask(false);
        return;
      }
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  };

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
                        rows="2"
                        value={privateKey}
                        onChange={(e) => setPrivateKey(e.target.value)}
                        className="flex select-none items-center pl-3 text-gray-500 sm:text-sm w-full border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6">
                      </textarea>
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
                      <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">{isMetamask ? 'OK' : 'NG'}</span>
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
