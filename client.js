var gameTimer=Timers.GetContext().Get("Game");
var clear=Timers.GetContext().Get("Clr");
gameTime=3000;

Build.GetContext().Pipette.Value=1;

BreackGraph.PlayerBlockBoost=1;
Damage.GetContext().FriendlyFire.Value=1;
Properties.GetContext().GameModeName.Value="GameModes/Team Dead Match";
Ui.GetContext().MainTimerId.Value=gameTimer.Id;
Build.GetContext().BlocksSet.Value=BuildBlocksSet.AllClear;

var admins="2D2E2F256820C92/";
var vips="2F665AF97FA6F0EF/";
var banned="2F5C420A6D9AC5DE|FC31765F7E136211|C002224F3666744D|596D1288BD7F8CF7|C925816BE50844A9|9B94CBC25664BD6D|2F665AF97FA6F0EF|E24BE3448F7DF371|CBCE0678C099C56E|3F24586B534D937D";

var adminStatus="<b><color=red>ᴀᴅᴍɪɴ</color></b>";
var vipStatus="<b><color=yellow>ᴠɪᴘ</color></b>";
var testerStatus="<b><color=lime>ᴛᴇsᴛᴇʀ</color></b>";
var playerStatus="<b><color=white>ᴘʟᴀʏᴇʀ</color></b>";
var bannedStatus="<color=gray>ʙᴀɴɴᴇᴅ</color>";

Teams.Add("Players","<i><B>Ɓыжившие⚔</B></i>",{r:78,g:46,b:1});
var mainTeam=Teams.Get("Players");

Spawns.GetContext().SpawnPointsGroups.Add(2);
LeaderBoard.PlayerLeaderBoardValues=[{
Value:"Status",
DisplayName: "<b><color=white>status</color></b>"
},{
Value:"Scores" ,
DisplayName: "<b><color=yellow>$</color></b>"
},{
Value:"Deaths" ,
DisplayName: "<b><color=red>☠</color></b>"
},{
Value:"Id" ,
DisplayName: "id"
}];

LeaderBoard.PlayersWeightGetter.Set(function(p){
return p.Properties.Get("Scores").Value;
});

Teams.OnRequestJoinTeam.Add(function(p,t){
t.Add(p);
});

Teams.OnPlayerChangeTeam.Add(function(p){
p.Spawns.Spawn();
});

Players.OnPlayerConnected.Add(function(p){
init(p);
});

Spawns.GetContext().OnSpawn.Add(function(p){
p.Properties.Immortality.Value=1;
p.Timers.Get("imm").Restart(5);
});
Timers.OnPlayerTimer.Add(function(t){
if(t.Id=="imm")t.Player.Properties.Immortality.Value=0;
if(t.Id=="late_spawn"&&t.Player.Team==null)mainTeam.Add(t.Player);
});

Damage.OnDeath.Add(function(p){
if(p.Properties.Get("Status").Value!=adminStatus)clearInv(p,1);
p.Properties.Deaths.Value++;
});

Damage.OnKill.Add(function(p,k){
if(p!=k){
p.Properties.Kills.Value++;
p.Properties.Scores.Value+=100;
}
});

gameTimer.OnTimer.Add(function(){
Game.RestartGame();
});

function giveAdm(p){
p.inventory.Main.Value=1;
p.inventory.Secondary.Value=1;
p.inventory.Melee.Value=1;
p.inventory.Explosive.Value=1;
p.inventory.ExplosiveInfinity.Value=1;
p.inventory.Build.Value=1;
p.Build.FlyEnable.Value=1;
p.Build.RemoveQuad.Value=1;
p.Build.FillQuad.Value=1;
p.Build.FloodFill.Value=1;
p.Build.Pipette.Value=1;
p.Build.BuildRangeEnable.Value=1;
p.Build.CollapseChangeEnable.Value=1;
p.Build.BuildModeEnable.Value=1;
p.ContextedProperties.MaxHp.Value=100000;
p.ContextedProperties.SkinType.Value=2;
p.Properties.Get("Status").Value=adminStatus;
//p.Damage.DamageIn.Value=0;
}

function giveVip(p){
p.inventory.ExplosiveInfinity.Value=1;
p.Build.FlyEnable.Value=1;
p.ContextedProperties.MaxHp.Value=10000;
p.ContextedProperties.SkinType.Value=1;
p.Properties.Get("Status").Value=vipStatus;
}

function clearInv(p,melee){
p.inventory.Main.Value=0;
p.inventory.Secondary.Value=0;
if(!melee){
p.inventory.Melee.Value=0;
}
p.inventory.Explosive.Value=0;
p.inventory.Build.Value=0;
}

function item_fly(p){
if(p.Build.FlyEnable.Value)return 0;
p.Build.FlyEnable.Value=1;
return 1;
}

function item_shield200(p){
if(p.ContextedProperties.MaxHp.Value>=200)return 0;
p.ContextedProperties.MaxHp.Value=200;
return 1;
}

function item_shield500(p){
if(p.ContextedProperties.MaxHp.Value>=500)return 0;
p.ContextedProperties.MaxHp.Value=500;
return 1;
}

function item_zmskin(p){
if(p.ContextedProperties.SkinType.Value==1)return 0;
p.ContextedProperties.SkinType.Value=1;
return 1;
}

shop_items=[
["Полёт",10000,item_fly],
["Щит (200)",2000,item_shield200],
["Щит (500)",5000,item_shield500],
["Скин зомби",4000,item_zmskin]
];
var itemsLen=shop_items.length;

var shop_choiceArea=AreaPlayerTriggerService.Get("shop_choice");
shop_choiceArea.Tags=["shop_choice"];
shop_choiceArea.Enable=1;
shop_choiceArea.OnEnter.Add(function(p,a){
let itemIndex=p.Properties.Get("shop_index");
if(a.name=="page+"){
if(itemIndex.Value<itemsLen-1)itemIndex.Value++;
else itemIndex.Value=0;
}
else if(a.name=="page-"){
if(itemIndex.Value>0)itemIndex.Value--;
else itemIndex.Value=itemsLen-1;
}
else return;
let item=shop_items[itemIndex.Value];
p.Ui.Hint.Value=itemIndex.Value+": "+item[0]+", цена: "+item[1];
});

var shop_buyArea=AreaPlayerTriggerService.Get("shop_buy");
shop_buyArea.Tags=["shop_buy"];
shop_buyArea.Enable=1;
shop_buyArea.OnEnter.Add(function(p){
item=shop_items[p.Properties.Get("shop_index").Value];
price=item[1];
if(p.Properties.Scores.Value<price||!item[2](p))p.Ui.Hint.Value="Не удалось купить товар, недостаточно очков или достигнут лимит";
else{
p.Properties.Scores.Value-=price;
p.Ui.Hint.Value="Вы купили "+item[0];
}
});

var wpArea=AreaPlayerTriggerService.Get("weapon");
wpArea.Tags=["weapon"];
wpArea.Enable=1;
wpArea.OnEnter.Add(function(p,a){
if("Main/Secondary/Explosive/Build".search(a.name)==-1)return;
if(p.inventory[a.name].Value)return;
p.inventory[a.name].Value=1;
p.Ui.Hint.Value="Ты взял "+a.name;
});

var farmArea=AreaPlayerTriggerService.Get("farm");
farmArea.Tags=["farm"];
farmArea.Enable=1;
farmArea.OnEnter.Add(function(p){
p.Properties.Scores.Value+=20000;
});

var tpArea=AreaPlayerTriggerService.Get("tp");
tpArea.Tags=["tp"];
tpArea.Enable=1;
tpArea.OnEnter.Add(function(p,a){
if(a.name=="toSpawn"){
p.Spawns.SpawnPointsGroups.Clear();
p.Spawns.SpawnPointsGroups.Add(1);
p.Ui.Hint.Reset();
p.SetPositionAndRotation({x:84,y:14,z:84},{x:0,y:0});
p.inventory.Melee.Value=1;
}
else if(a.name=="toLobby"){
if(!p.Properties.Get("Status").Value!=adminStatus)clearInv(p,0);
p.Spawns.SpawnPointsGroups.Clear();
p.Spawns.SpawnPointsGroups.Add(2);
p.Damage.DamageIn.Value=1;
p.Damage.DamageOut.Value=1;
p.SetPositionAndRotation({x:1562,y:118,z:102},{x:0,y:-90});
p.Ui.Hint.Value="Вы находитесь в лобби, прыгните в портал что-бы попасть на карту";
}
});

function vis(tag,color){
v=AreaViewService.GetContext().Get(tag);
v.Tags=[tag];
v.Color={r:color[0],g:color[1],b:color[2]}
v.Enable=1;
}

//Визуализации зон
vis("shop_choice",[1,0.7,1]);
vis("shop_buy",[0,1,0]);
vis("tp",[1,0,1]);
vis("weapon",[1,1,1])
vis("farm",[1,1,0])

Ui.GetContext().Hint.Value="Находите полезный лут, стройте базы, объединяйтесь!";

var inv=Inventory.GetContext();
inv.Main.Value=0;
inv.MainInfinity.Value=1;
inv.Secondary.Value=0;
inv.SecondaryInfinity.Value=1;
inv.Melee.Value=0;
inv.Explosive.Value=0;
inv.Build.Value=0;
inv.BuildInfinity.Value=1;

function init(p){
//Определить статус
if(banned.search(p.id)!=-1){
mainTeam.Add(p);
p.Spawns.Despawn();
p.Properties.Get("Status").Value=bannedStatus;
return;
}
if(admins.search(p.id)!=-1)giveAdm(p);
else if(vips.search(p.id)!=-1)giveVip(p);
else if(p.Properties.TesterLvl.Value)p.Properties.Get("Status").Value=testerStatus;
else p.Properties.Get("Status").Value=playerStatus;
//Установка дефолтных property
p.Properties.Get("shop_index").Value=0;
p.Ui.Hint.Value="Добро пожаловать на сервер. Вы находитесь в лобби, прыгните в портал что-бы попасть на карту";
p.Properties.Get("Id").Value=p.id.slice(0,8)+"\n"+p.id.slice(8,16);
p.Timers.Get("late_spawn").Restart(10);
}

clear.OnTimer.Add(function(){MapEditor.SetBlock(AreaService.Get('clr'), 0);});
clear.RestartLoop(6);

Spawns.GetContext().RespawnTime.Value=5;
gameTimer.Restart(gameTime);
for(e=Players.GetEnumerator();e.MoveNext();)init(e.Current);