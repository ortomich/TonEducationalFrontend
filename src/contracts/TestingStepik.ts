import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type TestingStepikConfig = {
    number: number;
    address: Address;
    owner: Address;
};

export function testingStepikConfigToCell(config: TestingStepikConfig): Cell {
    return beginCell().storeUint(config.number, 32).storeAddress(config.address).storeAddress(config.owner).endCell();
}

export class TestingStepik implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new TestingStepik(address);
    }

    static createFromConfig(config: TestingStepikConfig, code: Cell, workchain = 0) {
        const data = testingStepikConfigToCell(config);
        const init = { code, data };
        return new TestingStepik(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint, number: number) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(1, 32).storeUint(number, 32).endCell(),
        });
    }

    async sendIncrement(provider: ContractProvider, via: Sender, value: bigint, number: number) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(1, 32).storeUint(number, 32).endCell(),
        });
    }

    async sendDeposit(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(2, 32).endCell(),
        });
    }

    async sendNoCodeDeposit(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendWithdraw(provider: ContractProvider, via: Sender, value: bigint, amount: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(3, 32).storeCoins(amount).endCell(),
        });
    }

    async getData(provider: ContractProvider) {
        const { stack } = await provider.get("get_contract_storage", [])
        return {
            number: stack.readNumber(), 
            address: stack.readAddress(),
            owner: stack.readAddress()
        }
    }

    async getBalance(provider: ContractProvider) {
        const { stack } = await provider.get("balance", [])
        return {
            balance: stack.readNumber()
        }
    }

}
