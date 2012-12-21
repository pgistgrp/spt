Ext.define('SPT.controller.SPTWorkflowInit', {
    extend: 'Ext.app.Controller',

    stores: ['SPTWorkflows'],
    
    models: ['SPTWorkflow'],
    
    views: [
            'workflow.Workflow'
        ],

    init: function() {
    	var workflowStore = this.getSPTWorkflowsStore();
    	workflowStore.load(function(records, operation, success) {
    		var record = workflowStore.getAt(0);
    		console.log(record);
    		
    		var openWorkflows = record.getAssociatedData();
    		console.log(openWorkflows);
    		
    		var ow = record.openWorkflows().getAt(0);
    		console.log(ow.get('name'));
		});
    	
        this.control({
            'viewport > panel': {
            	 renderTo: Ext.getBody()
            }
        });
    }
});