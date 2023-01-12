=============================================================================
PREREQUISITES
=============================================================================
- Docker
- Linux jq
- npm
- Go
- Docker images for Hyperledger Fabric
- ts-node (Optionally) to quickly run typescript scripts

=============================================================================
STEP TO SETUP THE FOO PROJECT
(Make sure Docker is running while following these steps)
=============================================================================
1. Follow the instruction in the <a href="https://hyperledger-fabric.readthedocs.io/en/latest/install.html" 
target="_blank">official document of Hyperledger Fabric" target</a> to install Fabric samples, 
Docker images, and binaries. (The fabric-samples folder should be in the same directory as the
backend and frontend folder)

2. Change working directory to test-network inside fabric-samples folder

3. Cut the hamburg-chaincode and custom-scripts folder and paste in this folder

3. Change working directory to custom-scripts

4. Change permission for all shell scripts in this folder to be executable

5. Run the script hamburg.sh with mode 'up' as follows: <code>./hamburg.sh up</code>

6. Run the script hamburg.sh with mode deployhamburgcc as follows: <code>./hamburg.sh deployhamburgcc</code>

7. Open in total 2 terminals, one for running the backend server, one for running the frontend server

8. On the backend terminal, change working directory to the backend folder and run <code>npm install</code>

9. Start the server by running the 'server.ts' TypeScript script. It can be run by using ts-node command as follows:
<code>ts-node server.ts</code>

10. On the frontend terminal, change working directory to the frontend folder and run <code>npm install -f</code>
(Please ignore all the warnings during installation process)

11. Start the server by running the command: <code>npm start</code>


