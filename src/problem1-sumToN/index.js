// Note in the following examples below we are operating with the assumption given that
// input will always produce a result lesser than Number.MAX_SAFE_INTEGER.
// Thus we return the output without checking.

// Formula simplified solution
var sum_to_n_a = function (n) {
    return n * (n + 1) / 2
};

// Iterative solution
var sum_to_n_b = function (n) {
    var ans = 0;
    for (let i = 1; i <= n; i++) ans += i
    return ans
};

// Recursive solution
var sum_to_n_c = function (n) {
    if (n == 1) return n
    return n + sum_to_n_c(n - 1)
};

test_cases = [1, 10, 23, 888, 10000]

test_cases.forEach(testCase => {
    console.log(`------\nInput: ${testCase}\n\nto_n_a:${sum_to_n_a(testCase)}\nto_n_b:${sum_to_n_b(testCase)}\nto_n_c:${sum_to_n_c(testCase)}\n`)
})