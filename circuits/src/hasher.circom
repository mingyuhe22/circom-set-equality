pragma circom 2.1.5;

include "../../node_modules/circomlib/circuits/poseidon.circom";

template Hash(len){
    signal input inputs[len];
    
    var floor_count = (len \ 15) + (len % 15 > 0 ? 1 : 0);
    component hasher[floor_count];
    for (var i = 0; i < floor_count; i++) {
        var width = i == floor_count - 1 ? len % 15 : 15;
        hasher[i] = Poseidon(1 + width);
        hasher[i].inputs[0] <== i == 0 ? len : hasher[i - 1].out;
        for(var j = 0; j < width; j ++)
            hasher[i].inputs[j + 1] <== inputs[i * 15 + j];
    }
    signal output out <== hasher[floor_count - 1].out;
}