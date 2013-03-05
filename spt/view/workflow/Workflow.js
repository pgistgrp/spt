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
	     width:350,
	     items: [{
			xtype: 'combobox',
			fieldLabel: 'Choose a discussion topic:',
			labelWidth: 150,
			width:340,
			displayField: 'name',
			valueField: 'id',
			store: 'SPTWorkflows',
			queryMode: 'local',
			forceSelection: 'true'
	     }]
	 }];

    this.callParent(arguments);
}

});