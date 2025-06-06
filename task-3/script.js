function factorial(N){
    let fact = new Array();

    fact[0] = 1;
    let size = 1;

    for(let x = 2; x<=N;x++){
        size = multiply(fact, size, x)
    }
    
    let ans = fact[fact.length-1].toString();
    for(let i = fact.length - 2; i>=0; i--){
        ans+=fact[i].toString().padStart(4,'0')
    }
    
    console.log(fact.length)
    console.log(ans.length)
    return ans;
}

function multiply(res, size, x){
    let carry = 0;
    let base = 10000;

    for(let i = 0; i<size; i++){
        let product = res[i] * x + carry;

        res[i] = product % base;

        carry = Math.floor(product / base);
    }

    while (carry) 
    {
        res[size] = carry%base;
        carry = Math.floor(carry/base);
        size++;
    }

    return size;
}

console.time("Time");

const ans = factorial(1000)

console.timeEnd("Time");

console.log(ans)
