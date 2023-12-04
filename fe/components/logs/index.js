import React, { useEffect, useState } from 'react';
import u_Socket from "../../utils/wss";

function Logs({ }) {
  const socket = u_Socket();
  const [logs, setLogs] = useState('');

  socket.on("h_getLogs", (data) => {
    try {
      console.log('___ Reciver h_getLogs ___');
      const logs = JSON.parse(data);
      setLogs(logs);
    } catch (error) {
      console.log('h_getLogs error: ', error);
    }
  });

  return (
    <div className="shadow dark:bg-[#0D0D0D] bg-white p-8 rounded-[10px] flex flex-col gap-3 overflow-hidden">
      <h6 class="text-lg font-bold dark:text-white">Logs</h6>
      <p class="text-red-600"><span class="text-blue-600">{logs.time} </span>{logs.message}</p>
    </div>
  );
}

export default Logs;
