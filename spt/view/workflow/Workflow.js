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
	     height:30,
	     width:350,
	     items: [{
			xtype: 'combobox',
			fieldLabel: 'Choose a discussion topic:',
			displayField: 'name',
			labelWidth: 150,
			store: 'SPTWorkflows',
			queryMode: 'local',
			forceSelection: 'true'
	     }]
	 }];

    this.callParent(arguments);
}

});