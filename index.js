var path = require('path')
var fs = require('fs');
var scissors = require('scissors');
var argv = require('minimist')(process.argv.slice(2));
var extract = require('pdf-text-extract')

// Usage: node index.js input.pdf -o output.pdf
var filePath = path.join(__dirname, argv._[0])
var outPath = path.join(__dirname, argv.o)
var trimEnd = argv.t || 0; // Use flag -te <number> to supply number of characters from end of page to trim
var verbose = argv.v || false;

log("Verbose mode enabled.")
log("Input file: " + filePath)
log("Output file: " + outPath)
log("Characters trimmed: " + trimEnd)

extract(filePath, function (err, pages) {
  if (err) {
    console.dir(err)
    return
  }

  selected = []
  for(var i = 0; i < pages.length; i++) {
    curr = extractPageNumber(pages[i])

    if(i + 1 < pages.length) {
      next = extractPageNumber(pages[i + 1])

      if(curr < next) {
        selected.push(i + 1)
      }
    } else {
      selected.push(i + 1)
    }
  }

  log("Selected slides: " + selected)

  var pdf = scissors(filePath)
    .pages(selected)
    .pdfStream()
    .pipe(fs.createWriteStream(outPath))
    .on('finish', function(){
       console.log("We're done!");
    }).on('error',function(err){
       throw err;
    });
})

function extractPageNumber(page) {
  var contents = page.substring(0, page.length - trimEnd)
  var curr_words = contents.split(' ')
  var curr = curr_words[curr_words.length - 1].replace('\n', '')
  return parseInt(curr);
}

function log(message) {
  if(verbose)
    console.log(message)
}
