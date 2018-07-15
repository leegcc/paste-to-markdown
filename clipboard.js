const spawn = require("child_process").spawn;

function getClipboardHtml(callback) {
  const child = spawn("powershell.exe", [
    "Get-Clipboard",
    "-TextFormatType",
    "Html"
  ]);
  let stdouts = [];
  child.stdout.on("data", function(data) {
    stdouts.push(data);
  });
  child.on("close", function(data) {
    const regex = /<!--StartFragment-->(.*)<!--EndFragment-->/;
    const match = regex.exec(stdouts.join(""));
    if (match !== null) {
      callback(null, match[1]);
    }
  });
  child.stdin.end();
}

module.exports = {
  getClipboardHtml
};
