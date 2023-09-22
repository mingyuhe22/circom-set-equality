pragma circom 2.1.5;

template CheckPermutation(len, rule){
    signal input a[len], b[len];
    signal input r, s;

    var assert_well_define = rule[len - 1];

    var pair_a[len], pair_b[len];
    for(var i = 0; i < len; i++){
        var idx_b = i;
        for(var j = 0 ; j < len; j++){
            if(rule[i] == rule[(i + j) % len])
                idx_b = (i + j) % len;
        }
        pair_a[i] = (r + i * s + a[i]);
        pair_b[i] = (r + idx_b * s + b[i]);
    }

    signal prod_a[len], prod_b[len];
    prod_a[0] <== pair_a[0];
    prod_b[0] <== pair_b[0];
    for (var i = 1; i < len; i++){
        prod_a[i] <== prod_a[i-1] * pair_a[i];
        prod_b[i] <== prod_b[i-1] * pair_b[i];
    }
    
    prod_a[len-1] === prod_b[len-1];
}