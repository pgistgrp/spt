Ext.define('SPT.store.SPTConcerns', {
    extend: 'Ext.data.Store',
	storeId: 'allConcernsStore',
    model: 'SPT.model.SPTConcerns',
    pageSize: 500,
    proxy: {
        type: 'jsonp',
        url : 'http://pgistdev.geog.washington.edu:8080/dwr/jsonp/BCTAgent/getContextConcerns/',
        reader: {
            type: 'json',
			root: 'reply'
        }
    }
});
	