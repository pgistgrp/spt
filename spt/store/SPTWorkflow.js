Ext.define('SPT.store.SPTWorkflow', {
    extend: 'Ext.data.Store',
    id: 'activeWorkflowStore',
    model: 'SPT.model.SPTWorkflow',
    proxy: {
        type: 'jsonp',
        url : 'http://localhost:8080/dwr/jsonp/WorkflowAgent/getWorkflow/',
        reader: {
            type: 'json',
			root: 'reply'
        }
    }
});
