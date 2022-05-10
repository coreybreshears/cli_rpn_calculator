class CliRpnCalculatorError extends Error {
  constructor(message) {
    super(message);
  }
}

class CliRpnCalculator {
  constructor() {
    this._numberStack = [];
    this._operations = {
      "+": { paramCount: 2, func: (...num) => num[0] + num[1] },
      "-": { paramCount: 2, func: (...num) => num[0] - num[1] },
      "*": { paramCount: 2, func: (...num) => num[0] * num[1] },
      "/": { paramCount: 2, func: (...num) => num[0] / num[1] },
    };
  }

  // Check if a word is a valid operator or not
  _isOperator(word) {
    return Object.keys(this._operations).includes(word);
  }

  // Do operation using operator and operands
  _operate(operator, ...operands) {
    return this._operations[operator].func(...operands);
  }

  // Check if the input line is valid, if not throw an exception with `Invalid operands or operators` message
  _validateLine(params) {
    for (let param of params)
      if (!this._isOperator(param) && isNaN(param))
        throw new CliRpnCalculatorError("Invalid operands or operators");
  }

  // Check if there are enough operands to do operate, if not throw an exception with `Does not have enough operands to do operate` message
  _ensureCanOperateNow(numberStack, operator) {
    if (
      !(operator in this._operations) ||
      numberStack.length < this._operations[operator].paramCount
    )
      throw new CliRpnCalculatorError(
        "Does not have enough operands to do operate"
      );
  }

  _ensureTheResultIsValidNumber(result) {
    if (isNaN(result))
      throw new CliRpnCalculatorError("Invalid Operation Error: Not a number");
    if (!isFinite(result))
      throw new CliRpnCalculatorError(
        "Invalid Operation Error: Infinity error"
      );
  }

  // Clear the calculator
  clear() {
    this._numberStack = [];
  }

  // Eval operations
  eval(line) {
    const params = line.split(/[\s]+/);
    // Check if the input line is valid, if not throw an exception with `Invalid operands or operators` message
    this._validateLine(params);

    this._numberStack = params.reduce(
      (totalNumberStack, param) => {
        let newNumberToAdd = param; // Operation result to push into the stack

        // Check if a word is a valid operator or not
        if (this._isOperator(param)) {
          // Check if there are enough operands to do operate, if not throw an exception with `Does not have enough operands to do operate` message
          this._ensureCanOperateNow(totalNumberStack, param);

          // Get the operation result
          newNumberToAdd = this._operate(
            param,
            ...totalNumberStack.slice(
              totalNumberStack.length - this._operations[param].paramCount
            )
          );
          // Check if the result is a valid number, if not throw an error
          this._ensureTheResultIsValidNumber(newNumberToAdd);

          if (isFinite(newNumberToAdd))
            // Delete the numbers that was used for the operation from numberStack
            totalNumberStack = totalNumberStack.slice(
              0,
              -this._operations[param].paramCount
            );
        }

        // Push the result into the numberStack
        return [...totalNumberStack, Number(newNumberToAdd)];
      },
      [...this._numberStack] // Use the numbers in the stack of the calculator
    );

    // Return the last result
    return this._numberStack.at(-1);
  }
}

module.exports = CliRpnCalculator;
