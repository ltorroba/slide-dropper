var path = require('path')
var fs = require('fs');
var scissors = require('scissors');
var argv = require('minimist')(process.argv.slice(2));
var extract = require('pdf-text-extract')

// Usage: node index.js input.pdf -o output.pdf
var filePath = path.join(__dirname, argv._[0])
var outPath = path.join(__dirname, argv.o)

extract(filePath, function (err, pages) {
  if (err) {
    console.dir(err)
    return
  }

  selected = []
  for(var i = 0; i < pages.length; i++) {
    curr_words = pages[i].split(' ')
    curr = parseInt(curr_words[curr_words.length - 1].replace('\n', ''))

    if(i + 1 < pages.length) {
      next_words = pages[i + 1].split(' ')
      next = parseInt(next_words[next_words.length - 1].replace('\n', ''))
      if(curr < next)
        selected.push(i + 1)
    } else {
      selected.push(i + 1)
    }
  }

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
