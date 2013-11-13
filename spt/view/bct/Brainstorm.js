Ext.define('SPT.view.bct.Brainstorm' ,{
    extend: 'Ext.tab.Panel',
    alias: 'widget.brainstorm',
    autoHeight: true,
    minHeight: 400,
    
    requires: ['Ext.form.Panel', 
               'Ext.grid.*', 
               'Ext.ux.RowExpander', 
               'Ext.form.field.Text',],
    

initComponent: function() {
	 var currentConcernId = "";
	
	 this.editing = Ext.create('Ext.grid.plugin.CellEditing');
	 this.items = [
            {
                title: 'Provide Feedback',
            	xtype: 'form',
                padding: '5 5 0 5',
                border: false,
        		collapsible: true,
        		itemId: 'feedbackForm',
        		frame: true,
        		autoHeight: true,
    			width: 350,
    			overflowY: 'auto',
        		bodyPadding: 5,
        		fieldDefaults: {
            	msgTarget: 'side',
            	labelWidth: 110
        		},
        		items: [{
            		fieldLabel: 'Please provide your comments and select at least 2 keywords/phrases or add custom keywords/phrases below',
            		name: 'feedbackTextArea',
					itemId: 'feedbackTextArea',
            		xtype: 'textareafield',
            		height:200,
    				width: 305,
            		grow: true,
            		allowBlank: false},
            		{
        		    xtype: 'hiddenfield',
        		    name: 'concernId',
        		    itemId:'concernId',
        		    value: 'new'
        		    }],
				buttons: [{
            	text: 'Continue',
            	action: 'getkeywords',
            	itemId: 'continueBtn'
            	}]
       		},
       		{
       			title: 'View Feedback',
       			xtype: 'grid',
       			selType: 'cellmodel',
       			itemId: 'feedbackView',
       			store: Ext.data.StoreManager.lookup('SPTConcerns'),
       			height: 400, //need to define a height so that grid scrolls
       		    width: 350,
       		    forceFit: true,
       		    dockedItems: [{
                    xtype: 'toolbar',
                    items: [
						{icon: './resources/icons/Modify.gif',
						itemId: 'editButton',
						scope: this,
						tooltip: 'Edit Feedback',
						handler: this.onFeedbackEditClick,
						disabled: true},
                    	{icon: './resources/icons/Cancel.gif',
                    	itemId: 'deleteButton',
                        scope: this,
                        tooltip: 'Delete Feedback',
                        handler: this.onDeleteClick,
                    	disabled: true},
                    	{icon: './resources/icons/View.gif',
                    	itemId: 'replyButton',
                        scope: this,
                        tooltip: 'View Replies',
                        handler: this.onReplyClick,
                        disabled: true}
                    	]
          		    }],
       		    columns: [
       		        { text: 'Contributor', dataIndex: 'author'}, 
       		        { text: 'Date', dataIndex: 'createTime', xtype: 'datecolumn',   format:'m/d/y h:iA'},
       		        { text: 'Keywords', dataIndex: 'id', renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
       		        	var keywords = new Array();
       		        	var tagsStore = record.tags();
       		        	for ( var i = 0; i < tagsStore.getCount(); i++) {
       						var tag = tagsStore.getAt(i);
       		        		var keyword = tag.get('keyword');
       		        		keywords[i] = keyword;
       					}
       		        	return keywords.toString();
       		        }},
       		        {text: 'Replies', dataIndex: 'replies', renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
						return value + " ("+ record.get('views') + " views)";
					}}
       		    ],
       		    plugins: [{
       	            ptype: 'rowexpander',
       	            rowBodyTpl : [ '<p><b>Feedback:</b> {content}</p>' ]
       		    }],
       		    listeners: {
    		    	select: function(rowModel, record, rowIndex, colIndex, eOpts) {
    		    		this.down('#replyButton').setDisabled(false);
    		    		//only enable other buttons if user is author
    		    		this.down('#editButton').setDisabled(true);
    		    		this.down('#deleteButton').setDisabled(true);
    		    		
    		    		var userStore = Ext.data.StoreManager.lookup('SPTUser');
    		    		var user = userStore.getAt(0).get('username');
    		    		if(record.get('author') == user){
    		    			this.down('#editButton').setDisabled(false);
    		    			this.down('#deleteButton').setDisabled(false);
    		    		}
    		    	}}
       		},
       		{
       			title: 'Replies',
       			xtype: 'grid',
       			selModel: {
       				selType: 'cellmodel',
       			    mode: 'SINGLE',
       			    allowDeselect: true
       			},
       			itemId: 'replyView',
       			hidden: true,
       			store: Ext.data.StoreManager.lookup('SPTConcernReplies'),
       			height: 400, //need to define a height so that grid scrolls
       		    width: 350,
       		    forceFit: true,
       		    dockedItems: [{
                 xtype: 'toolbar',
                 items: [{
                	 icon: './resources/icons/Create.gif',
                	 tooltip: 'Post Reply',
                     scope: this,
                     handler: this.onAddClick
                 	},
                 	{icon: './resources/icons/Cancel.gif',
                 	 itemId: 'deleteButton',
                 	 tooltip: 'Delete Reply',
                     scope: this,
                     handler: this.onDeleteClick,
                 	 disabled: true}
                 	]
       		    }],
       		    columns: [
       		        { text: 'Contributor', dataIndex: 'author'}, 
       		        { text: 'Date', dataIndex: 'createTime', xtype: 'datecolumn',   format:'m/d/y h:iA'},
       		        { text: 'Reply', dataIndex: 'content',  field: {type: 'textfield'}},
       		    ],
       		    plugins: [this.editing],
       		    listeners: {
       		    	edit: this.onEdit,
       		    	beforeedit: this.checkOwner,
       		    	select: function(cellModel, record, rowIndex, colIndex, eOpts) {
       		    		this.down('#deleteButton').setDisabled(true);
       		    		
       		    		var userStore = Ext.data.StoreManager.lookup('SPTUser');
       		    		var user = userStore.getAt(0).get('username');
       		    		if(record.get('author') == user){
       		    			this.down('#deleteButton').setDisabled(false);
       		    		}
       		    	}}
       		  }];

 this.callParent(arguments);
},

onReplyClick: function() {
	var grid = this.getActiveTab();
	var record = grid.getSelectionModel().getSelection(); 
	
	var tab = grid.findParentByType('tabpanel');
	var replyStore = Ext.data.StoreManager.lookup('SPTConcernReplies');

	 var originalUrl = replyStore.getProxy().url; //workaround: temp variable for storing proxy url without param
	 replyStore.getProxy().url = replyStore.getProxy().url + record[0].data.id;
	
	 replyStore.load(function(records, operation, success) {
		 console.log(records);
	 });
	 
	 tab.currentConcernId =  record[0].data.id;
	 
	 tab.child('#replyView').tab.show();
	 tab.setActiveTab('replyView');
	 
	 replyStore.getProxy().url = originalUrl;
},

onAddClick: function(){
    var userStore = Ext.data.StoreManager.lookup('SPTUser');
    var user = userStore.getAt(0).get('username');
    var repliesStore = Ext.data.StoreManager.lookup('SPTConcernReplies');
    var concernid =  this.currentConcernId;
    
	var rec = new SPT.model.SPTConcernReplies({concernId: concernid, author: user, createTime: new Date(), content: ''});
    var edit = this.editing;
   
    //create a new row and allow 'content' field to be edited
    edit.cancelEdit();
    repliesStore.insert(0, rec);
    edit.startEditByPosition({
        row: 0,
        column: 2
    });
},

onDeleteClick: function(){
	var grid = this.getActiveTab();
	var view = grid.getItemId();
	var record = grid.getSelectionModel().getSelection();
	var deleteStore = Ext.data.StoreManager.lookup('SPTDelete');
	
	var store; //multi-purpose store dependng on which view is active
	var originalUrl = deleteStore.getProxy().url; //workaround: temp variable for storing proxy url without param
	
	//check to see which grid view is active
	if (view =='replyView'){
		store = Ext.data.StoreManager.lookup('SPTConcernReplies');
		deleteStore.getProxy().url = originalUrl + 'ConcernComment/' + record[0].data.id;
	}else{ //feedbackView
		store = Ext.data.StoreManager.lookup('SPTConcerns');
		deleteStore.getProxy().url = originalUrl + 'Concern/' + record[0].data.id;
	}
	
	deleteStore.load(function(records, operation, success) {
		console.log('reply deleted');
		store.remove(record[0]);
	});
	
	deleteStore.getProxy().url = originalUrl; 
	
	if(view =='replyView'){ //cannot update totals i feedback view because entire concern is deleted
		this.updateTotals(record[0].data.concernId, 'subtract');
	}
},

onEdit: function(editor, e){
	e.record.commit();
	
	var workflowId = SPT.app.getController('SPTWorkflowInit').getCurrentWorkflowInfo().getWorkflowId();
	var replyStore = Ext.data.StoreManager.lookup('SPTConcernReply');
	
	var originalUrl = replyStore.getProxy().url;
	var concernId = e.record.get('concernId');
  	var encodedReply = escape(e.value);
	
	if(e.originalValue == ''){ //new reply
		replyStore.getProxy().url = originalUrl + concernId +'/' + encodedReply + '/' + workflowId;
		replyStore.load(function(records, operation, success) {
			console.log('reply saved');
		});
		
		replyStore.getProxy().url = originalUrl; 
		var tab = e.grid.findParentByType('tabpanel');
		tab.updateTotals(concernId, 'add');
		
	}else if(e.originalValue == e.value){
		//do nothing, user clicked in cell and left without changing
	}
	else{ //user is trying to edit an existing reply, call BCTAgent to save using replyStore proxy, but have to change url to edit method
		replyStore.getProxy().url = 'http://localhost:8080/dwr/jsonp/BCTAgent/editConcernComment/' + e.record.get('id') +'/' + encodedReply;
		replyStore.load(function(records, operation, success) {
			console.log('reply updated');
		});
		
		replyStore.getProxy().url = originalUrl; 
	}
},

onFeedbackEditClick: function(){
	var grid = this.getActiveTab();
	var tab = grid.findParentByType('tabpanel');
	var record = grid.getSelectionModel().getSelection();
	
	var feedbackTextArea = tab.down('#feedbackTextArea');
	feedbackTextArea.setRawValue(record[0].data.content);
	
	//include concernId to process edit in SPTBrainstorm controller
	var concernId = tab.down('#concernId');
	concernId.setRawValue(record[0].data.id);
	
	var checkboxconfigs = [];
   	var tagsStore = record[0].tags();
   	for ( var i = 0; i < tagsStore.getCount(); i++) {
		var tag = tagsStore.getAt(i);
   		var keyword = tag.get('keyword');
   		checkboxconfigs.push({
			name : keyword,
			inputValue : keyword,
			boxLabel : keyword,
			xtype : 'checkbox',
			checked: true
		});
	}
	
	SPT.app.getController('SPTBrainstorm').createKeywordGUI(checkboxconfigs);
	
	tab.down('#continueBtn').hidden = true;
	
	tab.child('#feedbackForm').tab.show();
	tab.setActiveTab('feedbackForm');
	
},


checkOwner: function(editor, e, eOpts){
	var userStore = Ext.data.StoreManager.lookup('SPTUser');
	var user = userStore.getAt(0).get('username');
	
	if(e.record.get('author') == user){
		return true;
	}else
		return false;
},

updateTotals: function(concernId, operation){
	//update replies & views in SPTConcern store for record, rather than reloading all again
	var concernStore = Ext.data.StoreManager.lookup('SPTConcerns');
	var currentConcernIndex = concernStore.find('id', concernId);
	var currentConcern = concernStore.getAt(currentConcernIndex);
	
	//views are incremented no matter what
	var views = currentConcern.get('views') + 1;
	currentConcern.set('views', views);
	
	if(operation == 'add'){
		var replies = currentConcern.get('replies') + 1;
		currentConcern.set('replies', replies);
	}else{//subtract
		var replies = currentConcern.get('replies') - 1;
		currentConcern.set('replies', replies);
	} 	
	
}

});


