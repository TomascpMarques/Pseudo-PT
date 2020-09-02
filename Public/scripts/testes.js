var variables = {
    aaa: 34,
    bbb: 45,
};
var test = '("Hi there %s %s")% (aaa, bbb)';
var args = test.split(/%\s{1,}/gm);
args[0] = args[0].slice(2, -2);
args[1] = args[1].replace(/\s/gm, '').slice(1, -1).split(',');

for (x in args[1]) {
    console.log(args[1][x])
    args[0] = args[0].replace(/%s/, variables[args[1][x]])
};

console.log(args);

var xyz = {
    one: 1,
    two: 2,
    three: 3
};
var four = 4;
xyz.four = four;
// Ou xyz[four] = four;

console.log(xyz);