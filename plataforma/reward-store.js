/* Local, user-scoped educational receipts + cosmetic purchases. No backend balance
   is claimed. Write failures are explicit; no reward is acknowledged before save. */
(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory;
  else root.ILRewardStore=factory(root.ILRewards,root.localStorage);
})(typeof globalThis!=='undefined'?globalThis:this,function(Rewards,storage){
  'use strict';
  const key=user=>'il_rewards_v1_'+encodeURIComponent(String(user||'').trim().toLowerCase());
  function read(user){
    const raw=storage.getItem(key(user));if(!raw)return {receipts:[],purchases:[]};
    const data=JSON.parse(raw);
    if(!data||!Array.isArray(data.receipts)||!Array.isArray(data.purchases))throw new Error('invalid_reward_storage');
    return data;
  }
  function save(user,data){if(!user)throw new Error('reward_user_required');storage.setItem(key(user),JSON.stringify(data));}
  function get(user){const data=read(user);return Rewards.project(data.receipts,data.purchases);}
  function record(user,receipt){
    const data=read(user);
    if(!data.receipts.some(r=>r.sessionKey===receipt.sessionKey)){data.receipts.push(receipt);save(user,data);}
    const projection=Rewards.project(data.receipts,data.purchases);
    return {projection,session:projection.resultBySession[receipt.sessionKey]||null};
  }
  function purchase(user,itemId,date){
    const data=read(user),before=Rewards.project(data.receipts,data.purchases),item=Rewards.SHOP.find(i=>i.id===itemId);
    if(!item)return {ok:false,reason:'invalid-item'};
    if(before.owned.includes(itemId))return {ok:false,reason:'owned'};
    if(before.balance<item.price)return {ok:false,reason:'balance'};
    const id='purchase:'+itemId;
    data.purchases.push({id,itemId,date,purchasedAt:new Date().toISOString()});
    const after=Rewards.project(data.receipts,data.purchases);
    if(!after.accepted.some(p=>p.id===id))return {ok:false,reason:'balance'};
    save(user,data);return {ok:true,projection:after};
  }
  function next(user,band,date){const data=read(user);return Rewards.next(data.receipts,data.purchases,band,date);}
  return {get,record,purchase,next,_key:key};
});
