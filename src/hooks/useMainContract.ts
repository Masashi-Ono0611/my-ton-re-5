import { useEffect, useState } from "react";
import MainContract from "../contracts/MainContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract } from "ton-core";

export function useMainContract() {
  const client = useTonClient();
  const [contractData, setContractData] = useState<null | {
    counter_value: number;
    recent_sender: Address;
    owner_address: Address;
  }>();

  const mainContract = useAsyncInitialize(async () => {
    try {
      if (!client) {
        console.log("Waiting for TonClient initialization...");
        return null;
      }
      console.log("Initializing contract...");
      const contract = new MainContract(
        Address.parse("kQDLFbb5Iv_U47ooUfPUvbW_d_UcCHhd8ZEoeETUu0RVrrbP")
      );
      console.log("Contract address:", contract.address.toString());
      return client.open(contract) as OpenedContract<MainContract>;
    } catch (error) {
      console.error("Error initializing contract:", error);
      return null;
    }
  }, [client]);

  async function getValue() {
    try {
      if (!mainContract) {
        console.log("Waiting for contract initialization...");
        return;
      }
      console.log("Getting contract data...");
      setContractData(null);
      const val = await mainContract.getData();
      console.log("Contract data received:", {
        counter_value: val.number,
        recent_sender: val.recent_sender?.toString(),
        owner_address: val.owner_address?.toString()
      });
      setContractData({
        counter_value: val.number,
        recent_sender: val.recent_sender,
        owner_address: val.owner_address,
      });
    } catch (error) {
      console.error("Error getting contract data:", error);
    }
  }

  useEffect(() => {
    getValue();
  }, [mainContract]);

  return {
    contract_address: mainContract?.address.toString(),
    ...contractData,
  };
} 