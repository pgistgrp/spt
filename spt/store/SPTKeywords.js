Ext.define('SPT.store.SPTKeywords', {
    extend: 'Ext.data.Store',
	storeId: 'keywordStore',
    model: 'SPT.model.SPTKeywords',
    proxy: {
        type: 'jsonp',
        url : 'http://pgistdev.geog.uw.edu/dwr/jsonp/BCTAgent/prepareConcern/',
        reader: {
            type: 'json',
			//root: 'reply'
        }
    }
});
	