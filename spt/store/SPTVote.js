 Ext.define('SPT.model.SPTVote', {
    extend: 'Ext.data.Model',
    fields:[]//fields are empty because BCTAgent.setVoting only return whether successful or not
});


Ext.define('SPT.store.SPTVote', {
    extend: 'Ext.data.Store',
	storeId: 'voteStore',
    model: 'SPT.model.SPTVote',
    proxy: {
        type: 'jsonp',
        url : 'http://pgist.geog.uw.edu/dwr/jsonp/BCTAgent/setVoting/',
        reader: {
            type: 'json',
			//root: 'reply',
			successProperty: 'successful',
			messageProperty:'reason'
        }
    }
});
	