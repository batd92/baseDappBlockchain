import { io } from "socket.io-client";
const WS = "ws://localhost:9001";

let socket;

const u_Socket = () => {
  if (!socket) {
    socket = io(WS, {
        forceNew: true
    });
    // Thêm bất kỳ sự kiện lắng nghe hoặc cấu hình nào khác nếu cần
  }

  return socket;
};

export default u_Socket;