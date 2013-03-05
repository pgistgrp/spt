Ext.define('SPT.store.SPTConcerns', {
    extend: 'Ext.data.Store',
	id: 'concernStore',
    model: 'SPT.model.SPTConcern',
    proxy: {
        type: 'jsonp',
        url : 'http://localhost:8080/dwr/jsonp/BCTAgent/saveConcern/',
        reader: {
            type: 'json',
			root: 'reply'
        }
    }
});
	