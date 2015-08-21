Ext.define('SPT.store.SPTConcernReplies', {
    extend: 'Ext.data.Store',
	storeId: 'concernRepliesStore',
    model: 'SPT.model.SPTConcernReplies',
    pageSize: 100,
    proxy: {
        type: 'jsonp',
        url : 'http://pgistdev.geog.uw.edu/dwr/jsonp/BCTAgent/getConcernComments/',
        reader: {
            type: 'json',
			//root: 'reply',
			successProperty: 'successful',
			messageProperty:'reason'
        }
    }
});


	