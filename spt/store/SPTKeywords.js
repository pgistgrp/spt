Ext.define('SPT.store.SPTKeywords', {
    extend: 'Ext.data.Store',
	id: 'keywordStore',
    model: 'SPT.model.SPTKeyword',
    proxy: {
        type: 'jsonp',
        url : 'http://localhost:8080/dwr/jsonp/BCTAgent/prepareConcern/documentation',
        reader: {
            type: 'json',
			root: 'reply'
        }
    }
});
	