 Ext.define('SPT.model.SPTReviewComment', {
    extend: 'Ext.data.Model',
    fields:[]//fields are empty because DRTAgent.createConcern only return whether successful or not
});

Ext.define('SPT.store.SPTReviewComment', {
    extend: 'Ext.data.Store',
	storeId: 'drtCommentStore',
    model: 'SPT.model.SPTReviewComment',
    proxy: {
        type: 'jsonp',
        url : 'http://pgist.geog.uw.edu/dwr/jsonp/DRTAgent/createComment/',
        reader: {
            type: 'json',
			//root: 'reply',
			successProperty: 'successful',
			messageProperty:'reason'
        }
    }
});
	