const net = require('net');

class SocketClient {
  constructor() {
    this.client = new net.Socket();
    this.isConnected = false;

    // Set the server address and port
    this.serverAddress = '127.0.0.1';
    this.serverPort = 50010;

    // Connect to the server
    this.connectToServer();
  }

  connectToServer() {
    this.client.connect(this.serverPort, this.serverAddress, () => {
      console.log('Connected to server!');
      this.isConnected = true;
    });

    // Handle data received from the server
    this.client.on('data', (data) => {
      console.log(`Received data from server: ${data}`);
    });

    // Handle socket closure
    this.client.on('close', () => {
      console.log('Connection closed');
      this.isConnected = false;
    });

    // Handle errors
    this.client.on('error', (err) => {
      console.error(`Error: ${err.message}`);
    });
  }

  // Send data to the server
  sendData(data) {
    if (this.isConnected) {
      this.client.write(data);
    } else {
      console.warn('Not connected to the server.');
    }
  }

  // Close the socket connection
  closeConnection() {
    if (this.isConnected) {
      this.client.end();
    }
  }
}

// Create an instance of the SocketClient
const socketClient = new SocketClient();

// Export the instance if needed
export default SocketClient;
