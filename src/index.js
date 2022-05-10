var readline = require("readline");
const CliRpnCalculator = require("../lib/CliRpnCalculator");

process.stdin.setEncoding("utf-8");

var commandPrompt = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const cliRpnCalculator = new CliRpnCalculator();
let isPrevError = false;

commandPrompt.setPrompt("> ");
commandPrompt.prompt();

// Check if the line is valid, if not end the program
function ensureCanContinue(line, isPrevError) {
  if (
    line === "q" ||
    line === "Q" ||
    (isPrevError && (line === "n" || line === "N"))
  ) {
    console.log("prompt close");
    process.exit(1);
  }
}

// Ask the users if they want to continue or not (you can change the output text if you want)
function askContinueOrNot() {
  console.log("Do you want to continue? (y/n)");
}

// Check if the user want to continue or not
function handleFreezing(line, isPrevError) {
  if (!isPrevError) return true;

  if (line !== "y" && line !== "Y") {
    askContinueOrNot();
    return false;
  }

  return true;
}

// Core of this program
commandPrompt.on("line", (line) => {
  // Check if the line is valid, if not end the program
  ensureCanContinue(line, isPrevError);

  // Check if the user want to continue or not
  const canResume = handleFreezing(line, isPrevError);
  // If the user inputs invalid word, then ask again
  if (!canResume) {
    commandPrompt.prompt();
    return;
  }

  // If the user wants to continue, then start from zero
  if (isPrevError) {
    isPrevError = false;
    commandPrompt.prompt();
    return;
  }

  if (line !== "") {
    try {
      // If line is valid, then output
      const result = cliRpnCalculator.eval(line);
      console.log(result);

      isPrevError = false;
    } catch (error) {
      // If line is invalid, then ask the user to continue or not (Clear the calculator)
      console.log(error.message);
      askContinueOrNot();

      isPrevError = true;
      cliRpnCalculator.clear();
    }
  }

  commandPrompt.prompt();
});

commandPrompt.on("close", () => {
  console.log("prompt close");
});
