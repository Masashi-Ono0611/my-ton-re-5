import { Contract, ContractProvider, Address, Cell } from "ton-core";

export default class MainContract implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell }
    ) {}

    async getData(provider: ContractProvider) {
        try {
            console.log("Calling get method 'get_contract_storage_data'...");
            const { stack } = await provider.get("get_contract_storage_data", []);
            console.log("Stack received:", stack);
            
            const number = stack.readNumber();
            console.log("Counter value:", number);
            
            const owner_address = stack.readAddress();
            console.log("Owner address:", owner_address.toString());
            
            const recent_sender = stack.readAddress();
            console.log("Recent sender:", recent_sender.toString());

            return {
                number,
                owner_address,
                recent_sender,
            };
        } catch (error) {
            console.error("Error in getData:", error);
            throw error;
        }
    }

    async getCounter(provider: ContractProvider) {
        try {
            const { stack } = await provider.get("get_contract_storage_data", []);
            return stack.readNumber();
        } catch (error) {
            console.error("Error in getCounter:", error);
            throw error;
        }
    }
} 