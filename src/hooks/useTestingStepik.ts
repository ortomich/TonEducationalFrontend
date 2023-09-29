import { useEffect, useState } from "react";
import { TestingStepik } from "../contracts/TestingStepik";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract } from "ton-core";
import { toNano } from "ton-core";
import { useTonConnect } from "./useTonConnect";

export function useTestingStepik() {
  const client = useTonClient();
  const { sender } = useTonConnect();

  const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

  const [contractData, setContractData] = useState<null | {
    counter_value: number;
    recent_sender: Address;
    owner_address: Address;
  }>();

  const [balance, setBalance] = useState<null | number>(0);

  const testingStepik = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new TestingStepik(
      Address.parse("EQBV3auVEkdgQdxCCLKDq2raeLNq9eTwc7ZqvkuVdPzQ1Mrk") // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<TestingStepik>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!testingStepik) return;
      setContractData(null);
      const val = await testingStepik.getData();
      const { balance } = await testingStepik.getBalance();
      setContractData({
        counter_value: val.number,
        recent_sender: val.address,
        owner_address: val.owner,
      });
      setBalance(balance);
      await sleep(5000); // sleep 5 seconds and poll value again
      getValue();
    }
    getValue();
  }, [testingStepik]);

  return {
    contract_address: testingStepik?.address.toString(),
    contract_balance: balance,
    ...contractData,
    sendIncrement: () => {
      return testingStepik?.sendIncrement(sender, toNano(0.05), 13);
    },
    sendDeposit: () => {
      return testingStepik?.sendDeposit(sender, toNano(0.1));
    },
    sendWithdraw: () => {
      return testingStepik?.sendWithdraw(sender, toNano(0.05), toNano(0.07));
    },
  };
}