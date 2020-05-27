import { Client, Provider, ProviderRegistry, Result } from "@blockstack/clarity";
import { assert } from "chai";
import { readFromContract, execMethod } from "./query-utils"
import * as fs from "fs";
describe("projects tutorial test suite", () => {

  const contractKeys = JSON.parse(fs.readFileSync("./keys-contract.json").toString());
  const project1Keys = JSON.parse(fs.readFileSync("./keys-minter.json").toString());
  let client: Client;
  let provider: Provider;

  const contractKey = contractKeys.stacksAddress;
  const project1Key = project1Keys.stacksAddress;

  before(async () => {
    provider = await ProviderRegistry.createProvider();
    client = new Client(contractKey + ".projects", "projects", provider);
  });

  describe("Deploying an instance of the contract", () => {
    it("should have a valid syntax", async () => {
      await client.checkContract();
      await client.deployContract();
    });
  });

  describe("Project map tests", () => {
    it("should allow new project if tx-sender is contract owner", async () => {
      let txreceive = await execMethod(client, contractKey, "add-project", [ `'${project1Key}`, "\"http://risido.com/assets/v1\"","u5000"]);
      assert.isOk(txreceive.success, "Added project");
      const result = await readFromContract(client, "get-project", [`'${project1Key}`]);
      assert.equal(result.strings[0], "http://risido.com/assets/v1");
      assert.equal(result.strings.length, 1);
    })
    it("should allow new project if tx-sender is contract owner", async () => {
      let txreceive = await execMethod(client, contractKey, "add-project", [ `'${project1Key}`, "\"http://risido.com/assets/v1\"","u5000"]);
      assert.isOk(txreceive.success, "Added project");
      const result = await readFromContract(client, "get-project", [`'${project1Key}`]);
      assert.equal(result.strings[0], "http://risido.com/assets/v1");
      assert.equal(result.strings.length, 1);
    })
  });
  
after(async () => {
    await provider.close();
  });
});
