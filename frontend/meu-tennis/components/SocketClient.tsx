class SocketClient {

  constructor() {
    this.isConnected = false;
    this.userId = localStorage.getItem('userid');
    this.serverAddress = 'ws://127.0.0.1:50012/' + this.userId;
    console.log(this.serverAddress)
    // this.connectToServer();
    // this.connectSendRecvStayOpen(data)
  }

  connectToServer() {
    this.client = new WebSocket(this.serverAddress);

    this.client.addEventListener('open', () => {
      console.log('Connected to server!');
      this.isConnected = true;
      
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
      // this.closeConnection()
    });

    this.client.addEventListener('message', (event) => {
      const data = event.data;
      console.log(`Received data from server: ${data}`);
      this.closeConnection()

    });

    this.client.addEventListener('close', () => {
      console.log('Connection closed');
      this.isConnected = false;
    });

    this.client.addEventListener('error', (err) => {
      console.error(`Error: ${err.message}`);
    });


  }
  connectSendRecvClose(data : string) {
    this.client = new WebSocket(this.serverAddress);

    this.client.addEventListener('open', () => {
      console.log('Connected to server!');
      this.isConnected = true;
      
      this.sendData(data);
    });

    this.client.addEventListener('message', (event) => {
      const data = event.data;
      console.log(`Received data from server: ${data}`);
      this.closeConnection()

    });

    this.client.addEventListener('close', () => {
      console.log('Connection closed');
      this.isConnected = false;
    });

    this.client.addEventListener('error', (err) => {
      console.error(`Error: ${err.message}`);
    });
  }
  connectSendRecvStayOpen(data : string) {
    this.client = new WebSocket(this.serverAddress);

    this.client.addEventListener('open', () => {
      console.log('Connected to server!');
      this.isConnected = true;
      
      this.sendData(data);
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
