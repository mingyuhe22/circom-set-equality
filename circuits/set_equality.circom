pragma circom 2.1.5;

template IsEqualSet(len){
    signal input left[len], right[len];
    signal input challenge;

    signal prod_left[len], prod_right[len];
    prod_left[0] <== challenge + left[0];
    prod_right[0] <== challenge + right[0];
    for (var i = 1; i < len; i++){
        prod_left[i] <== prod_left[i-1] * (challenge + left[i]);
        prod_right[i] <== prod_right[i-1] * (challenge + right[i]);
    }
    
    prod_left[len-1] === prod_right[len-1];
}
