import { useEffect, useState } from "react";
import { Address, toNano } from "ton-core";
import { MainContract } from "../contracts/MainContract";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import { useAsyncInitialize } from "./useAsyncInitialize";

export function useMainContract() {
  const client = useTonClient();
  const [val, setVal] = useState<number | null>();
  const { sender } = useTonConnect();
  
  const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

  const mainContract = useAsyncInitialize(async () => {
    if (!client) return;
    console.log("Initializing contract...");
    const contract = new MainContract(
      Address.parse("EQDLFbb5Iv_U47ooUfPUvbW_d_UcCHhd8ZEoeETUu0RVrg1F")
    );
    console.log("Contract address:", contract.address.toString());
    return client.open(contract);
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!mainContract) return;
      console.log("Fetching contract data...");
      setVal(null);
      try {
        const data = await mainContract.getData();
        console.log("Contract data:", data);
        setVal(Number(data.number));
        await sleep(5000);
        getValue();
      } catch (error) {
        console.error("Error fetching contract data:", error);
        await sleep(5000);
        getValue();
      }
    }
    getValue();
  }, [mainContract]);

  return {
    value: val,
    address: mainContract?.address.toString(),
    sendIncrement: () => {
      return mainContract?.sendIncrement(sender, toNano('0.05'), 1);
    },
  };
} 