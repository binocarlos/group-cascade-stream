var test = require('tape')

var through = require('through2')
var from = require('from2-array')
var cascade = require('../')


test('cascade streams from single input in object mode', function(t) {

  var coeffs = {
    a:2,
    b:5,
    c:10
  }

  var ends = 0
  // create a stream for a single letter
  function createLetterStream(letter){
    var coeff = coeffs[letter]
    return through.obj(function(chunk, enc, cb){
      var num = parseFloat(chunk.replace(/\D/g, ''))
      this.push(num * coeff)
      cb()
    }, function(){
      ends++
    })
  }

  var s = ['a1', 'b3', 'a4', 'c3', 'c8', 'b5']
  var source = from.obj(s)

  var pipeline = cascade.obj(function(chunk){
    // return just 'a' for the id
    return chunk.toString().charAt(0)
  }, function(id){
    return createLetterStream(id)
  })

  var results = [];
  var sink = through.obj(function(chunk, enc, cb){
    results.push(chunk)
    cb()
  }, function(){

    t.equal(ends, 3)
    t.equal(results.length, s.length)

    t.deepEqual(results, [2,15,8,30,80,25])


    t.end()
  })

  source.pipe(pipeline).pipe(sink)
})