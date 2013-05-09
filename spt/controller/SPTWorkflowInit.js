Ext.define('SPT.controller.SPTWorkflowInit', {
    extend: 'Ext.app.Controller',

    stores: ['SPTWorkflows', 'SPTWorkflow'],
    
    models: ['SPTWorkflows', 'SPTWorkflow'],
    
    views: ['workflow.Workflow'],
    
    init: function() {
    	
        this.control({
            'viewport > workflow combobox': {
            	beforerender: this.getOpenWorkflows,
            	select: this.setCurrentWorkflow
            }
        });
    },

	getOpenWorkflows: function(combobox){
		var workflowStore = this.getSPTWorkflowsStore();
    	workflowStore.load(function(records, operation, success) {
    		var record = workflowStore.getAt(0);
    		var openWorkflowsStore = record.openWorkflows();
    		combobox.store = openWorkflowsStore;
    	});
		
	},
    
    setCurrentWorkflow: function(combobox){
    	//switch user's current workflow by changing selected status
    	var store = combobox.store; //actually SPTWorkflowsStore
    	var id = store.find('selected', true);
    	
    	//if none previously selected index will be -1
    	if(id != -1){
    		var previousCurrentWorkflow = store.getAt(id);
    		previousCurrentWorkflow.set('selected', false);
    	}
    	
    	//set new current workflow
    	var rec = combobox.findRecord(
    	        combobox.valueField || combobox.displayField,
    	        combobox.getValue()
    	    );
    	rec.set('selected', true);
    	
    	//load entire workflow sequence for selected workflow
    	var activeWorkflowStore = this.getSPTWorkflowStore();
    	var originalUrl = activeWorkflowStore.getProxy().url; //workaround: temp variable for storing proxy url without param
    	activeWorkflowStore.getProxy().url = activeWorkflowStore.getProxy().url + rec.get('id');
    	activeWorkflowStore.load(function(records, operation, success) {
    		console.log(records);
    	});
    	
    	activeWorkflowStore.getProxy().url = originalUrl; //reset url to remove parameter
	}
});