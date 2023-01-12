#!/bin/bash

CUSTOM_FOLDER="custom-scripts"
CURRENT_FOLDER=${PWD##*/}
STARTING_DIR=${PWD}
ORG="ORG1"

function setEnv() {
    echo "CORE_PEER_TLS_ENABLED=${CORE_PEER_TLS_ENABLED}"
    echo "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH}"
    echo "CORE_PEER_ADDRESS=${CORE_PEER_ADDRESS}"
    echo "CORE_PEER_TLS_ROOTCERT_FILE=${CORE_PEER_TLS_ROOTCERT_FILE}"

    echo "CORE_PEER_LOCALMSPID=${CORE_PEER_LOCALMSPID}"
}

function changeEnvVars() {
    case "${ORG,,}" in
        org1)
        # Environment variables for Org1
        CORE_PEER_TLS_ENABLED=true
        CORE_PEER_LOCALMSPID="Org1MSP"
        CORE_PEER_TLS_ROOTCERT_FILE=${STARTING_DIR}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
        CORE_PEER_MSPCONFIGPATH=${STARTING_DIR}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
        CORE_PEER_ADDRESS=localhost:7051
        ;;
        # Environment variables for Org2
        org2)
        CORE_PEER_TLS_ENABLED=true
        CORE_PEER_LOCALMSPID="Org2MSP"
        CORE_PEER_TLS_ROOTCERT_FILE=${STARTING_DIR}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
        CORE_PEER_MSPCONFIGPATH=${STARTING_DIR}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
        CORE_PEER_ADDRESS=localhost:9051
        ;;
        # Environment variables for Org3
        org3)
        CORE_PEER_TLS_ENABLED=true
        CORE_PEER_LOCALMSPID="Org3MSP"
        CORE_PEER_TLS_ROOTCERT_FILE=${STARTING_DIR}/organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt
        CORE_PEER_MSPCONFIGPATH=${STARTING_DIR}/organizations/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp
        CORE_PEER_ADDRESS=localhost:11051
        ;;
        *)
        echo "Unknown Organization"
        printHelp
        exit 1
    esac

    setEnv
}

function printHelp() {
    echo "Syntax:       'orgEnv.sh -p org1|org2|org3'"
    echo "If the organization is not specified (i.e. 'orgEnv.sh' only), it is set to org1 by default."
    echo "To properly change environment variables, use this syntax:"
    echo '              export $(./orgEnv.sh -p org1|org2|org3)'
    echo "Note: You may need to execute this script with superuser right. In that case, the syntax becomes:"
    echo '              export $(sudo bash orgEnv.sh -p org1|org2|org3)'
    echo
}

if [ "$CURRENT_FOLDER" == "$CUSTOM_FOLDER" ]; then
    STARTING_DIR="${STARTING_DIR}/.."
fi

# handle call without arguments
if [[ $# -lt 1 ]] ; then
    changeEnvVars
    exit 0
fi

# parse flags
while [[ $# -ge 1 ]] ; do
    key="$1"
    case $key in
        -h )
        printHelp
        exit 0
        ;;
        -help )
        printHelp
        exit 0
        ;;
        -p )
        ORG="$2"
        shift
        changeEnvVars
        ;;
        * )
        echo "Unknown flag: $key"
        printHelp
        exit 1
        ;;
    esac
    shift
done
