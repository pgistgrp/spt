Ext.define('SPT.view.bct.Brainstorm' ,{
    extend: 'Ext.tab.Panel',
    alias: 'widget.brainstorm',
    autoHeight: true,
    itemId: 'brainstormPanel',
    minHeight: 400,
    
    requires: ['Ext.form.Panel', 
               'Ext.grid.*', 
               'SPT.lib.AllRowExpander', 
               'Ext.form.field.Text',],
    

initComponent: function() {
	 var currentConcern = null;
	 var currentFilter = null;
	 this.editing = Ext.create('Ext.grid.plugin.CellEditing');
	 this.editing.clicksToEdit = 1;
	 
	 this.on({tabchange: this.onTabChange,
		 	  scope: this}); 
	 
	 //this approach used to prevent having to add rowExpander.css to index.html of app
	 Ext.util.CSS.createStyleSheet(".rowexpand-header .rowexpand-expand-all "
	+ "{ background-image: url(./resources/icons/row-expand-sprite.gif);"
	+ "background-position: 0 0; background-repeat: no-repeat; margin-left: 1px; padding-right: 6px;}"
	+ ".rowexpand-header .rowexpand-collapse-all {"
	+ "background-image: url(./resources/icons/row-expand-sprite.gif);"
	+ "background-position: -25px 0; background-repeat: no-repeat; margin-left: 1px; padding-right: 6px;}", 'rowExpander.css' );
	 
	 
	 //create view-global stores
	 Ext.create('SPT.store.SPTKeywords');
	 Ext.create('SPT.store.SPTConcern');
	 Ext.create('SPT.store.SPTDelete');
	 Ext.create('SPT.store.SPTConcernReply'); 
	 Ext.create('SPT.store.SPTConcernReplies');  
	 Ext.create('SPT.store.SPTCommentVote'); 
	 Ext.create('SPT.store.SPTVote'); 
	 
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
    			width: 500,
    			overflowY: 'auto',
        		bodyPadding: 5,
        		fieldDefaults: {
            	msgTarget: 'side',
        		},
        		items: [{
            		fieldLabel: 'Please provide comments and select at least 2 keywords or phrases',
            		labelStyle: 'color: #15428b; font-size: 12px;',
            		name: 'feedbackTextArea',
					itemId: 'feedbackTextArea',
            		xtype: 'textareafield',
            		height:200,
    				width: 400,
            		grow: true,
            		allowBlank: false,
            		maxLength:700,
            		maxLengthText: 'Your input cannot exceed 700 characters due to URL length restrictions. Please split into multiple comments.'},
            		{
        		    xtype: 'hiddenfield',
        		    name: 'concernId',
        		    itemId:'concernId',
        		    value: 'new'
        		    }],
				buttons: [{
            	text: 'Continue',
            	action: 'getkeywords',
            	itemId: 'continueBtn',
            	listeners:{
            		click: this.getKeywords
            		}
            	}]
       		},
       		{
       			title: 'View Feedback',
       			xtype: 'grid',
       			selType: 'cellmodel',
       			itemId: 'feedbackView',
       			store: Ext.data.StoreManager.lookup('allConcernsStore'),
       			height: 400, //need to define a height so that grid scrolls
       		    width: 500,
       		    forceFit: true,
       		    viewConfig:{itemId: 'feedbackGridView'},
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
                    	{icon: './resources/icons/Bubble.gif',
                    	itemId: 'replyButton',
                        scope: this,
                        tooltip: 'View Replies',
                        handler: this.onReplyClick,
                        disabled: true},
                        {xtype: 'tbspacer' },
                        {xtype: 'textfield',
                        itemId: 'filterTxt',
                        emptyText: 'Enter keyword filter',
                        selectOnFocus: true,
                        enableKeyEvents: true,
                        listeners:{
                        	scope:this,
                        	keyup:this.filterKeywords,
                        	beforerender:this.getFilterFromRequest
                        }},
                        {icon: './resources/icons/CancelFilter.gif',
                        	itemId: 'removeFilterButton',
                            scope: this,
                            tooltip: 'Remove Filter',
                            handler: this.onRemoveFilterClick,
                        },
                        {xtype: 'tbfill' },
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
       		        { text: 'Keywords', sortable: false, dataIndex: 'id', renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
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
       		    	ptype: 'allrowexpander',
       	            pluginId: 'expander',
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
    		    		
    		    		var userStore = Ext.data.StoreManager.lookup('userStore');
    		    		var user = userStore.getAt(0).get('username');
    		    		if(record.get('author') == user){
    		    			this.down('#editButton').setDisabled(false);
    		    			this.down('#deleteButton').setDisabled(false);
    		    		}else{//only user != author can agree or disagree with feedback
    		    			var object = record.get('object');
    		    			if(object == null){//and they haven't voted yet
    		    				this.down('#agreeButton').setDisabled(false);
    		    				this.down('#disagreeButton').setDisabled(false);
    		    			}else{
    		    				if (object.voting) //agreed already, allow disagree
    		    					this.down('#disagreeButton').setDisabled(false);
    		    				else //disagreed already, allow agree
    		    					this.down('#agreeButton').setDisabled(false);
    		    			}
    		    		}
    		    	}}
       		},
       		{
       			title: 'Replies',
       			xtype: 'grid',
       			hidden: true,
       			itemId: 'replyView',
   				selModel: {
   					selType: 'cellmodel',
   					mode: 'SINGLE',
   					allowDeselect: true
   				},
   				store: Ext.data.StoreManager.lookup('concernRepliesStore'),
   				height: 400, //need to define a height so that grid scrolls
   				width: 500,
   				forceFit: true,
   				dockedItems: [
   				    {xtype:'label',
					itemId: 'feedbackReview',
					text: '',
					style: 'color: #15428b; font-size: 12px; padding:5px',
					width: 350,
					shrinkWrap: 2
					},              
   					{xtype: 'toolbar',
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
       		        { text: 'Reply', sortable:false, width: 175, dataIndex: 'content',  field: {type: 'textfield'}, renderer: function(value, metaData){
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
       		    		
       		    		var userStore = Ext.data.StoreManager.lookup('userStore');
       		    		var user = userStore.getAt(0).get('username');
       		    		if(record.get('author') == user){
       		    			this.down('#deleteButton').setDisabled(false);
       		    		}else{//only user != author can agree or disagree with comment
       		    			var object = record.get('object');
    		    			if(object == null){//and they haven't voted yet
    		    				this.down('#agreeButton').setDisabled(false);
    		    				this.down('#disagreeButton').setDisabled(false);
    		    			} 
    		    			else{
    		    				if (object.voting) //agreed already, allow disagree
    		    					this.down('#disagreeButton').setDisabled(false);
        		    			else //disagreed already, allow agree
        		    				this.down('#agreeButton').setDisabled(false);
    		    			}
    		    		}
       		    	}}
       		  },
      		  
       		{title: 'View Summary',
       		xtype: 'form',
            itemId: 'keywordSummaryView',
        	frame: true,
    		width: 500,
    		layout: {
    	        type: 'table',
    	        columns: 2
    	    },
            items: [
                {xtype:'label',
                colspan: 2,	
                itemId: 'instructions',
                text: 'Explore participants\' keywords/keyphrases and related feedback.', //discuss and vote to move forward when satisfied that sufficient feedback has been provided.
                style: 'color: #15428b; font-size: 12px;',
                },
       			{xtype: 'grid',
                selType: 'rowmodel',
                itemId: 'keywordSummaryGrid',
                store: Ext.data.StoreManager.lookup('SPTKeywordSummary'),
                height: 400, //need to define a height so that grid scrolls
                width:150,
           		forceFit: true,
           		columns: [
            		{header: 'Keywords/Keyphrases', dataIndex: 'keyword', hideable: false, renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
       		        	return record.get('keyword') + ' (' + record.get('times') + ')';
					}}
            	],
         		listeners:{
         			afterrender: function(grid) {        
                        var menu = grid.headerCt.getMenu();
                        menu.add([{
                                text: 'Sort Asc by Count',
                                handler: function () {
                                        grid.getStore().sort('times', 'ASC');
                                }},
                                {
                                    text: 'Sort Desc by Count',
                                    handler: function() {
                                        grid.getStore().sort('times', 'DESC');
                                 }}]);           
         			},
         			select: function(rowModel, record, rowIndex, colIndex, eOpts) {
         				var filter = record.get('keyword');
         				var tab = this.findParentByType('tabpanel');
         				var form = tab.getActiveTab();
         				form.down('#filterTxt').setValue(filter);
         				tab.doFilter(filter);
         			}
         		}},
       		  	{xtype: 'grid',
                selType: 'cellmodel',
                itemId: 'concernSummaryGrid',
                store: Ext.data.StoreManager.lookup('allConcernsStore'),
                height: 400, //need to define a height so that grid scrolls
                width: 340,
       		    forceFit: true,
       		    viewConfig:{itemId: 'concernSummaryGridView'},
       		    dockedItems: [
       	        {xtype: 'toolbar',
       	        items: [
       	            {xtype: 'textfield',
       	            itemId: 'filterTxt',
       	            emptyText: 'Enter keyword filter',
       	            selectOnFocus: true,
       	            enableKeyEvents: true,
       	            listeners:{
       	            	scope:this,
       	            	keyup:this.filterKeywords,
       	            	beforerender:this.getFilterFromRequest
       	            }},
       	            {icon: './resources/icons/CancelFilter.gif',
       	            	itemId: 'removeFilterButton',
       	                scope: this,
       	                tooltip: 'Remove Filter',
       	                handler: this.onRemoveFilterClick,
       	            }]
       			 }],
       			 columns: [
              		        { text: 'Contributor', dataIndex: 'author'}, 
              		        { text: 'Date', dataIndex: 'createTime', xtype: 'datecolumn',   format:'m/d/y h:iA'},
              		        { text: 'Keywords', sortable:false, dataIndex: 'id', renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
              		        	var keywords = new Array();
              		        	var tagsStore = record.tags();
              		        	for ( var i = 0; i < tagsStore.getCount(); i++) {
              						var tag = tagsStore.getAt(i);
              		        		var keyword = tag.get('keyword');
              		        		keywords[i] = keyword;
              					}
              		        	
              		        	return keywords;
              		        }}
       		    ],
       	    	plugins: [{
    		    	ptype: 'allrowexpander',
    	            pluginId: 'expander',
    	            rowBodyTpl : [ '<p><b>Feedback:</b> {content}</p>' ]
    		    }]
             }],
    	    listeners:{
    	    	afterrender: function(){
     				this.down('#keywordSummaryGrid').getSelectionModel().select(0);
     			},
    	    }
    	}, 
     ];
	 
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
	//make sure user can't vote the same again before processing
	if (vote == true)
		this.down('#agreeButton').setDisabled(true);
	else //vote = false
		this.down('#disagreeButton').setDisabled(true);
	
	var voteStore; //multi-purpose store depending on which view is active
	
	//check to see which grid view is active
	if (view =='replyView'){
		voteStore = Ext.data.StoreManager.lookup('commentVoteStore');
	}else{ //feedbackView
		voteStore = Ext.data.StoreManager.lookup('voteStore');
	}
	
	var originalUrl = voteStore.getProxy().url; //workaround: temp variable for storing proxy url without param
	voteStore.getProxy().url = voteStore.getProxy().url + id
	+ '/' + vote;
	
	voteStore.load(function(records, operation, success) {
		console.log('voted');
	});
	 
	voteStore.getProxy().url = originalUrl;
	
	//update vote totals in SPTConcerns or SPT ConcernReplies store for record, rather than reloading all again
	var store; 
	if (view =='replyView'){
		store = Ext.data.StoreManager.lookup('concernRepliesStore');
	}else{ //feedbackView
		store = Ext.data.StoreManager.lookup('allConcernsStore');
	}
	
	var recordIndex = store.find('id', id);
	var currentRecord = store.getAt(recordIndex);
	var numAgree;
	var numVoted;
	var object = currentRecord.get('object');
	
	//check to see if already voted, if not then..
	if(object == null){
		object = new Object();
		if(vote == true){
			numAgree = currentRecord.get('numAgree') + 1;
			currentRecord.set('numAgree', numAgree);
			numVote = currentRecord.get('numVote') + 1;
			currentRecord.set('numVote', numVote);
			object.voting = true;
		} else{ //they disagreed, just increment numVote
			numVote = currentRecord.get('numVote') + 1;
			currentRecord.set('numVote', numVote);
			object.voting = false;
		}
	}else{ //already voted in this session, don't increment numVoted
		if(vote == true){ //disagreed before, now agree
			numAgree = currentRecord.get('numAgree') + 1;
			currentRecord.set('numAgree', numAgree);
			object.voting = true;
		} else{ //agreed before, now disagree
			numAgree = currentRecord.get('numAgree') - 1;
			currentRecord.set('numAgree', numAgree);
			object.voting = false;
		}
	}
	
	currentRecord.set('object', object);
	
},


onReplyClick: function() {
	var grid = this.getActiveTab();
	
	var record = grid.getSelectionModel().getSelection(); 
	
	var tab = grid.findParentByType('tabpanel');
	tab.currentConcern =  record[0].data;
	
	var replyStore = Ext.data.StoreManager.lookup('concernRepliesStore');

	var originalUrl = replyStore.getProxy().url; //workaround: temp variable for storing proxy url without param
	 replyStore.getProxy().url = replyStore.getProxy().url + record[0].data.id;
	
	 replyStore.load(function(records, operation, success) {
		 console.log(records);
	 });
	 
	 replyStore.getProxy().url = originalUrl;
	 
	 var replyView = tab.child('#replyView');
	 replyView.getComponent('feedbackReview').setText('Feedback from ' + tab.currentConcern.author + ': ' + tab.currentConcern.content);
	 replyView.tab.show();
	 tab.setActiveTab('replyView');
},


onTabChange: function(tabPanel, newCard, oldCard, eOpts){
	if(oldCard.itemId == 'replyView'){
		tabPanel.child('#replyView').tab.hide();
	}else if (oldCard.itemId == 'keywordSummaryView'){
		
		var owner = tabPanel.ownerCt;
    	//owner.child('#reviewPanel').hide();
    	
    	if (newCard.itemId == 'feedbackView'){
    		var concernsStore = Ext.data.StoreManager.lookup('allConcernsStore');
    		concernsStore.clearFilter(false);
		
    		var filter = tabPanel.getActiveTab().down('#filterTxt').getValue();
    		if (filter != "")
    			tabPanel.doFilter(filter);
    	}
	} else if (oldCard.itemId == 'feedbackView' && newCard.itemId == 'keywordSummaryView'){
		var concernsStore = Ext.data.StoreManager.lookup('allConcernsStore');
		concernsStore.clearFilter(false);
		var filter = tabPanel.getActiveTab().down('#filterTxt').getValue();
		if (filter != "")
			tabPanel.doFilter(filter);
	}
},


onAddClick: function(){
    var userStore = Ext.data.StoreManager.lookup('userStore');
    var user = userStore.getAt(0).get('username');
    var repliesStore = Ext.data.StoreManager.lookup('concernRepliesStore');
    var concernid =  this.currentConcern.id;
    
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
	var store; //multi-purpose store dependng on which view is active
	
	if (view =='replyView'){
		store = Ext.data.StoreManager.lookup('concernRepliesStore');
	}else{ //feedbackView
		store = Ext.data.StoreManager.lookup('allConcernsStore');
	}
	
	if(record[0].data.id != null){
	
		var deleteStore = Ext.data.StoreManager.lookup('deleteStore');
		
		var originalUrl = deleteStore.getProxy().url; //workaround: temp variable for storing proxy url without param
	
		//check to see which grid view is active
		if (view =='replyView'){
			deleteStore.getProxy().url = originalUrl + 'ConcernComment/' + record[0].data.id;
		}else{ //feedbackView
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
	}else{
		store.remove(record[0]); //just remove from grid, no call to server
	}
},

onEdit: function(editor, e){
	e.record.commit();
	
	var parent1 = this.up('#brainstormPanel');
	var config = parent1.initialConfig; //getInitialConfig() method doesn't work - known bug still in ExtJS 4.2
	var parent2 = config.parent;
	var wfInfo = parent2.getCurrentWorkflowInfo();
	
	var workflowId = wfInfo.getWorkflowId();
	var replyStore = Ext.data.StoreManager.lookup('concernReply');
	
	var originalUrl = replyStore.getProxy().url;
	var concernId = e.record.get('concernId');
  	var encodedReply = escape(e.value);
	
  	if(e.originalValue == '' && e.value.trim().length != 0){ //new reply
		replyStore.getProxy().url = originalUrl + concernId +'/' + encodedReply + '/' + workflowId;
		replyStore.load(function(records, operation, success) {
			console.log('reply saved');
			replyStore.getProxy().url = originalUrl; 
			
		});
		
		//now reload replies so id is set, need id to delete
		var repliesStore = Ext.data.StoreManager.lookup('concernRepliesStore');

		var origUrl = repliesStore.getProxy().url; //workaround: temp variable for storing proxy url without param
		repliesStore.getProxy().url = repliesStore.getProxy().url + concernId;
		
		repliesStore.load(function(records, operation, success) {
		});
		
		repliesStore.getProxy().url = origUrl;
		
		var tab = e.grid.findParentByType('tabpanel');
		tab.updateTotals(concernId, 'add');
		
	}else if(e.originalValue == e.value){
		//do nothing, user clicked in cell and left without changing
	}
	else{ //user is trying to edit an existing reply, call BCTAgent to save using replyStore proxy, but have to change url to edit method
		replyStore.getProxy().url = 'http://pgistdev.geog.uw.edu/dwr/jsonp/BCTAgent/editConcernComment/' + e.record.get('id') +'/' + encodedReply;
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
   	
   	console.log(tagsStore);
   	
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
	
   	tab.down('#continueBtn').hidden = true;
   	
   	var feedbackForm = tab.child('#feedbackForm');
	tab.setActiveTab(feedbackForm);
	this.createKeywordGUI(checkboxconfigs);
	feedbackForm.tab.show();
	
},

getFilterFromRequest: function() {
	var filter = this.getQueryParameter('filter');
	if(filter != null){      
		var grid = this.getActiveTab();
	  	var tab = grid.findParentByType('tabpanel');
	  	tab.down('#filterTxt').setValue(filter);
	  	this.doFilter(filter);
	}
},

filterKeywords: function(field, e, eOpts){
	var concernsStore = Ext.data.StoreManager.lookup('allConcernsStore');
	
	var filter = field.value;
	if (e.getKey() == e.ENTER) {
    	this.doFilter(filter);
    }else if(filter == ""){
    	concernsStore.clearFilter(false);
    }
},

doFilter: function(filter){
	
	var concernsStore = Ext.data.StoreManager.lookup('allConcernsStore');
    concernsStore.clearFilter(true);
    concernsStore.filter({filterFn: function(item){ 
    	var tagsStore = item.tags();
       	var index = tagsStore.find('keyword', filter);
    	return index != -1;}}); 
},

onRemoveFilterClick: function(){
	var grid = this.getActiveTab();
	
	var concernsStore = Ext.data.StoreManager.lookup('allConcernsStore');
	concernsStore.clearFilter(false);
	
	var filterTxtfield = grid.down('#filterTxt');
	filterTxtfield.reset();
	
},


checkOwner: function(editor, e, eOpts){
	var userStore = Ext.data.StoreManager.lookup('userStore');
	var user = userStore.getAt(0).get('username');
	
	if(e.record.get('author') == user){
		return true;
	}else
		return false;
},

updateTotals: function(concernId, operation){
	//update replies & views in SPTConcern store for record, rather than reloading all again
	var concernStore = Ext.data.StoreManager.lookup('allConcernsStore');
	var currentConcernIndex = concernStore.find('id', concernId);
	var currentConcern = concernStore.getAt(currentConcernIndex);
	
	//views are incremented no matter what
	var views = currentConcern.get('views') + 1;
	currentConcern.set('views', views);
	
	if(operation == 'add'){
		var replies = currentConcern.get('replies') + 1;
		currentConcern.set('replies', replies);
	}else{//subtract
		var replies = currentConcern.get('replies');
		if(replies != 0){
			replies = replies - 1;
		}
		currentConcern.set('replies', replies);
	} 	
	
},

	getKeywords: function(button) {
        
		var keywordStore = Ext.data.StoreManager.lookup('keywordStore');
		
		var parent = this.up('#brainstormPanel');
		var feedbackForm = this.up('#feedbackForm');
		var feedbackTextArea = feedbackForm.down('#feedbackTextArea');
		
		var originalUrl = keywordStore.getProxy().url; //workaround: temp variable for storing proxy url without param
    	
    	if(feedbackForm.getForm().isValid()){
			console.log('valid');
			var feedbackText = escape(feedbackTextArea.getValue());
			
			keywordStore.getProxy().url = keywordStore.getProxy().url + feedbackText;
			keywordStore.load({
	            callback: parent.onKeywordLoad,           
	            scope: parent
	        });
				
			button.hidden = true;
		};
		
		console.log('not valid');
		keywordStore.getProxy().url = originalUrl; //reset url to remove parameter
    },
    
    onKeywordLoad: function(records){
    	var checkboxconfigs = [];
    	for ( var i = 0; i < records.length; i++) {
			for(var j = 0; j < records[i].data.tags.length; j++){
				checkboxconfigs.push({
					name : records[i].data.tags[j],
					inputValue : records[i].data.tags[j],
					boxLabel : records[i].data.tags[j],
					xtype : 'checkbox'
				});
			}
		}
		
		this.createKeywordGUI(checkboxconfigs);
    },
    
    createKeywordGUI: function(checkboxconfigs){
    	
    	var feedbackForm = this.getActiveTab();
    	console.log(feedbackForm);
    	
    	var keywordGroup = Ext.create('Ext.form.CheckboxGroup',{
			itemId : 'keywordGroup',
			fieldLabel: 'Keywords/phrases',
			columns: 1,
			items : checkboxconfigs
		});

		var manualTag = Ext.create('Ext.form.field.Text',{
			itemId : 'manualTag'
		});
		
		var addManualButton = Ext.create('Ext.Button',{
			text : 'Add Keyphrase',
			action: 'addkeyword',
			itemId: 'manualBtn',
			listeners:{
            	click: this.addManualTag
            }
		});

		feedbackForm.add(keywordGroup);
		feedbackForm.add(manualTag);
		feedbackForm.add(addManualButton);
		
		var submitButton = Ext.create('Ext.Button',{
			text : 'Submit',
			action: 'submit',
			itemId: 'submitBtn',
			listeners:{
            	click: this.saveConcern
            }
		});
		var cancelButton = Ext.create('Ext.Button',{
			text : 'Cancel',
			action: 'cancel',
			itemId: 'cancelBtn',
			listeners:{
            	click: this.cancelConcern
            }
		});
		
		feedbackForm.add(submitButton);
		feedbackForm.add(cancelButton);
    },
    
    saveConcern: function(button){
    	var feedbackForm = this.up('#feedbackForm');
    	var keywordGroup = feedbackForm.getComponent('keywordGroup');
    	var selectedTags = keywordGroup.getChecked();
        
    	if(selectedTags.length <2){
    		  Ext.Msg.show({
                  title: 'SPT Help',
                  msg: 'Please select at least 2 keywords',
                  buttons: Ext.Msg.OK
              });
        }else{
        	var concernStore = Ext.data.StoreManager.lookup('concernStore');
        	
        	//get keywords
        	var selectedTagsString = '';
        	for (i=0; i<selectedTags.length; i++){
        		selectedTagsString += selectedTags[i].getName()+ ',';  
        	}
        	//add filter to keywords if provided in request
        	var parent1 = this.up('#brainstormPanel');
        	var filter = parent1.getQueryParameter('filter');
        	if(filter != null){      
        		selectedTagsString += filter;
        	}
        	
        	
        	var config = parent1.initialConfig; //getInitialConfig() method doesn't work - known bug still in ExtJS 4.2
        	var parent2 = config.parent;
        	
        	var wfInfo = parent2.getCurrentWorkflowInfo();
        	if (wfInfo == null){
        		this.getSelectWorkflowMsg();
        	}else{
        		var originalUrl = concernStore.getProxy().url;
        		var feedbackTextArea = feedbackForm.down('#feedbackTextArea');
        		var encodedFeedback = escape(feedbackTextArea.getValue());
        		var concernId = feedbackForm.getComponent('concernId').getValue();
        		
        		//check to see if new feedback 
        		if(concernId == 'new'){
		        	concernStore.getProxy().url = concernStore.getProxy().url
		        		+ encodedFeedback
		        		+ '/'+ selectedTagsString 
		        		+ '/'+ wfInfo.getWorkflowId()
		        		+ '/'+ wfInfo.getContextId()
		        		+ '/'+ wfInfo.getActivityId(); 
		        	
		        	concernStore.load(function(records, operation, success) {
		        		console.log("concern saved");
		        	});
		        	
		        	concernStore.getProxy().url = originalUrl;
        		}else{//in edit mode
        			concernStore.getProxy().url = 'http://pgistdev.geog.uw.edu/dwr/jsonp/BCTAgent/editConcern/'
        			+ concernId
        			+ '/'+ encodedFeedback
        			+ '/'+ selectedTagsString;
        			
        			concernStore.load(function(records, operation, success) {
		        		console.log("concern edited");
		        	});
        		}
	      
	        	var parent = this.up('#brainstormPanel');
	        	parent.resetForm();
	        	
	        	var workflow = parent.ownerCt.down('#workflowPanel');
	        	workflow.getConcerns();
        	}	
        }
    },
    
    cancelConcern: function(button){
    	this.resetForm();
    },
    
    addManualTag: function(button) {
    	var feedbackForm = this.up('#feedbackForm');
    	var manualTag = feedbackForm.getComponent('manualTag').getValue();
    	if(manualTag != ""){
    		var keywordModel = Ext.ModelManager.getModel('SPT.model.SPTKeywords');
    		var newTag = keywordModel.create({tags: manualTag, potentialtags: '', successful: true});
    		var keywordStore = Ext.data.StoreManager.lookup('keywordStore');
    		keywordStore.add(newTag);
    		keywordGroup = feedbackForm.getComponent('keywordGroup');
        	keywordGroup.add({
        		name : manualTag,
				inputValue : manualTag,
				boxLabel : manualTag,
				xtype : 'checkbox',
				checked: true
			});
    	}
    	
    },
    
    resetForm: function(){
    	var feedbackForm = this.getActiveTab();
    	
    	feedbackForm.getForm().reset();
    	
    	feedbackForm.remove('keywordGroup');
		feedbackForm.remove('manualTag');
		feedbackForm.remove('manualBtn');
		
		feedbackForm.remove('submitBtn');
		feedbackForm.remove('cancelBtn');
		var continueBtn = feedbackForm.queryById('continueBtn');
		continueBtn.setVisible(true);
    },
    
    getQueryParameter: function(parameter){
  	  var queryString = window.location.search.substring(1);
  	  var parameterName = 'filter' + "=";
  	  if ( queryString.length > 0 ) {
  	    begin = queryString.indexOf ( parameterName );
  	    if ( begin != -1 ) {
  	      begin += parameterName.length;
  	      end = queryString.indexOf ( "&" , begin );
  	        if ( end == -1 ) {
  	        	end = queryString.length
  	        }
  	      return unescape(queryString.substring(begin, end));
  	     }
  	  } else
  		  return null;
  },
    
  getSelectWorkflowMsg: function(){
		return Ext.Msg.show({
	        title: 'SPT Help',
	        msg: 'Please select a discussion topic',
	        buttons: Ext.Msg.OK
	    });	
	}
       		
       		
});


