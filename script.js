var greeting = "hello";

var farewell = "goodbyelalalal";

var mathProblem = {
    numA: 2,
    numB: 3,
    result: 0,
    Solve: function(){
    
    this.result = this.numA + this.numB;
}
    
}

mathProblem.Solve();
console.log(mathProblem.result)

console.log(farewell)

console.log(greeting)