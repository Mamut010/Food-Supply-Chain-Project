import path from "path"


module.exports = {
    serverRoot: path.dirname(require.main!.filename),
    blockchainRoot: path.resolve(require.main!.filename, "..", "..", "chaincode"),
    rootDir: path.resolve(path.dirname(require.main!.filename), "..", "..")
}