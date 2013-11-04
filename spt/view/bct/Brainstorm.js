Ext.define('SPT.view.bct.Brainstorm' ,{
    extend: 'Ext.tab.Panel',
    alias: 'widget.brainstorm',
    autoHeight: true,
    minHeight: 400,
    
    //requires: ['Ext.form.Panel', 'Ext.grid.*', 'Ext.ux.grid.plugin.RowExpander'],
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
            		allowBlank: false}],
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
       			autoHeight: true,
       		    width: 350,
       		    forceFit: true,
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
					}},
       		        {xtype: 'actioncolumn',
					menuDisabled: true,
		            sortable: false,
		            width:25,
                     items: [    
                         {
                         icon   : './resources/icons/View.gif',
                         tooltip: 'View Replies',
                         handler: function(grid, rowIndex, colIndex, item, e, record) {
                        	 var tab = grid.findParentByType('tabpanel');
                        	 var replyStore = Ext.data.StoreManager.lookup('SPTConcernComments');
            
                        	 var originalUrl = replyStore.getProxy().url; //workaround: temp variable for storing proxy url without param
                        	 replyStore.getProxy().url = replyStore.getProxy().url + record.get('id');
                 			
                 			 replyStore.load(function(records, operation, success) {
                 				 console.log(records);
                 			 });
                 			 
                 			 tab.currentConcernId = record.get('id');
                        	 
                        	 tab.child('#replyView').tab.show();
                        	 tab.setActiveTab('replyView');
                        	 
                        	 replyStore.getProxy().url = originalUrl;
                         }}]
       		    }],
       		    plugins: [{
       	            //ptype: 'dvp_rowexpander',
       	            ptype: 'rowexpander',
       	            //pluginId: 'xpander',
       	            rowBodyTpl : [ '<p><b>Feedback:</b> {content}</p>' ]
       		    }]
       		},
       		{
       			title: 'Replies',
       			xtype: 'grid',
       			selType: 'cellmodel',
       			itemId: 'replyView',
       			hidden: true,
       			store: Ext.data.StoreManager.lookup('SPTConcernComments'),
       			autoHeight: true,
       		    width: 350,
       		    dockedItems: [{
                 xtype: 'toolbar',
                 items: [{
                	 icon: './resources/icons/Create.gif',
                     text: 'Post a Reply',
                     scope: this,
                     handler: this.onAddClick
                 	}]
       		    }],
       		    columns: [
       		        { text: 'Contributor', dataIndex: 'author'}, 
       		        { text: 'Date', dataIndex: 'createTime', xtype: 'datecolumn',   format:'m/d/y h:iA'},
       		        { text: 'Reply', dataIndex: 'content',  field: {type: 'textfield'}}
       		    ],
       		    plugins: [this.editing],
       		    listeners: {
       		    	edit: this.onEdit,
       		    	beforeedit: this.checkOwner
       		    }
       		}
       	]

 this.callParent(arguments);
},

onAddClick: function(){
    var userStore = Ext.data.StoreManager.lookup('SPTUser');
    var user = userStore.getAt(0).get('username');
    var commentsStore = Ext.data.StoreManager.lookup('SPTConcernComments');
    var concernid =  this.currentConcernId;
    
	var rec = new SPT.model.SPTConcernComments({concernId: concernid, author: user, createTime: new Date(), content: ''});
    var edit = this.editing;
   
    //create a new row and allow 'content' field to be edited
    edit.cancelEdit();
    commentsStore.insert(0, rec);
    edit.startEditByPosition({
        row: 0,
        column: 2
    });
},

onEdit: function(editor, e){
	if(e.originalValue == ''){
	
		e.record.commit();
		
		var workflowId = SPT.app.getController('SPTWorkflowInit').getCurrentWorkflowInfo().getWorkflowId();
		var replyStore = Ext.data.StoreManager.lookup('SPTConcernReply');
		
		//call BCTAgent to save using commentsStore proxy, but have to change url
		var originalUrl = replyStore.getProxy().url;
	  	var encodedReply = escape(e.value);
		replyStore.getProxy().url = originalUrl + e.record.get('concernId') +'/' + encodedReply + '/' + workflowId ;
		replyStore.load(function(records, operation, success) {
			console.log('reply saved');
		});
		
		replyStore.getProxy().url = originalUrl; 
		
		//update replies & views in SPTConcern store for record, rather than reloading all again
		var concernStore = Ext.data.StoreManager.lookup('SPTConcerns');
		var currentConcernIndex = concernStore.find('id', e.record.get('concernId'));
		
		var currentConcern = concernStore.getAt(currentConcernIndex);
		
		var views = currentConcern.get('views') + 1;
		currentConcern.set('views', views);
		var replies = currentConcern.get('replies') + 1;
		currentConcern.set('replies', replies);
	}else{ //user is trying to edit an existing comment
		//do nothing right now - need to check author before allowing edit
	}
},

checkOwner: function(editor, e, eOpts){
	var userStore = Ext.data.StoreManager.lookup('SPTUser');
	var user = userStore.getAt(0).get('username');
	
	if(e.record.get('author') == user){
		return true;
	}else
		return false;
}

});


