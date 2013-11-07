Ext.define('SPT.store.SPTKeywords', {
    extend: 'Ext.data.Store',
	storeId: 'keywordStore',
    model: 'SPT.model.SPTKeywords',
    proxy: {
        type: 'jsonp',
        url : 'http://localhost:8080/dwr/jsonp/BCTAgent/prepareConcern/',
        reader: {
            type: 'json',
			root: 'reply'
        }
    }
});
	