Ext.define('SPT.controller.SPTWorkflowInit', {
    extend: 'Ext.app.Controller',

    stores: ['SPTWorkflows'],
    
    models: ['SPTWorkflows'],
    
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
    	var store = combobox.store;
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
	}
});