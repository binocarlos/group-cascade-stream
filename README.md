group-cascade-stream
====================

[![NPM](https://nodei.co/npm/group-cascade-stream.png?global=true)](https://nodei.co/npm/group-cascade-stream/)

[![Travis](http://img.shields.io/travis/binocarlos/group-cascade-stream.svg?style=flat)](https://travis-ci.org/binocarlos/group-cascade-stream)

A cascade stream that groups created streams by a chunk id

## example

```js
var from = require('from2-array')
var through = require('through2')
var cascade = require('group-cascade-stream')

var coeffs = {
	a:2,
	b:5,
	c:10
}

// create a stream for a single letter
function createLetterStream(letter){
	var coeff = coeffs[letter]
	return through.obj(function(chunk, enc, cb){
		var num = parseFloat(chunk.replace(/\D/g, ''))
    this.push(num * coeff)
    cb()
	})
}

var source = from.obj(['a1', 'b3', 'a4', 'c3', 'c8', 'b5'])

var splitter = cascade(function(chunk){
	// return just 'a' for the id
	return chunk.toString().charAt(0)
}, function(id){
	return createLetterStream(id)
})

var sink = through.obj(function(chunk, enc, cb){
	console.log(chunk);
	cb()
})

source.pipe(splitter).pipe(sink)

/*

	2 		(a1 -> 1 * 2)
	15		(b3 -> 3 * 5)
	8			(a4 -> 4 * 2)
	30		(c3 -> 3 * 10)
	80		(c8 -> 8 * 10)
	25		(b5 -> 5 * 5)

*/
```

## license

MIT