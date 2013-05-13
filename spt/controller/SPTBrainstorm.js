Ext.define('SPT.controller.SPTBrainstorm', {
    extend: 'Ext.app.Controller',
    
    stores: ['SPTKeywords', 'SPTConcerns', 'SPTWorkflows', 'SPTWorkflow'],
    
    models: ['SPTKeyword', 'SPTConcern'],
    
    views: ['bct.Brainstorm'],
        
    refs: [
           {ref: 'feedbackForm', selector: 'brainstorm #feedbackForm'},
           {ref: 'feedbackTextArea', selector: 'brainstorm #feedbackTextArea'}
        ],

    init: function() {
        this.control({
            
            'brainstorm button[action=getkeywords]': {
                click: this.getKeywords
            },
            
            'brainstorm button[action=addkeyword]': {
                click: this.addManualTag
            },
            
            'brainstorm button[action=submit]': {
                click: this.saveConcern
            },
            
            'brainstorm button[action=cancel]': {
                click: this.cancelConcern
            }
        });
    },
    
    getKeywords: function(button) {
        
		var keywordStore = this.getSPTKeywordsStore();
		var feedbackForm = this.getFeedbackForm();
    	
    	if(feedbackForm.getForm().isValid()){
			
			var feedbackText = this.getFeedbackTextArea().getValue();
			var originalUrl = keywordStore.getProxy().url; //workaround: temp variable for storing proxy url without param
			keywordStore.getProxy().url = keywordStore.getProxy().url + feedbackText;
			
			keywordStore.load(function(records, operation, success) {
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
				
				button.hidden = true;
        
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
					itemId: 'manualBtn'
				});
		
				feedbackForm.add(keywordGroup);
				feedbackForm.add(manualTag);
				feedbackForm.add(addManualButton);
				
				var submitButton = Ext.create('Ext.Button',{
					text : 'Submit',
					action: 'submit',
					itemId: 'submitBtn'
				});
				var cancelButton = Ext.create('Ext.Button',{
					text : 'Cancel',
					action: 'cancel',
					itemId: 'cancelBtn'
				});
				
				feedbackForm.add(submitButton);
				feedbackForm.add(cancelButton);
				
			});
			
			keywordStore.getProxy().url = originalUrl; //reset url to remove parameter
    	}
    },
    
    addManualTag: function(button) {
    	var feedbackForm = this.getFeedbackForm();
    	var manualTag = feedbackForm.getComponent('manualTag').getValue();
    	if(manualTag != ""){
    		newTag = this.getSPTKeywordModel().create({tags: manualTag, potentialtags: '', successful: true});
    		this.getSPTKeywordsStore().add(newTag);
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
    
    saveConcern: function(button){
    	var feedbackForm = this.getFeedbackForm();
    	var keywordGroup = feedbackForm.getComponent('keywordGroup');
    	var selectedTags = keywordGroup.getChecked();
        
    	if(selectedTags.length <2){
    		alert('Please select at least 2 keywords');
        }else{
        	var concernStore = this.getSPTConcernsStore();
        	
        	//get current workflow
        	var workflowRecord = this.getSPTWorkflowsStore().getAt(0);
    		var openWorkflowsStore = workflowRecord.openWorkflows();
    		var index = openWorkflowsStore.find('selected', true);
    		var currentWorkflow = openWorkflowsStore.getAt(index);
    		
    		//get BCT contextid and activityid, TODO: fix assumption that brainstorm is only method
    		var bctIndex = this.getSPTWorkflowStore().find('workflowId',currentWorkflow.get('id'));
    		var brainstormMethod = this.getSPTWorkflowStore().getAt(bctIndex);
    		var contextId = brainstormMethod.get('contextId');
    		var brainstormGamesStore = brainstormMethod.pgameActivityList();
    		var activityId = brainstormGamesStore.getAt(0).get('activityId');
    		
    		console.log("wf=" + currentWorkflow.get('id') + "cxt="+ contextId + "act="+ activityId);
        	
        	var selectedTagsString = '';
        	for (i=0; i<selectedTags.length; i++){
        		selectedTagsString += selectedTags[i].getName()+ ',';  
        	}
        	
        	concernStore.getProxy().url = concernStore.getProxy().url
        		+ this.getFeedbackTextArea().getValue() 
        		+ '/'+ selectedTagsString 
        		+ '/'+ "CyberGIS Gateway" //TODO: add category select box
        		+ '/'+ currentWorkflow.get('id')
        		+ '/'+ contextId
        		+ '/'+ activityId; 
        	
        	concernStore.load(function(records, operation, success) {
        		console.log(records.length);
        		//in the future save to concern store 
        	});
        	
        	this.resetForm();
        }
    },
    
    cancelConcern: function(button){
    	this.resetForm();
    },
    
    resetForm: function(){
    	var feedbackForm = this.getFeedbackForm();
    	
    	feedbackForm.getForm().reset();
    	
    	feedbackForm.remove('keywordGroup');
		feedbackForm.remove('manualTag');
		feedbackForm.remove('manualBtn');
		
		feedbackForm.remove('submitBtn');
		feedbackForm.remove('cancelBtn');
		var continueBtn = feedbackForm.queryById('continueBtn');
		continueBtn.setVisible(true);
    }
});