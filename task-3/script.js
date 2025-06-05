function factorial(N){
    let fact = new Array();

    fact[0] = 1;
    let size = 1;

    for(let x = 2; x<=N;x++){
        size = multiply(fact, size, x)
    }

    fact.reverse();
    let ans = fact.join('');
    return ans;
}

function multiply(res, size, x){
    let carry = 0;

    for(let i = 0; i<size; i++){
        let product = res[i] * x + carry;

        res[i] = product % 10;

        carry = Math.floor(product / 10);
    }

    while (carry)
    {
        res[size] = carry%10;
        carry = Math.floor(carry/10);
        size++;
    }

    return size;
}

console.log(factorial(1000))