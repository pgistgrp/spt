Ext.define('SPT.controller.SPTBrainstorm', {
    extend: 'Ext.app.Controller',
    
    stores: ['SPTKeywords'],
    
    models: ['SPTKeyword'],
    
    views: ['bct.Brainstorm' ],
        
    refs: [
           {ref: 'brainstorm', selector: 'brainstorm'},
           {ref: 'feedbackForm', selector: 'brainstorm #feedbackForm'},
           {ref: 'feedbackTextArea', selector: 'brainstorm #feedbackTextArea'}
        ],

    init: function() {
        this.control({
            'viewport > panel': {
            	 renderTo: Ext.getBody()
            },
            
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
			
			keywordStore.getProxy().url = 'http://localhost:8080/dwr/jsonp/BCTAgent/prepareConcern/' + feedbackText;
			
			keywordStore.load(function(records, operation, success) {
				console.log(records);
				console.log(keywordStore.data.length);
			
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
					alignTo: 'manualTag'
				});
		
				feedbackForm.add(keywordGroup);
				feedbackForm.add(manualTag);
				feedbackForm.add(addManualButton);
				
			});
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
    	console.log('submit');
    },
    
    cancelConcern: function(button){
    	console.log('cancel');
    }
});