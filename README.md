INSTALLATION GUIDE
==================

### PREREQUISITES

*   Docker
*   Linux jq
*   npm
*   Go
*   Docker images for Hyperledger Fabric
*   (Optionally) ts-node to quickly run typescript scripts

### STEP TO SETUP THE FOO PROJECT

_(Make sure Docker is running while following these steps)_

1.  Follow the instruction in the [official document of Hyperledger Fabric](https://hyperledger-fabric.readthedocs.io/en/latest/install.html) to install Fabric samples, Docker images, and binaries. (The fabric-samples folder should be in the same directory as the backend and frontend folder)
2.  Change working directory to test-network inside fabric-samples folder
3.  Cut the hamburg-chaincode and custom-scripts folder and paste in this folder
4.  Change working directory to custom-scripts
5.  Change permission for all shell scripts in this folder to be executable
6.  Run the script hamburg.sh with mode 'up' as follows: `./hamburg.sh up`
7.  Run the script hamburg.sh with mode deployhamburgcc as follows: `./hamburg.sh deployhamburgcc`
8.  Open in total 2 terminals, one for running the backend server, one for running the frontend server
9.  On the backend terminal, change working directory to the backend folder and run `npm install`
10.  Start the server by running the 'server.ts' TypeScript script. It can be run by using ts-node command as follows: `ts-node server.ts`
11.  On the frontend terminal, change working directory to the frontend folder and run `npm install -f` (Please ignore all the warnings during installation process)
12.  Start the server by running the command: `npm start`
