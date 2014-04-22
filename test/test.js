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
      console.log('-------------------------------------------');
      console.log('letter: ' + letter);
      console.dir(chunk);
      var num = parseFloat(chunk.replace(/\D/g, ''))
      this.push(num * coeff)
      cb()
    }, function(){
      console.log('-------------------------------------------');
      console.log('letter end');
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
/*
test('external add', function(t) {

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
    if(chunk==8){
      pipeline.add(from.obj([100,101]))
    }
    cb()
  }, function(){

    t.equal(ends, 3)

    t.equal(results.length, s.length+2)

    t.deepEqual(results, [2,15,8,100,101,30,80,25])


    t.end()
  })

  source.pipe(pipeline).pipe(sink)
})

test('with no input', function(t) {

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

  var s = []
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

    t.equal(ends, 0)
    t.equal(results.length, s.length)

    t.end()
  })

  source.pipe(pipeline).pipe(sink)
})


test('with no streams', function(t) {

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
    //return createLetterStream(id)
  })

  var results = [];
  var sink = through.obj(function(chunk, enc, cb){
    results.push(chunk)
    cb()
  }, function(){

    t.equal(ends, 0)
    t.equal(results.length, 0)


    t.end()
  })

  source.pipe(pipeline).pipe(sink)
})*/