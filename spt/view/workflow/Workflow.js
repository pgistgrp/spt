Ext.define('SPT.view.workflow.Workflow' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.workflow',
    
    requires: ['Ext.form.Panel'],
    

initComponent: function() {
	
	this.items = [{
	     xtype: 'form',
	     padding: '5 5 0 5',
	     border: false,
	     frame: true,
	     height:50,
	     width:400,
	     items: [{
			xtype: 'combobox',
			itemId:'workflowCombobox',
			fieldLabel: 'Choose a discussion topic:',
			labelWidth: 150,
			labelStyle: 'color: #15428b; font-size: 12px;',
			width:350,
			displayField: 'name',
			valueField: 'id',
			store: 'SPTWorkflows',
			queryMode: 'local',
			forceSelection: true,
			lastQuery: ''
	     }]
	 }];

    this.callParent(arguments);
}

});