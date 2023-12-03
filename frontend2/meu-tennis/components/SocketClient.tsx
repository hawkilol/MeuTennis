class SocketClient {
  constructor(data : string) {
    this.isConnected = false;
    this.serverAddress = 'ws://127.0.0.1:50012';
    // this.connectToServer();
    this.connectSendClose(data)
  }

  connectToServer() {
    this.client = new WebSocket(this.serverAddress);

    this.client.addEventListener('open', () => {
      console.log('Connected to server!');
      this.isConnected = true;
      
      // Move the sendData call here, where the connection is established
      // this.sendData("test data kkkk");
    });

    this.client.addEventListener('message', (event) => {
      const data = event.data;
      console.log(`Received data from server: ${data}`);
    });

    this.client.addEventListener('close', () => {
      console.log('Connection closed');
      this.isConnected = false;
    });

    this.client.addEventListener('error', (err) => {
      console.error(`Error: ${err.message}`);
    });
  }

  sendData(data) {
    if (this.isConnected) {
      this.client.send(data);
    } else {
      console.warn('Not connected to the server.');
    }
  }

  closeConnection() {
    if (this.isConnected) {
      console.log("close")
      this.client.close();
    }
  }
  connectSendClose(data : string) {
    this.client = new WebSocket(this.serverAddress);

    this.client.addEventListener('open', () => {
      console.log('Connected to server!');
      this.isConnected = true;
      
      this.sendData(data);
      this.closeConnection()
    });

    this.client.addEventListener('message', (event) => {
      const data = event.data;
      console.log(`Received data from server: ${data}`);
    });

    this.client.addEventListener('close', () => {
      console.log('Connection closed');
      this.isConnected = false;
    });

    this.client.addEventListener('error', (err) => {
      console.error(`Error: ${err.message}`);
    });


  }
}

export default SocketClient;
