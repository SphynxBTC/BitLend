
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.5.4/index.ts';
import { assertEquals } from 'https://deno.land/std@0.170.0/testing/asserts.ts';

const xBTC = "xBTC";
const xUSD = "xUSD";
const LendingPool = "LendingPool";


Clarinet.test({
    name: "Ensure that <...>",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        // arrange: set up the chain, state, and other required elements

        let deployer = accounts.get("deployer")!;
        let wallet_1 = accounts.get("wallet_1")!;

        const toPrincipal = (contractName: string) =>
        `${deployer.address}.${contractName}`;

        // act: perform actions related to the current test
        let block = chain.mineBlock([
            Tx.contractCall(xBTC, "mint", [types.uint(1), types.principal(wallet_1.address)], deployer.address),
            Tx.contractCall(xUSD, "mint", [types.uint(1000), types.principal(wallet_1.address)], deployer.address),
            Tx.contractCall(LendingPool, "deposit", [types.principal(toPrincipal(xBTC)), types.uint(1)], wallet_1.address)
        ]);

        // assert: review returned data, contract state, and other requirements
        assertEquals(block.receipts.length, 0);
        assertEquals(block.height, 2);
    },
});
