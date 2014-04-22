var cascade = require('cascade-stream')

var factory = module.exports = function(opts, idfn, streamfn){

	if(typeof(opts)==='function'){
		idfn = opts
		streamfn = idfn
		opts = {}
	}

	var streams = {}

	return cascade(opts, function(chunk, add, next){
		var id = idfn(chunk)
		if(!streams[id]){
			var stream = streamfn(id)
			if(stream){
				streams[id] = stream
				add(stream)
			}
		}
		var stream = streams[id]
		if(stream){
			stream.write(chunk)
		}
		next()
	}, function(){
		Object.keys(streams || {}).forEach(function(k){
			
			streams[k].end()
			streams[k].push()
		})
	})
}

factory.obj = function(idfn, streamfn){
	return factory({
		objectMode:true
	}, idfn, streamfn)
}