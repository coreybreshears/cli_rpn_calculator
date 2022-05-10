describe("CliRpnCalculator", () => {
  const CliRpnCalculator = require("../lib/CliRpnCalculator");

  let cliRpnCalculator;

  beforeEach(() => {
    cliRpnCalculator = new CliRpnCalculator();
  });

  describe("each function of _operations should return correct values", () => {
    test("add function should work well", () => {
      const add = cliRpnCalculator._operations["+"].func;

      expect(add(3, 5)).toBe(8);
    });

    test("minus function should work well", () => {
      const minus = cliRpnCalculator._operations["-"].func;

      expect(minus(3, 5)).toBe(-2);
    });

    test("muliply function should work well", () => {
      const multiply = cliRpnCalculator._operations["*"].func;

      expect(multiply(3, 5)).toBe(15);
    });

    test("divide function should work well", () => {
      const divide = cliRpnCalculator._operations["/"].func;

      expect(divide(3, 5)).toBe(3 / 5);
    });
  });

  describe("_isOperator() should return correct values", () => {
    test("return true for valid operators", () => {
      expect(cliRpnCalculator._isOperator("+")).toBe(true);
      expect(cliRpnCalculator._isOperator("-")).toBe(true);
      expect(cliRpnCalculator._isOperator("/")).toBe(true);
      expect(cliRpnCalculator._isOperator("*")).toBe(true);
    });

    test("return false for invalid operators", () => {
      expect(cliRpnCalculator._isOperator("@")).toBe(false);
      expect(cliRpnCalculator._isOperator("#")).toBe(false);
    });
  });

  describe("_operate() should return correct values", () => {
    test("+ returns correct value", () => {
      expect(cliRpnCalculator._operate("+", 3, 5)).toBe(8);
    });

    test("- returns correct value", () => {
      expect(cliRpnCalculator._operate("-", 3, 5)).toBe(-2);
    });

    test("* returns correct value", () => {
      expect(cliRpnCalculator._operate("*", 3, 5)).toBe(15);
    });

    test("/ returns correct value", () => {
      expect(cliRpnCalculator._operate("/", 3, 5)).toBe(3 / 5);
    });
  });

  describe("_validateLine() should work well", () => {
    test("work well for valid params", () => {
      let response;

      try {
        response = cliRpnCalculator._validateLine(["3", "5", "-"]);
      } catch (error) {
        response = error;
      }

      expect(response).not.toBeInstanceOf(Error);
    });

    test("raise `Invalid operands or operators` error for invalid params", () => {
      let response;

      try {
        response = cliRpnCalculator._validateLine(["3", "5", "@"]);
      } catch (error) {
        response = error;
      }

      expect(response).toBeInstanceOf(Error);
      expect(response.message).toBe("Invalid operands or operators");
    });
  });

  describe("_ensureCanOperateNow() should work well", () => {
    test("work well for valid params", () => {
      let response;

      try {
        response = cliRpnCalculator._ensureCanOperateNow(["3", "5"], "-");
      } catch (error) {
        response = error;
      }

      expect(response).not.toBeInstanceOf(Error);
    });

    test("raise `Does not have enough operands to do operate` error for invalid params", () => {
      let response;

      try {
        response = cliRpnCalculator._ensureCanOperateNow(["3", "5"], "@");
      } catch (error) {
        response = error;
      }

      expect(response).toBeInstanceOf(Error);
      expect(response.message).toBe(
        "Does not have enough operands to do operate"
      );
    });
  });

  describe("eval() should work well", () => {
    test("work well for input lines of single params", () => {
      expect(cliRpnCalculator.eval("3")).toBe(3);
      expect(cliRpnCalculator.eval("5")).toBe(5);
      expect(cliRpnCalculator.eval("+")).toBe(8);
      expect(cliRpnCalculator.eval("2")).toBe(2);
      expect(cliRpnCalculator.eval("/")).toBe(8 / 2);
    });

    test("work well for input lines of multiple params", () => {
      expect(cliRpnCalculator.eval("3 5 2 +")).toBe(7);
      expect(cliRpnCalculator.eval("5 -")).toBe(2);
      expect(cliRpnCalculator.eval("/")).toBe(3 / 2);
    });

    test("raise `Invalid operands or operators` error for invalid lines", () => {
      let response;

      try {
        response = cliRpnCalculator.eval("3 5 @");
      } catch (error) {
        response = error;
      }

      expect(response).toBeInstanceOf(Error);
      expect(response.message).toBe("Invalid operands or operators");
    });

    test("raise `Does not have enough operands to do operate` error when there is not enough operands to do operate", () => {
      let response;

      try {
        response = cliRpnCalculator.eval("3 5 - +");
      } catch (error) {
        response = error;
      }

      expect(response).toBeInstanceOf(Error);
      expect(response.message).toBe(
        "Does not have enough operands to do operate"
      );
    });

    test("raise `Invalid Operation Error: Infinity error` error for Infinity values", () => {
      let response;

      try {
        response = cliRpnCalculator.eval("3 0 /");
      } catch (error) {
        response = error;
      }

      expect(response).toBeInstanceOf(Error);
      expect(response.message).toBe("Invalid Operation Error: Infinity error");
    });
  });

  describe("clear() should work well", () => {
    test("clear numberStack", () => {
      cliRpnCalculator._numberStack = [1, 3, 5];
      cliRpnCalculator.clear();

      expect(cliRpnCalculator._numberStack.length).toBe(0);
    });
  });

  describe("_ensureTheResultIsValidNumber() should work well", () => {
    test("work well for valid result", () => {
      let response;

      try {
        response = cliRpnCalculator._ensureTheResultIsValidNumber(123);
      } catch (error) {
        response = error;
      }

      expect(response).not.toBeInstanceOf(Error);
    });

    test("raise `Invalid Operation Error: Infinity error` error for Infinity values", () => {
      let response;

      try {
        response = cliRpnCalculator._ensureTheResultIsValidNumber(Infinity);
      } catch (error) {
        response = error;
      }

      expect(response).toBeInstanceOf(Error);
      expect(response.message).toBe("Invalid Operation Error: Infinity error");
    });

    test("raise `Invalid Operation Error: Not a number` error for invalid result", () => {
      let response;

      try {
        response = cliRpnCalculator._ensureTheResultIsValidNumber("a");
      } catch (error) {
        response = error;
      }

      expect(response).toBeInstanceOf(Error);
      expect(response.message).toBe("Invalid Operation Error: Not a number");
    });
  });
});
