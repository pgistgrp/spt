Ext.define('SPT.store.SPTConcerns', {
    extend: 'Ext.data.Store',
	storeId: 'allConcernsStore',
    model: 'SPT.model.SPTConcerns',
    proxy: {
        type: 'jsonp',
        url : 'http://localhost:8080/dwr/jsonp/BCTAgent/getContextConcerns/',
        reader: {
            type: 'json',
			root: 'reply'
        }
    }
});
	