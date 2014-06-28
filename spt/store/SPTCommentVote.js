 Ext.define('SPT.model.SPTCommentVote', {
    extend: 'Ext.data.Model',
    fields:[]//fields are empty because DRTAgent.setVoting only return whether successful or not
});


Ext.define('SPT.store.SPTCommentVote', {
    extend: 'Ext.data.Store',
	storeId: 'drtCommentVoteStore',
    model: 'SPT.model.SPTCommentVote',
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
	