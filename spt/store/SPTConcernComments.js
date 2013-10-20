Ext.define('SPT.store.SPTConcernComments', {
    extend: 'Ext.data.Store',
	storeId: 'concernCommentsStore',
    model: 'SPT.model.SPTConcernComments',
    pageSize: 100,
    proxy: {
        type: 'jsonp',
        url : 'http://localhost:8080/dwr/jsonp/BCTAgent/getConcernComments/',
        reader: {
            type: 'json',
			root: 'reply',
			sucessfulProperty: 'successful',
			messageProperty:'reason'
        }
    }
});


	