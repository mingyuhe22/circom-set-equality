const path = require("path");
const wasm_tester = require("circom_tester").wasm;
const fs = require("fs");
const circuit_name = "permutation";
const len = 100;

describe(`Test "${circuit_name}"`, function () {
    this.timeout(100000);
    before(async () => {
        if (!fs.existsSync(path.join(__dirname, "../build")))
            fs.mkdirSync(path.join(__dirname, "../build"));
        if (!fs.existsSync(path.join(__dirname, `../build/${circuit_name}`)))
            fs.mkdirSync(path.join(__dirname, `../build/${circuit_name}`));
        fs.writeFileSync(path.join(__dirname, `../build/${circuit_name}/circuit.circom`),
            `pragma circom 2.1.5;` + "\n" +
            `include "../../circuits/permutation.circom";` + "\n" +
            "\n" +
            `component main = CheckPermutation(7, [0, 1, 0, 1, 1, 0, 2]);`
        );
    });

    it("Wtns Check", async function () {

        const circuit = await wasm_tester(
            path.join(__dirname, `../build/${circuit_name}/circuit.circom`),
            {
                output: path.join(__dirname, `../build/${circuit_name}`),
            }
        );
        var r = Math.floor(Math.random() * 1000).toString();
        var s = Math.floor(Math.random() * 1000).toString();
        const w = await circuit.calculateWitness({ a: ["111", "222", "333", "444", "555", "666", "777"], b: ["666", "555", "111", "222", "444", "333", "777"], r, s });
        await circuit.checkConstraints(w);
    });
});