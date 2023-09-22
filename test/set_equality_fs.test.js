const path = require("path");
const wasm_tester = require("circom_tester").wasm;
const fs = require("fs");
const circuit_name = "set_equality_fs";
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
            `include "../../circuits/src/hasher.circom";` + "\n" +
            `include "../../circuits/set_equality_fs.circom";` + "\n" +
            "\n" +
            `component main = IsEqualSetFS(${len});`
        );
    });

    it("Wtns Check", async function () {

        const circuit = await wasm_tester(
            path.join(__dirname, `../build/${circuit_name}/circuit.circom`),
            {
                output: path.join(__dirname, `../build/${circuit_name}`),
            }
        );
        var left = [];
        var right = [];
        for (var i = 0; i < len; i++) {
            r = Math.floor(Math.random() * 1000).toString();
            left.push(r);
            right.push(r);
        }
        for (var i = 0; i < len; i++) {
            r = Math.floor(Math.random() * len);
            var tmp = right[i];
            right[i] = right[r];
            right[r] = tmp;
        }
        const w = await circuit.calculateWitness({ left, right });
        await circuit.checkConstraints(w);
    });
});