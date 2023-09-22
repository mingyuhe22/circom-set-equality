pragma circom 2.1.5;

include "./set_equality.circom";

template IsEqualSetFS(len){
    signal input left[len], right[len];

    var arr[len * 2];
    for(var i = 0; i < len; i++){
        arr[i] = left[i];
        arr[i + len] = right[i];
    }
    signal challenge <== Hash(len*2)(arr);
    IsEqualSet(len)(left, right, challenge);
}