Ext.define('SPT.store.SPTWorkflow', {
    extend: 'Ext.data.Store',
    storeId: 'activeWorkflowStore',
    model: 'SPT.model.SPTWorkflow',
    proxy: {
        type: 'jsonp',
        url : 'http://pgistdev.geog.washington.edu:8080/dwr/jsonp/WorkflowAgent/getWorkflow/',
        reader: {
            type: 'json',
			root: 'reply'
        }
    }
});
