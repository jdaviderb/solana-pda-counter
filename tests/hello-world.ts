import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { HelloWorld } from "../target/types/hello_world";
import assert from 'assert';

describe("hello-world", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  const keyPair = anchor.web3.Keypair.generate(); 
  anchor.setProvider(provider);

  const program = anchor.workspace.HelloWorld as Program<HelloWorld>;

  it("Is initialized!", async () => {

    const [counterAccount, _] = await anchor.web3.PublicKey.findProgramAddress(
      [keyPair.publicKey.toBuffer(), Buffer.from("counter")],
      program.programId
    );

    await provider.connection.confirmTransaction(
      await (provider.connection.requestAirdrop(keyPair.publicKey, 1_000_000_000))
    )

    await program.rpc.initialize({
      accounts: {
        counterAccount: counterAccount,
        user: keyPair.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [keyPair]
    });
    const account = await program.account.counterAccount.fetch(counterAccount);

    assert.ok(account.init);

  });

  it("increment", async () => {

    const [counterAccount, _] = await anchor.web3.PublicKey.findProgramAddress(
      [keyPair.publicKey.toBuffer(), Buffer.from("counter")],
      program.programId
    );

    await provider.connection.confirmTransaction(
      await (provider.connection.requestAirdrop(keyPair.publicKey, 1_000_000_000))
    )

    await program.rpc.increment({
      accounts: {
        counterAccount: counterAccount,
        user: keyPair.publicKey
      },

      signers: [keyPair]
    });

    await program.rpc.increment({
      accounts: {
        counterAccount: counterAccount,
        user: keyPair.publicKey
      },

      signers: [keyPair]
    });

    const account = await program.account.counterAccount.fetch(counterAccount);
    assert.equal(account.counter, 2);

  });

  it("decrement", async () => {

    const [counterAccount, _] = await anchor.web3.PublicKey.findProgramAddress(
      [keyPair.publicKey.toBuffer(), Buffer.from("counter")],
      program.programId
    );

    await provider.connection.confirmTransaction(
      await (provider.connection.requestAirdrop(keyPair.publicKey, 1_000_000_000))
    )

    await program.rpc.decrement({
      accounts: {
        counterAccount: counterAccount,
        user: keyPair.publicKey
      },

      signers: [keyPair]
    })

    const account = await program.account.counterAccount.fetch(counterAccount);

    // counter should be 1 because in the previous test, the counter was incremented by 2
    assert.equal(account.counter, 1);
  });
});
