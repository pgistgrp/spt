 Ext.define('SPT.model.SPTReviewCommentVote', {
    extend: 'Ext.data.Model',
    fields:[]
});

Ext.define('SPT.store.SPTReviewCommentVote', {
    extend: 'Ext.data.Store',
	storeId: 'drtCommentVoteStore',
    model: 'SPT.model.SPTReviewCommentVote',
    proxy: {
        type: 'jsonp',
        url : 'http://localhost:8080/dwr/jsonp/DRTAgent/setVotingOnComment/',
        reader: {
            type: 'json',
			root: 'reply',
			successProperty: 'successful',
			messageProperty:'reason'
        }
    }
});
	