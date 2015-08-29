 Ext.define('SPT.model.SPTCommentVote', {
    extend: 'Ext.data.Model',
    fields:[]//fields are empty because BCTAgent.setVoting only return whether successful or not
});


Ext.define('SPT.store.SPTCommentVote', {
    extend: 'Ext.data.Store',
	storeId: 'commentVoteStore',
    model: 'SPT.model.SPTCommentVote',
    proxy: {
        type: 'jsonp',
        url : 'http://pgist.geog.uw.edu/dwr/jsonp/BCTAgent/setConcernCommentVoting/',
        reader: {
            type: 'json',
			//root: 'reply',
			successProperty: 'successful',
			messageProperty:'reason'
        }
    }
});
	