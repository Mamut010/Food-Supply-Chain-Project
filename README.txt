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
1. Change working directory to test-network inside fabric-samples folder

2. Change working directory one more time to custom-scripts

3. Change permission for all shell scripts in this folder to be executable

4. Run the script hamburg.sh with mode 'up' as follows: 
			./hamburg.sh up

5. Run the script hamburg.sh with mode deployhamburgcc as follows:
			./hamburg.sh deployhamburgcc

6. Open in total 2 terminals, one for running the backend server, one for running the frontend server

7. On the backend terminal, change working directory to the backend folder and run "npm install"

8. Start the server by running the 'server.ts' TypeScript script. It can be run by using ts-node command as follows:
			ts-node server.ts

9. On the frontend terminal, change working directory to the frontend folder and run "npm install -f"
(Please ignore all the warnings during installation process)

10. Start the server by running the command:
			npm start


