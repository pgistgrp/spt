 Ext.define('SPT.model.SPTConcernReplies', {
    extend: 'Ext.data.Model',
    fields:['id',{name: 'concernId', mapping: 'concern.id'}, 'content', {name: 'createTime', type: 'date', dateFormat: 'm/d/y h:iA'}, 
            {name: 'author', mapping: 'author.loginname'},'title','numAgree', 'numVote', 'object']
});
 
	
