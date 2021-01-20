(() => {
  const socketUrl = "ws://localhost:8080";
  let socket = new WebSocket(socketUrl);
  socket.addEventListener("close", () => {
    const interAttemptTimeOutms = 100;
    const maxDisconnectedTimeOutms = 3000;

    const maxAttempts = Math.round(
      maxDisconnectedTimeOutms / interAttemptTimeOutms
    );
    let attempts = 0;
    const reloadIfCanConnect = () => {
      attempts++;
      if (attempts > maxAttempts) {
        console.error("Could not connect to dev server");
        return;
      }

      socket = new WebSocket(socketUrl);
      socket.addEventListener("error", () => {
        setTimeout(reloadIfCanConnect, interAttemptTimeOutms);
      });
      socket.addEventListener("open", () => {
        location.reload();
      });
    };
    reloadIfCanConnect();
  });
})();
