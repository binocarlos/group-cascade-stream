var cascade = require('cascade-stream')

var factory = module.exports = function(opts, idfn, streamfn){

	if(typeof(opts)==='function'){
		idfn = opts
		streamfn = idfn
		opts = {}
	}

	var streams = {}

	return cascade(opts, function(chunk, add, cb){
		var id = idfn(chunk)		
		if(!id){
			return cb()
		}
		if(!streams[id]){
			streams[id] = streamfn(id)
			if(streams[id]){
				add(streams[id])
			}
		}
		var stream = streams[id]
		if(stream){
			stream.write(chunk)
		}
		cb()
	})
}

factory.obj = function(idfn, streamfn){
	return factory({
		objectMode:true
	}, idfn, streamfn)
}