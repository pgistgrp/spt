Ext.define('SPT.view.workflow.Workflow' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.workflow',
    itemId: 'workflowPanel',
    
    requires: 
    ['Ext.form.Panel'],
    

initComponent: function() {
	//create all view-global stores needed first, workflowsStore has to be assigned to combobox
	var workflowsStore = Ext.create('SPT.store.SPTWorkflows'); //all open workflows
	var workflowStore = Ext.create('SPT.store.SPTWorkflow'); //active workflow
	
	//once specific workflow is selected & loaded, get associated concerns
	workflowStore.addListener('load',this.getConcerns, this);

	var concernsStore = Ext.create('SPT.store.SPTConcerns');
	Ext.create('SPT.store.SPTKeywordSummary');
	//once concerns loaded get keyword summary
	concernsStore.addListener('load', this.getKeywordSummary, this);
	
	this.items = [{
	     xtype: 'form',
	     itemId: 'workflowForm',
	     padding: '5 5 0 5',
	     border: false,
	     frame: true,
	     height:50,
	     width:500,
	     items: [{
			xtype: 'combobox',
			itemId:'workflowCombobox',
			fieldLabel: 'Choose a discussion topic:',
			labelWidth: 150,
			labelStyle: 'color: #15428b; font-size: 12px;',
			width:400,
			displayField: 'name',
			valueField: 'id',
			store: workflowsStore,
			queryMode: 'local',
			forceSelection: true,
			lastQuery: '',
			listeners:{
					scope: this,
		         	beforerender: this.getOpenWorkflows,
		         	change: this.setCurrentWorkflow
		    }
	     }]
	 }];
	

    this.callParent(arguments);
},


getDefaultWorkflow: function(){
	//try to get app context from request - 
	var defaultWorkflow;
	var appContext;
	var queryString = window.location.search.substring(1);
	var parameterName = 'app' + "=";
	  	if ( queryString.length > 0 ) {
	  		begin = queryString.indexOf ( parameterName );
	  		if ( begin != -1 ) {
	  			begin += parameterName.length;
	  			end = queryString.indexOf ( "&" , begin );
	  			if ( end == -1 ) {
	  				end = queryString.length
	  			}
	  		appContext = unescape(queryString.substring(begin, end));
	     }
	  } else
		  appContext = null;
	  	
	 if (appContext != null){
		var mappingStore = Ext.create('SPT.store.WorkflowMapping');
		var wfIndex = mappingStore.find('key', appContext);
		var mapping = mappingStore.getAt(wfIndex);
		return defaultWorkflow = mapping.get('value');
	} else
		return defaultWorkflow = 'CyberGIS Gateway';
	
},


getOpenWorkflows: function(combobox){
	
	var workflowStore = Ext.data.StoreManager.lookup('workflowStore');
	
	var defaultWorkflow = this.getDefaultWorkflow(); //check request for app parameter from Gateway
	workflowStore.load(function(records, operation, success) {
		var record = workflowStore.getAt(0);
		var openWorkflowsStore = record.openWorkflows();
		combobox.store = openWorkflowsStore;
		
		console.log('loadopenwf');
		
		//after load set default selection
		var wfIndex = combobox.store.find('name', defaultWorkflow);
		combobox.select(combobox.store.data.items[wfIndex]);
		
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
	
	//close replies tab if visible bc user must select new feedback when workflow changed	
	var parent = this.ownerCt;
	var brainstormPanel = parent.down('#brainstormPanel');
	
	var activeTab = brainstormPanel.getActiveTab();
	if (activeTab.getItemId() == 'replyView'){
		brainstormPanel.down('#replyButton').setDisabled(true);
		brainstormPanel.setActiveTab('feedbackForm');
	}
	
	
	//load entire workflow sequence for selected workflow
	var activeWorkflowStore = Ext.data.StoreManager.lookup('activeWorkflowStore');
		
	var originalUrl = activeWorkflowStore.getProxy().url; //workaround: temp variable for storing proxy url without param
	activeWorkflowStore.getProxy().url = activeWorkflowStore.getProxy().url + rec.get('id');
	activeWorkflowStore.load(function(records, operation, success) {
		console.log('loadactivewf');
	});
	
	activeWorkflowStore.getProxy().url = originalUrl; //reset url to remove parameter
	
},


getConcerns: function(){
	var concernsStore = Ext.data.StoreManager.lookup('allConcernsStore');
	
	var config = this.initialConfig; //getInitialConfig() method doesn't work - known bug still in ExtJS 4.2
	var parent = config.parent;
	
	var wfInfo = parent.getCurrentWorkflowInfo();
	
	if (wfInfo == null){
		this.getSelectWorkflowMsg();
	}else{
		var originalUrl = concernsStore.getProxy().url;
    	
    	concernsStore.getProxy().url = concernsStore.getProxy().url
    	+ wfInfo.getWorkflowId()
		+ '/'+ wfInfo.getContextId()
		+ '/'+ wfInfo.getActivityId();
		
    	
    	concernsStore.load(function(records, operation, success) {
    	    console.log('getconcerns');
    	});
    	
    	concernsStore.getProxy().url = originalUrl;
	}
},


getKeywordSummary: function(){
	summaryStore = Ext.data.StoreManager.lookup('SPTKeywordSummary');
	summaryStore.removeAll(false);
	
	concernsStore = Ext.data.StoreManager.lookup('allConcernsStore');
	concernsStore.clearFilter(false);
  	concernsStore.each(function(item){ 
  		var tagsStore = item.tags();
  		tagsStore.each(function(item){
  			if (summaryStore.findExact('keyword', item.get('keyword')) == -1){
  				summaryStore.add({keyword: item.get('keyword'), times: item.get('times')});
  				summaryStore.sort('times', 'DESC');
  			}
  		});
  	});
  	
},


getSelectWorkflowMsg: function(){
	return Ext.Msg.show({
        title: 'SPT Help',
        msg: 'Please select a discussion topic',
        buttons: Ext.Msg.OK
    });	
}

});