Ext.define('SPT.store.SPTConcernReply', {
    extend: 'Ext.data.Store',
	storeId: 'concernReply',
    model: 'SPT.model.SPTConcernReply',
    proxy: {
        type: 'jsonp',
        url : 'http://localhost:8080/dwr/jsonp/BCTAgent/createConcernComment/',
        reader: {
            type: 'json',
			root: 'reply',
			sucessfulProperty: 'successful',
			messageProperty:'reason'
        }
    }
});
	