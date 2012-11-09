Ext.define('SPT.spt.Workflow' ,{
    extend: 'Ext.panel.Panel',
    alias: 'widget.workflow',

    requires: ['Ext.form.Panel', 'Ext.form.field.ComboBox'],

    title : 'Experiment',
    layout: 'fit',
    autoShow: true,
    height: 120,
    width: 280,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                padding: '5 5 0 5',
                border: false,
                style: 'background-color: #fff;',

                items: [
                    {
                        xtype: 'combobox',
                        name : 'experiment',
                        fieldLabel: 'Choose your discussion topic',
                        displayField: 'name',
                        width: 320,
                        labelWidth: 130,
                        store: 'SPTWorkflows',
                        queryMode: 'local',
                        forceSelection: 'true'
                    }
                ]
            }
        ];


        this.callParent(arguments);
    }
});
