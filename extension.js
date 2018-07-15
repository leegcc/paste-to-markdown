const vscode = require("vscode");
const getClipboardHtml = require("./clipboard").getClipboardHtml;
const htmlToMarkdown = require("./html-to-markdown");

function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "extension.pasteToMarkdown",
    function() {
      getClipboardHtml(function(err, html) {
        if (err) {
          console.error(err);
          return;
        }

        if (html === "") {
          return;
        }

        let selection = vscode.window.activeTextEditor.selection;
        let position = new vscode.Position(
          selection.start.line,
          selection.start.character
        );
        vscode.window.activeTextEditor.edit(function(edit) {
          var markdown = htmlToMarkdown(html);
          edit.insert(position, markdown);
        });
      });
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;
