Ext.define('SPT.store.SPTConcern', {
    extend: 'Ext.data.Store',
	storeId: 'concernStore',
    model: 'SPT.model.SPTConcern',
    proxy: {
        type: 'jsonp',
        url : 'http://localhost:8080/dwr/jsonp/BCTAgent/saveConcern/',
        reader: {
            type: 'json',
			root: 'reply',
			sucessfulProperty: 'successful',
			messageProperty:'reason'
        }
    }
});
	