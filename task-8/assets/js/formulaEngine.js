// formulaEngine.js
class FormulaEngine {
    static compute(func, values) {
        const nums = values.map(v => parseFloat(v)).filter(n => !isNaN(n));
        switch (func) {
            case "sum": return nums.reduce((a, b) => a + b, 0);
            case "min": return Math.min(...nums);
            case "max": return Math.max(...nums);
            case "avg": return nums.reduce((a, b) => a + b, 0) / nums.length;
            case "count": return nums.length;
        }
    }
}
