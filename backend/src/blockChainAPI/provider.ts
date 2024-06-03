import { ethers } from "ethers";;
import dotenv from "dotenv"

dotenv.config();

const getProvider = () => {
    const rpcUrl = process.env.RPC_URL;
    if (!rpcUrl) {
        throw new Error("RPC_URL is not defined in .env file");
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);

    provider
        .getNetwork()
        .then(() => {
            console.log("Connected to network");
        })
        .catch((error) => {
            console.error("Failed to connect to network:", error);
        });

    return provider;
};

export default getProvider;