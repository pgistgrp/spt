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
    			width: 400,
    			overflowY: 'auto',
        		bodyPadding: 5,
        		fieldDefaults: {
            	msgTarget: 'side',
        		},
        		items: [{
            		fieldLabel: 'Please provide your comments and select at least 2 keywords or phrases',
            		name: 'feedbackTextArea',
					itemId: 'feedbackTextArea',
            		xtype: 'textareafield',
            		height:200,
    				width: 375,
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
       		    width: 400,
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
                        disabled: true},
                        { xtype: 'tbfill' },
                    	{icon: './resources/icons/GoodMark.gif',
                    	itemId: 'agreeButton',
                        scope: this,
                        tooltip: 'Agree',
                        handler: this.onAgreeClick,
                        disabled: true},
                        {icon: './resources/icons/BadMark.gif',
                    	itemId: 'disagreeButton',
                        scope: this,
                        tooltip: 'Disagree',
                        handler: this.onDisagreeClick,
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
       		        	return keywords;
       		        }},
       		        {text: 'Replies', dataIndex: 'replies', renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
						return value + " ("+ record.get('views') + " views)";
					}},
					{text: 'Votes', dataIndex: 'numAgree', renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
						metaData.style = 'white-space: normal;'; // applied style for DIV element
						return value + " out of "+ record.get('numVote') + " agree";
					}},
					
       		    ],
       		    plugins: [{
       	            ptype: 'rowexpander',
       	            rowBodyTpl : [ '<p><b>Feedback:</b> {content}</p>' ]
       		    }],
       		    listeners: {
    		    	select: function(rowModel, record, rowIndex, colIndex, eOpts) {
    		    		this.down('#replyButton').setDisabled(false);
    		    		//only enable other buttons depending on author<->user relationship
    		    		this.down('#agreeButton').setDisabled(true);
    		    		this.down('#disagreeButton').setDisabled(true);
    		    		this.down('#editButton').setDisabled(true);
    		    		this.down('#deleteButton').setDisabled(true);
    		    		
    		    		var userStore = Ext.data.StoreManager.lookup('SPTUser');
    		    		var user = userStore.getAt(0).get('username');
    		    		if(record.get('author') == user){
    		    			this.down('#editButton').setDisabled(false);
    		    			this.down('#deleteButton').setDisabled(false);
    		    		}else{//only user != author can agree or disagree with feedback
    		    			if(record.get('object')== null){//and they haven't voted yet
    		    				this.down('#agreeButton').setDisabled(false);
    		    				this.down('#disagreeButton').setDisabled(false);
    		    			}
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
       		    width: 400,
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
                 	 disabled: true},
                     { xtype: 'tbfill' },
                 	{icon: './resources/icons/GoodMark.gif',
                     itemId: 'agreeButton',
                     scope: this,
                     tooltip: 'Agree',
                     handler: this.onAgreeClick,
                     disabled: true},
                     {icon: './resources/icons/BadMark.gif',
                 	 itemId: 'disagreeButton',
                     scope: this,
                     tooltip: 'Disagree',
                     handler: this.onDisagreeClick,
                     disabled: true}
                 	]
       		    }],
       		    columns: [
       		        { text: 'Contributor', dataIndex: 'author'}, 
       		        { text: 'Date', dataIndex: 'createTime', xtype: 'datecolumn',   format:'m/d/y h:iA'},
       		        { text: 'Reply', width: 175, dataIndex: 'content',  field: {type: 'textfield'}, renderer: function(value, metaData){
       		        	metaData.style = 'white-space: normal;'; // applied style for DIV element
       		      		return value;      
       		        }},
       		        { text: 'Votes', dataIndex: 'numAgree', renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
       		        	metaData.style = 'white-space: normal;'; // applied style for DIV element
       		        	return value + " out of "+ record.get('numVote') + " agree";
					}},
       		    ],
       		    plugins: [this.editing],
       		    listeners: {
       		    	edit: this.onEdit,
       		    	beforeedit: this.checkOwner,
       		    	select: function(cellModel, record, rowIndex, colIndex, eOpts) {
       		    		this.down('#deleteButton').setDisabled(true);
       		    		this.down('#agreeButton').setDisabled(true);
    		    		this.down('#disagreeButton').setDisabled(true);
       		    		
       		    		var userStore = Ext.data.StoreManager.lookup('SPTUser');
       		    		var user = userStore.getAt(0).get('username');
       		    		if(record.get('author') == user){
       		    			this.down('#deleteButton').setDisabled(false);
       		    		}else{//only user != author can agree or disagree with comment
    		    			if(record.get('object')== null){//and they haven't voted yet
    		    				this.down('#agreeButton').setDisabled(false);
    		    				this.down('#disagreeButton').setDisabled(false);
    		    			}
    		    		}
       		    	}}
       		  }];

 this.callParent(arguments);
},

onAgreeClick: function() {
	var grid = this.getActiveTab();
	var view = grid.getItemId();
	var record = grid.getSelectionModel().getSelection(); 
	this.setVote(record[0].data.id, true, view);
},

onDisagreeClick: function(){
	var grid = this.getActiveTab();
	var view = grid.getItemId();
	var record = grid.getSelectionModel().getSelection(); 
	this.setVote(record[0].data.id, false, view);
},

setVote: function(id, vote, view){
	//make sure user can't vote again before processing
	this.down('#agreeButton').setDisabled(true);
	this.down('#disagreeButton').setDisabled(true);
	
	var store; //multi-purpose store depending on which view is active
	
	//check to see which grid view is active
	if (view =='replyView'){
		var store = Ext.data.StoreManager.lookup('SPTCommentVote');
	}else{ //feedbackView
		var store = Ext.data.StoreManager.lookup('SPTVote');
	}
	
	var originalUrl = store.getProxy().url; //workaround: temp variable for storing proxy url without param
	store.getProxy().url = store.getProxy().url + id
	+ '/' + vote;
	
	store.load(function(records, operation, success) {
		console.log('voted');
	});
	 
	store.getProxy().url = originalUrl;
	
	//update vote totals in SPTConcerns or SPT ConcernReplies store for record, rather than reloading all again
	var store; 
	if (view =='replyView'){
		var store = Ext.data.StoreManager.lookup('SPTConcernReplies');
	}else{ //feedbackView
		var store = Ext.data.StoreManager.lookup('SPTConcerns');
	}
	
	var recordIndex = store.find('id', id);
	var currentRecord = store.getAt(recordIndex);
	
	if(vote == true){
		var numAgree = currentRecord.get('numAgree') + 1;
		currentRecord.set('numAgree', numAgree);
	}
	
	//always increment numVote 
	var numVote = currentRecord.get('numVote') + 1;
	currentRecord.set('numVote', numVote);
	
	//and make sure voting object is no longer null for user so they can't vote again
	var object = 'voted';
	currentRecord.set('object', object);
	
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
    
	var rec = new SPT.model.SPTConcernReplies({concernId: concernid, author: user, createTime: new Date(), content: '', numAgree: 1, numVote: 1, object: 'voted'});
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
	
	if(view =='replyView'){ //cannot update totals in feedback view because entire concern is deleted
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
	
  	if(e.originalValue == '' && e.value.trim().length != 0){ //new reply
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


