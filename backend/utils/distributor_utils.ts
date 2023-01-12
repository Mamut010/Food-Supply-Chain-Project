import * as grpc from '@grpc/grpc-js';
import { connect, Contract, Gateway, Identity, Signer, signers } from '@hyperledger/fabric-gateway';
import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import * as path from 'path';

const CHANNEL_NAME = envOrDefault('CHANNEL_NAME', 'hamburgchannel');
const CHAINCODE_NAME = envOrDefault('CHAINCODE_NAME', 'hamburgcc');
const CONTRACT_NAME = envOrDefault('CONTRACT_NAME', 'hamburg.example.com.ProductContract');
const mspId = envOrDefault('MSP_ID', 'Org2MSP');

// Path to crypto materials.
// Note: If needed, the path must be set so that it leads to the main folder of 'org2.example.com'
const startingDir = path.resolve(__dirname, '..', '..', 'fabric-samples');
const cryptoPath = envOrDefault('CRYPTO_PATH', path.resolve(startingDir, 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com'));

// Path to user private key directory.
const keyDirectoryPath = envOrDefault('KEY_DIRECTORY_PATH', path.resolve(cryptoPath, 'users', 'User1@org2.example.com', 'msp', 'keystore'));

// Path to user certificate.
const certPath = envOrDefault('CERT_PATH', path.resolve(cryptoPath, 'users', 'User1@org2.example.com', 'msp', 'signcerts', 'cert.pem'));

// Path to peer tls certificate.
const tlsCertPath = envOrDefault('TLS_CERT_PATH', path.resolve(cryptoPath, 'peers', 'peer0.org2.example.com', 'tls', 'ca.crt'));

// Gateway peer endpoint.
const peerEndpoint = envOrDefault('PEER_ENDPOINT', 'localhost:9051');

// Gateway peer SSL host name override.
const peerHostAlias = envOrDefault('PEER_HOST_ALIAS', 'peer0.org2.example.com');

let gateway: Gateway;
let client: grpc.Client;

/**
 * envOrDefault() will return the value of an environment variable, or a default value if the variable is undefined.
 */
function envOrDefault(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
}

async function newGrpcConnection(): Promise<grpc.Client> {
    const tlsRootCert = await fs.readFile(tlsCertPath);
    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
    return new grpc.Client(peerEndpoint, tlsCredentials, {
            'grpc.ssl_target_name_override': peerHostAlias,
        }
    );
}

async function newIdentity(): Promise<Identity> {
    const credentials = await fs.readFile(certPath);
    return { mspId, credentials };
}

async function newSigner(): Promise<Signer> {
    const files = await fs.readdir(keyDirectoryPath);
    const keyPath = path.resolve(keyDirectoryPath, files[0]);
    const privateKeyPem = await fs.readFile(keyPath);
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
}

/**
 * @description Get a smart contract in the network, given contract name, chaincode name and channel name.
 * @param contractName string: name of the contract (default to 'hamburg.example.com.ProductContract' if not given)
 * @param chaincodeName string: name of the chaincode (default to 'hamburgcc' if not given)
 * @param channelName string: name of the channel (default to 'hamburgchannel' if not given)
 * @return A smart contract in the network which corresponds to the given information.
 */
export async function getContract(contractName: string = CONTRACT_NAME, chaincodeName: string = CHAINCODE_NAME, channelName: string = CHANNEL_NAME)
    : Promise<Contract> {

    client = await newGrpcConnection();
    gateway = connect({
        client,
        identity: await newIdentity(),
        signer: await newSigner(),
        // Default timeouts for different gRPC calls
        /*
        evaluateOptions: () => {
            return { deadline: Date.now() + 5000 }; // 5 seconds
        },
        endorseOptions: () => {
            return { deadline: Date.now() + 15000 }; // 15 seconds
        },
        submitOptions: () => {
            return { deadline: Date.now() + 5000 }; // 5 seconds
        },
        commitStatusOptions: () => {
            return { deadline: Date.now() + 60000 }; // 1 minute
        },
        */
    });

    // Get a network instance representing the channel where the smart contract is deployed.
    const network = gateway.getNetwork(channelName);

    // Get the smart contract from the network.
    return network.getContract(chaincodeName, contractName);
}

/**
 * @description Helper function to quickly get an instance of ProductContract of chaincode hamburgcc in hamburgchannel.
 * @return An instance of ProductContract.
 */
export async function getProductContract(): Promise<Contract> {
    return getContract('hamburg.example.com.ProductContract', 'hamburgcc', 'hamburgchannel');
}

/**
 * @description Helper function to quickly get an instance of ProductBatchContract of chaincode hamburgcc in hamburgchannel.
 * @return An instance of ProductBatchContract.
 */
export async function getProductBatchContract(): Promise<Contract> {
    return getContract('hamburg.example.com.ProductBatchContract', 'hamburgcc', 'hamburgchannel');
}

/**
 * @description Close the gateway and release relevant resource.
 */
export async function disconnetGateway(): Promise<void> {
    if(typeof gateway !== 'undefined') {
        gateway.close();
    }
    if(typeof client !== 'undefined') {
        client.close();
    }
}