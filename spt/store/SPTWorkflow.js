Ext.define('SPT.store.SPTWorkflow', {
    extend: 'Ext.data.Store',
    storeId: 'activeWorkflowStore',
    model: 'SPT.model.SPTWorkflow',
    proxy: {
        type: 'jsonp',
        url : 'http://pgist.geog.uw.edu/dwr/jsonp/WorkflowAgent/getWorkflow/',
        reader: {
            type: 'json',
			//root: 'reply'
        }
    }
});
