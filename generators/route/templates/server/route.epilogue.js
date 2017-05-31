import {AbstractEpilogueRoute, epilogue, sequelize} from 'scaffi-server-core';

class <%= className %> extends AbstractEpilogueRoute {
	setup(){
		
		// Create REST resource
		var <%= className %>Resource = epilogue.get().resource({
			model: sequelize.get().<%= className %>,
			endpoints: ['/api/<%= routePath %>', '/api/<%= routePath %>/:id']
		});
	
		/*
		// If you need to do a full data pull without pagination
		<%= className %>Resource.list.fetch.before(function(req, res, context){
			req.query.count = 10000;
			return context.continue;
		});
		*/
		
		this.set(<%= className %>Resource);
		
	}
}

export default new <%= className %>();
