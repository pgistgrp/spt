Ext.define('SPT.view.drt.Review' ,{
    extend: 'Ext.tab.Panel',
    alias: 'widget.review',
    autoHeight: true,
    itemId: 'reviewPanel',
    minHeight: 200,
    
    requires: ['Ext.grid.*', 
               'Ext.form.Panel', 
               'SPT.lib.AllRowExpander', ],
    	
    initComponent: function() {
    		
    		this.items = [
    		     {title: 'Post Comment',
    		      xtype: 'form',
    		      padding: '5 5 0 5',
    	          border: false,
    	          collapsible: true,
    	          itemId: 'drtCommentForm',
    	          frame: true,
    	          autoHeight: true,
    	          width: 400,
    	    	  overflowY: 'auto',
    	          bodyPadding: 5,
    	          items: [
    		        {xtype: 'textfield',
    				itemId:'commentTitle',
    				fieldLabel: 'Title:',
    				labelWidth: 50,
    				labelStyle: 'color: #15428b; font-size: 12px;',
    				width:375,
    				allowBlank: false},
    				{fieldLabel: 'Feedback Assessment:',
    			    labelStyle: 'color: #15428b; font-size: 12px;', 		
                	name: 'commentTextArea',
    				itemId: 'commentTextArea',
                	xtype: 'textareafield',
                	height:200,
        			width: 375,
                	grow: true,
                	allowBlank: false}
    		     ],
    		     buttons: [{
    	            	text: 'Submit',
    	            	action: 'submit',
    	            	itemId: 'submitBtn'
    	            	},
    	            	{
        	            	text: 'Cancel',
        	            	action: 'cancel',
        	            	itemId: 'cancelBtn'
        	            	}
    	            	]
    		     },
    		     {
    	       			title: 'View Comments',
    	       			xtype: 'grid',
    	       			selType: 'rowmodel',
    	       			itemId: 'commentView',
    	       			store: Ext.data.StoreManager.lookup('SPTReviewComments'),
    	       			height: 300, //need to define a height so that grid scrolls
    	       		    width: 400,
    	       		    forceFit: true,
    	       		    viewConfig:{itemId: 'commentGridView'},
    	       		    dockedItems: [{
    	                    xtype: 'toolbar',
    	                    items: [
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
    	       		        { text: 'Title', dataIndex: 'title'}, 
    						{text: 'Votes', dataIndex: 'numAgree', renderer: function(value, metaData, record, rowIndex, colIndex, store, view){
    							metaData.style = 'white-space: normal;'; // applied style for DIV element
    							return value + " out of "+ record.get('numVote') + " agree";
    						}},
    						
    	       		    ],
    	       		    plugins: [{
    	       		    	ptype: 'allrowexpander',
    	       	            pluginId: 'expander',
    	       	            rowBodyTpl : [ '<p>{content}<BR><b>{author} at {createTime}</b></p>' ]
    	       		    }],
    	       		    listeners: {
    	    		    	select: function(rowModel, record, rowIndex, colIndex, eOpts) {
    	    		    		//only enable other buttons depending on author<->user relationship
    	    		    		this.down('#agreeButton').setDisabled(true);
    	    		    		this.down('#disagreeButton').setDisabled(true); 
    	    		    		
    	    		    		var userStore = Ext.data.StoreManager.lookup('SPTUser');
    	    		    		var user = userStore.getAt(0).get('username');
    	    		    		if(record.get('author') != user){//only user != author can agree or disagree with comment
    	    		    			
    	    		    			if(record.get('voted')){//if they have voted only enable opposite button
    	    		    				if(record.get('agree'))
    	    		    					this.down('#disagreeButton').setDisabled(false);
    	    		    				else
    	    		    					this.down('#agreeButton').setDisabled(false);
    	    		    			}else{ //otherwise enable both buttons
    	    		    					this.down('#disagreeButton').setDisabled(false);
    	    		    					this.down('#agreeButton').setDisabled(false);
    	    		    			}
    	    		    		}
    	    		    	}}
    	       		}
    		     
    		     ];

    		this.callParent(arguments);
    },

onAgreeClick: function() {
	var grid = this.getActiveTab();
	var record = grid.getSelectionModel().getSelection(); 
	this.setVote(record[0].data.id, true);
},

onDisagreeClick: function(){
	var grid = this.getActiveTab();
	var record = grid.getSelectionModel().getSelection(); 
	this.setVote(record[0].data.id, false);
},

setVote: function(id, vote){
	//make sure user can't vote the same again before processing
	if (vote == true)
		this.down('#agreeButton').setDisabled(true);
	else //vote = false
		this.down('#disagreeButton').setDisabled(true);
	
	var voteStore = Ext.data.StoreManager.lookup('SPTReviewCommentVote');

	var originalUrl = voteStore.getProxy().url; //workaround: temp variable for storing proxy url without param
	voteStore.getProxy().url = voteStore.getProxy().url + id
	+ '/' + vote;
	
	voteStore.load(function(records, operation, success) {
		console.log('voted');
	});
	 
	voteStore.getProxy().url = originalUrl;
	
	//update vote & vote totals in SPTReviewComments store for record, rather than reloading all again
	var store = Ext.data.StoreManager.lookup('SPTReviewComments');
	
	var recordIndex = store.find('id', id);
	var currentRecord = store.getAt(recordIndex);
	currentRecord.set('agree', vote);
	
	
	var numAgree;
	var numVoted;
	var voted = currentRecord.get('voted');
	
	
	//check to see if already voted, if not then..
	if(voted == false){
		currentRecord.set('voted', true); 
		if(vote == true){
			numAgree = currentRecord.get('numAgree') + 1;
			currentRecord.set('numAgree', numAgree);
			numVote = currentRecord.get('numVote') + 1;
			currentRecord.set('numVote', numVote);
		} else{ //they disagreed, just increment numVote
			numVote = currentRecord.get('numVote') + 1;
			currentRecord.set('numVote', numVote);
		}
	}else{ //already voted in this session, don't increment numVoted
		if(vote == true){ //disagreed before, now agree
			numAgree = currentRecord.get('numAgree') + 1;
			currentRecord.set('numAgree', numAgree);
		} else{ //agreed before, now disagree
			numAgree = currentRecord.get('numAgree') - 1;
			currentRecord.set('numAgree', numAgree);
		}
	}
	
	
}


});