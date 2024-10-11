const fs = require("fs");
const JsConfuser = require("js-confuser");

// Read the list of files and ignore options from obfuscatelist.txt
const fileListPath = "obfuscatelist.txt";
fs.readFile(fileListPath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading obfuscatelist.txt:", err);
    return;
  }

  // Split the file into an array of file names and ignore line options
  const fileEntries = data.split(/\r?\n/).filter(Boolean);

  // Process each entry
  fileEntries.forEach((entry) => {
    // Split the entry into file name, linesToIgnoreTop, and linesToIgnoreBottom
    const [fileName, linesToIgnoreTop, linesToIgnoreBottom] = entry.split(" ");

    // Convert the linesToIgnoreTop and linesToIgnoreBottom to integers
    const topLinesCount = parseInt(linesToIgnoreTop, 10) || 0;  // Default to 0 if not provided
    const bottomLinesCount = parseInt(linesToIgnoreBottom, 10) || 0;  // Default to 0 if not provided

    // Read the content of the JavaScript file
    fs.readFile(fileName, "utf8", (err, jsSource) => {
      if (err) {
        console.error(`Error reading file ${fileName}:`, err);
        return;
      }

      // Split the content into lines
      const fileLines = jsSource.split(/\r?\n/);

      // Extract the lines to ignore at the top and bottom
      const topLines = fileLines.slice(0, topLinesCount).join("\n");
      const bottomLines = bottomLinesCount > 0 ? fileLines.slice(-bottomLinesCount).join("\n") : "";

      // Extract the content to obfuscate (everything in between)
      const contentToObfuscate = fileLines.slice(topLinesCount, bottomLinesCount > 0 ? -bottomLinesCount : undefined).join("\n");

      // Obfuscate the middle content
      JsConfuser.obfuscate(contentToObfuscate, {
        target: "browser",
        preset: "low",
        stringEncoding: false,
      }).then(obfuscated => {
        // Combine the top, obfuscated, and bottom content
        const finalContent = `${topLines}\n${obfuscated}\n${bottomLines}`.trim();

        // Overwrite the original file with the combined content
        fs.writeFile(fileName, finalContent, (err) => {
          if (err) {
            console.error(`Error writing obfuscated file ${fileName}:`, err);
          } else {
            console.log(`Successfully obfuscated ${fileName}, with ${topLinesCount} top lines and ${bottomLinesCount} bottom lines left unobfuscated.`);
          }
        });
      }).catch(err => {
        console.error(`Error obfuscating file ${fileName}:`, err);
      });
    });
  });
});
