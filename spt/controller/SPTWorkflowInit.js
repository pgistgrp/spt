Ext.define('SPT.controller.SPTWorkflowInit', {
    extend: 'Ext.app.Controller',

    stores: ['SPTWorkflows', 'SPTWorkflow', 'SPTConcerns'],
    
    models: ['SPTWorkflows', 'SPTWorkflow'],
    
    views: ['workflow.Workflow'],
    
    
    init: function() {
    	//once specific workflow is selected, get associated concerns
    	this.getSPTWorkflowStore().addListener('load',this.getConcerns, this);
    	
        this.control({
            'workflow combobox': {
            	beforerender: this.getOpenWorkflows,
            	select: this.setCurrentWorkflow,
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
	
    getConcerns: function(){
    	var concernsStore = this.getSPTConcernsStore();
    	var wfInfo = this.getCurrentWorkflowInfo();
    	
    	if (wfInfo == null){
    		this.getSelectWorkflowMsg();
    	}else{
    		var originalUrl = concernsStore.getProxy().url;
        	
        	concernsStore.getProxy().url = concernsStore.getProxy().url
        	+ wfInfo.getWorkflowId()
    		+ '/'+ wfInfo.getContextId()
    		+ '/'+ wfInfo.getActivityId();
    		
        	
        	concernsStore.load(function(records, operation, success) {
        	    console.log(records);
        	});
        	
        	concernsStore.getProxy().url = originalUrl;
    	}
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
    	
    	
	},
	
	getCurrentWorkflowInfo: function(){
    	//get current workflow
    	var workflowRecord = this.getSPTWorkflowsStore().getAt(0);
		var openWorkflowsStore = workflowRecord.openWorkflows();
		var index = openWorkflowsStore.find('selected', true);
		
		if(index == -1)
			return null;
		
		var currentWorkflow = openWorkflowsStore.getAt(index);
		var wfId = currentWorkflow.get('id');
		
		//get BCT contextid and activityid, TODO: fix assumption that brainstorm is only method
		var bctIndex = this.getSPTWorkflowStore().find('workflowId', wfId);
		var brainstormMethod = this.getSPTWorkflowStore().getAt(bctIndex);
		var cxtId = brainstormMethod.get('contextId');
		var brainstormGamesStore = brainstormMethod.pgameActivityList();
		var actId = brainstormGamesStore.getAt(0).get('activityId');
		
		Ext.define('WorkflowInfo', {
   	     config: {
   	         workflowId: wfId,
   	         contextId: cxtId,
   	         activityId: actId,
   	     },
   	     constructor: function(cfg) {
   	         this.initConfig(cfg);
   	     }
		}); 

		return new WorkflowInfo();
    },
    
    getSelectWorkflowMsg: function(){
    	return Ext.Msg.show({
            title: 'SPT Help',
            msg: 'Please select a discussion topic',
            buttons: Ext.Msg.OK
        });	
    },
    

});