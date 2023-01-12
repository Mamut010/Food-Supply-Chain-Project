#!/bin/bash

. ../scripts/utils.sh

CURRENT_DIR=${PWD##*/}

function networkUp() {
    cd ../

    infoln "Setting up hamburg network and creating 'hamburgchannel' channel..."
    ./network.sh up createChannel -ca -c hamburgchannel -s couchdb
    infoln
    infoln "Creating Org3 peer and adding it to the network..."
    cd ./addOrg3
    ./addOrg3.sh up -ca -c hamburgchannel -s couchdb

    cd ../$CURRENT_DIR

#    if [ $? -eq 0 ]; then
#        infoln "Hamburg network created successfully"
#        infoln
#        exit 0
#    else
#        errorln "Failed to create Hamburg network"
#        errorln
#        exit 1
#    fi
}

function networkDown() {
    cd ../
    ./network.sh down
    cd ./$CURRENT_DIR

#    if [ $? -eq 0 ]; then
#        infoln
#        infoln "Network shut down successfully"
#        infoln
#        exit 0
#    else
#        errorln "Failed to shut down network"
#        errorln
#        exit 1
#    fi
}

function networkRestart() {
    networkDown

    if [ $? -eq 0 ]; then
        networkUp
        exit 0
    else
        errorln "Failed to restart network"
        errorln
        exit 1
    fi
}

function deployHamburgCC() {
    cd ../

    ./network.sh deployCC -ccn hamburgcc -ccp ./hamburg-chaincode -ccl go -c hamburgchannel

    cd ./$CURRENT_DIR
}


function replaceSampleScripts() {
    infoln "Creating backup files..."
    local created=false
    if [ ! -d backup ]; then
        mkdir backup
        created=true
    fi

    if [ ! -f backup/deployCC.sh.bak ]; then
        mv ../scripts/deployCC.sh backup/deployCC.sh.bak
        created=true
        infoln "Backup file for deployCC.sh has been created"
    fi

    if [ ! -f backup/deployCCAAS.sh.bak ]; then
        mv ../scripts/deployCCAAS.sh backup/deployCCAAS.sh.bak
        created=true
        infoln "Backup file for deployCCAAS.sh has been created"
    fi

    if [ ! -f backup/registerEnroll-org1-org2.sh.bak ]; then
        mv  ../organizations/fabric-ca/registerEnroll.sh backup/registerEnroll-org1-org2.sh.bak
        created=true
        infoln "Backup file for registerEnroll-org1-org2.sh has been created"
    fi

    if [ ! -f backup/registerEnroll-org3.sh.bak ]; then
        mv ../addOrg3/fabric-ca/registerEnroll.sh backup/registerEnroll-org3.sh.bak
        created=true
        infoln "Backup file for registerEnroll-org3.sh has been created"
    fi

    if [ "$created" = true ] ; then
        infoln "Backup files created"
    else
        infoln "Backup files already existed..."
    fi

    infoln "Replacing scripts..."

    rm -f ../scripts/deployCC.sh ../scripts/deployCCAAS.sh ../organizations/fabric-ca/registerEnroll.sh ../addOrg3/fabric-ca/registerEnroll.sh
    cp custom-deployCC.sh ../scripts/deployCC.sh
    cp custom-deployCCAAS.sh ../scripts/deployCCAAS.sh
    cp custom-registerEnroll-org1-org2.sh ../organizations/fabric-ca/registerEnroll.sh
    cp custom-registerEnroll-org3.sh ../addOrg3/fabric-ca/registerEnroll.sh

    if [ $? -eq 0 ]; then
        println "Scripts replaced successfully"
        exit 0
    else
        errorln "Failed to replace scripts"
        errorln
        exit 1
    fi
}

function restoreSampleScripts() {
    infoln "Looking for backup files..."
    if [ ! -d backup ]; then
        errorln "Backup folder not existed!"
        exit 1
    fi

    if [ ! -f backup/deployCC.sh.bak ]; then
        errorln "Backup files for deployCC.sh not existed!"
        exit 1
    elif [ ! -f backup/deployCCAAS.sh.bak ]; then
        errorln "Backup files for deployCCAAS.sh not existed!"
        exit 1
    elif [ ! -f backup/registerEnroll-org1-org2.sh.bak ]; then
        errorln "Backup files for registerEnroll-org1-org2.sh not existed!"
        exit 1
    elif [ ! -f backup/registerEnroll-org3.sh.bak ]; then
        errorln "Backup files for registerEnroll-org3.sh not existed!"
        exit 1
    fi

    infoln "Restoring scripts..."

    rm -f ../scripts/deployCC.sh ../scripts/deployCCAAS.sh ../organizations/fabric-ca/registerEnroll.sh ../addOrg3/fabric-ca/registerEnroll.sh
    cp backup/deployCC.sh.bak ../scripts/deployCC.sh
    cp backup/deployCCAAS.sh.bak ../scripts/deployCCAAS.sh
    cp backup/registerEnroll-org1-org2.sh.bak ../organizations/fabric-ca/registerEnroll.sh
    cp backup/registerEnroll-org3.sh.bak ../addOrg3/fabric-ca/registerEnroll.sh

    if [ $? -eq 0 ]; then
        println "Scripts restored successfully"
        exit 0
    else
        errorln "Failed to restore scripts"
        errorln
        exit 1
    fi
}

function printHelp() {
    println 'Usage: ./hamburg.sh <Mode> [Flags]'
    println 'Modes:'
    println "    up - Bring up Hamburg network, which contains 3 organizations, each organization has 1 peer; Then create a channel named 'hamburgchannel' and let all peers join this channel"
    println "    down - Bring down the network"
    println "    restart - Bring down the network then bring up Hamburg network"
    println "    deployhamburgcc - Quickly deploy the hamburg chaincode"
    println "    replaceScripts - Replace existings chaincode related scripts in sample with custom scripts"
    println "    restoreScripts - Restore sample chaincode related scripts from backup files"
}

# Parse commandline args

## Parse mode
if [[ $# -lt 1 ]] ; then
    printHelp
    exit 0
else
    MODE=$1
    shift
fi

# parse flags
while [[ $# -ge 1 ]] ; do
    key="$1"
    case $key in
    -h )
        printHelp
        exit 0
        ;;
    * )
        errorln "Unknown flag: $key"
        printHelp
        exit 1
        ;;
    esac
    shift
done

# Determine mode of operation and printing out what we asked for
if [ "$MODE" == "up" ]; then
    infoln "Starting Hamburg network... "
    networkUp
elif [ "$MODE" == "down" ]; then
    infoln "Stopping the network... "
    networkDown
elif [ "$MODE" == "restart" ]; then
    infoln "Restarting Hamburg network..."
    networkRestart
elif [ "$MODE" == "deployhamburgcc" ]; then
    infoln "Deploying Hamburg Chaincode..."
    deployHamburgCC
elif [ "$MODE" == "replaceScripts" ]; then
    infoln "Replacing existings scripts with custom scripts..."
    replaceSampleScripts
elif [ "$MODE" == "restoreScripts" ]; then
    infoln "Restoring sample scripts..."
    restoreSampleScripts
else
    printHelp
    exit 1
fi