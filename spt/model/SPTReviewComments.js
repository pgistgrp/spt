 Ext.define('SPT.model.SPTReviewComments', {
    extend: 'Ext.data.Model',
    fields:['id', 'workflowId', 'title', 'content', {name: 'createTime', type: 'date', dateFormat: 'm/d/y h:iA'}, 
            {name: 'author', mapping: 'author.loginname'},'numAgree', 'numVote', 
            {name: 'deleted', type: 'boolean'}]
});
 
 
	
