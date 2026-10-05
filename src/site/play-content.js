// Authoritative bilingual play content. Next.js server pages and browser filters share this module.
const bilingual=(en,zh)=>({en,'zh':zh});
const step=(en,zh,textEn,textZh,productId=null)=>({label:bilingual(en,zh),text:bilingual(textEn,textZh),productId});
function idea(id,title,mode,age,players,difficulty,products,tiles,ruleType,summary,setup,ruleSteps,easier,variation,skills,settings=['home','classroom'],type='signature'){
 return {id,title:bilingual(...title),mode,ageMin:age[0],ageMax:age[1],playersMin:players[0],playersMax:players[1],difficulty,productIds:products,tiles,prepMinutes:3,durationMinutes:{min:5,max:10},settings,contentType:type,ruleType,summary:bilingual(...summary),setup:bilingual(...setup),ruleSteps,steps:{en:ruleSteps.map(s=>s.text.en),'zh':ruleSteps.map(s=>s.text['zh'])},easier:bilingual(...easier),variation:bilingual(...variation),skills:bilingual(...skills),tip:bilingual('Keep the invitation flexible. Pointing or describing is enough.','保持邀请开放，指认或描述都可以。'),requirements:{selection:mode==='mix'?'all':'any',products:products.map(productId=>({productId,tiles:mode==='mix'?'2':tiles})),extras:[]},version:'1.0',updatedAt:'2026-10-04'};
}
export const playRedirects={'animal-story-trail':'story-steps','calm-corner-path':'quiet-steps'};
export const playIdeas=[
 idea('animal-safari',['Animal Safari','动物探险'],'explore',[3,6],[1,4],'discover',['td01'],'3–8','find-target',
  ['Find the named animal, step over to it, and describe what you notice.','找到被点名的动物，走过去，说说它的特征。'],
  ['Lay 3–8 animal tiles separately in an open area. Leave room for waiting beside the route.','用 3–8 片动物垫排开放路线或散点，旁边留等候位置。'],[
  step('Listen','听线索','An adult names a visible animal, such as the penguins.','成人说出图上可见的动物，例如企鹅。','td01'),
  step('Find','找目标','Point to the matching animal, then walk to its tile.','指向对应动物，再走到那片地垫。','td01'),
  step('Describe','说发现','Describe one feature, then let another player choose the next animal.','描述一个特征，再让下一人选择动物。','td01')],
  ['Use three tiles and allow pointing instead of naming.','只用三片，允许指认，不要求说名字。'],['Give a habitat clue or try an animal movement with Move Like an Animal.','加入栖息地线索，或转到动物模仿秀。'],['Observation, listening and animal naming.','观察、听指令、动物辨认。']),
 idea('move-like-an-animal',['Move Like an Animal','动物模仿秀'],'explore',[3,7],[2,6],'challenge',['td01'],'3–8','command-action',
  ['Choose an animal, copy a simple movement, and let a friend guess.','选一只动物，模仿简单动作，让同伴猜。'],
  ['Place animal tiles separately, with a clear space beside them for waiting and movement.','动物垫单层分开放，旁边留出等候和动作空间。'],[
  step('Choose','选动物','One player points to an animal without saying its name.','一人指向动物，不先说名字。','td01'),step('Pretend','做动作','Try a gentle penguin sway or a slow turtle step, with adult guidance.','在成人引导下轻轻摇摆模仿企鹅，或慢步模仿海龟。','td01'),step('Guess & swap','猜并换人','Friends guess the animal, then swap roles. One child uses a tile at a time.','同伴猜动物，然后交换角色；每片一次一人。','td01')],
  ['Name the animal first and demonstrate together.','先说出动物，一起示范。'],['Let children invent a new movement and explain it.','让孩子自创一个动作，并说明规则。'],['Imagination, controlled movement and turn-taking.','想象、动作控制、轮流。']),
 idea('story-steps',['Story Steps','故事脚步'],'explore',[4,7],[1,4],'challenge',['td01'],'3–8','sequence',
  ['Add one sentence at each animal stop to build a shared story.','每到一个动物站点，接一句共同的故事。'],
  ['Use 3–8 animal tiles in a short line or gentle curve, with all borders visible.','用 3–8 片动物垫排短直线或缓弯，保持边界可见。'],[
  step('Begin','开个头','Name the first animal and start a story: “The lion went on an adventure.”','认第一只动物并开头：“狮子去冒险了。”','td01'),step('Continue','接一句','At the next animal, add what happened next. Players may pause to press and observe the liquid.','到下一只动物时接续情节，也可停下按压观察液体。','td01'),step('Finish','一起结尾','Take turns until the last stop, then give the story an ending.','轮流讲到最后一站，给故事一个结尾。','td01')],
  ['For a younger child aged 3+, pointing or adding one word is enough; an adult carries the story.','三岁起的简化版可只指认或补一个词，由成人接续故事。'],['Let children choose the order and create their own storytelling rule.','孩子决定站点顺序和接故事规则。'],['Language, imagination and sequencing.','语言表达、想象、顺序理解。'],['home','classroom','reading']),
 idea('color-command',['Color Command','颜色指令'],'move',[3,6],[1,6],'discover',['td02'],'3–8','command-action',
  ['Agree on color-to-action rules, then listen and try each movement.','先约定颜色对应的动作，再听指令完成。'],
  ['Use 3–8 Color Duos tiles with clear access around them. Choose visible colors together.','用 3–8 片双色垫，周围留通道，一起确认可见颜色。'],[
  step('Agree','定规则','Choose gentle actions: blue means slow steps, yellow means tiptoe, green means pause.','约定简单动作：蓝色慢步，黄色踮脚，绿色停住。','td02'),step('Listen & act','听并做','An adult calls a color. One explorer tries the matching action while others wait.','成人喊颜色，一位探索者完成动作，其他人在旁等候。','td02'),step('Take turns','轮流出题','Swap the caller and explorer. Start with two color rules before adding another.','交换发令者和探索者，先用两条规则再增加。','td02')],
  ['Use one action and show it before each turn.','只用一个动作，每轮先示范。'],['Let a child suggest a new color-action pairing.','孩子提出新的颜色与动作对应。'],['Color choices, listening and switching actions.','颜色辨认、听指令、动作切换。']),
 idea('follow-my-path',['Follow My Path','跟着我的路线'],'move',[4,7],[2,4],'challenge',['td02'],'3–8','sequence',
  ['Watch a short color route, repeat it, then swap the leader.','看一段颜色路线，记住并复现，再交换领路人。'],
  ['Lay 3–8 tiles in an open layout; make a waiting spot beside the route.','用 3–8 片垫子排开放布局，旁边设等候点。'],[
  step('Show','先示范','The leader chooses and walks a three-step color route.','领路人选一段三步颜色路线并走一遍。','td02'),step('Remember','记顺序','The next player watches, then repeats the same sequence.','下一人观察，再按相同顺序走。','td02'),step('Swap','交换角色','Swap leaders. Add another step only when everyone is ready.','交换领路人，准备好后再加一步。','td02')],
  ['Start with two stops and point out the route together.','从两站开始，一起指认路线。'],['Try four or five stops, or let the group build a new sequence.','增加到四五站，或一起设计新顺序。'],['Observation, working memory and turn-taking.','观察、顺序记忆、轮流。']),
 idea('build-a-color-course',['Build a Color Course','自创彩色挑战'],'move',[4,8],[1,6],'create',['td02'],'3–8','create-rules',
  ['Design a color route and decide what happens at each stop.','设计颜色路线，为每一站约定任务。'],
  ['Start with 3–8 tiles. Everyone waits off the play area while an adult helps arrange them.','准备 3–8 片，所有人在区域外等候，成人协助摆放。'],[
  step('Arrange','排路线','Children suggest a line, grid or curve; an adult helps place each tile flat without overlap.','孩子提出直线、方阵或缓弯，成人协助单层平放，不重叠。','td02'),step('Make rules','定任务','Choose a simple task at each station, such as walk slowly, point to a color or pause.','每站定简单任务，如慢步、指颜色或停留。','td02'),step('Try & change','试玩修改','Explain the route, invite a player to try, then step aside before changing the layout.','讲清规则、邀请试玩，退出区域后再修改布局。','td02')],
  ['Use three stations with the same task.','三站用同一个任务。'],['Let a partner change one rule and explain the new route.','同伴改一条规则并介绍新路线。'],['Planning, communication and creating rules.','规划、沟通、规则创造。']),
 idea('quiet-steps',['Quiet Steps','安静脚步'],'reset',[3,7],[1,3],'discover',['td03'],'3–8','pause-observe',
  ['Take gentle steps, pause to notice a pattern, and continue at your own pace.','轻轻落脚，停看纹理，再按自己的节奏继续。'],
  ['Lay 3–8 Aqua Tones tiles in a short path beside a quiet space. Keep away from furniture legs and doorways.','在安静空间旁用 3–8 片 Aqua 垫排短路线，避开家具腿和门口。'],[
  step('Choose','选起点','Choose a blue or green tile as the start.','选蓝色或绿色垫作为起点。','td03'),step('Step softly','轻轻走','Walk to the next tile with gentle footfalls. There is no race.','轻轻走到下一片，不竞速。','td03'),step('Pause & notice','停看继续','Pause to notice the liquid, then continue. In a reading nook, keep the route beside the books.','停看液体，再继续；阅读角版本让路线留在书架旁，不压书本。','td03')],
  ['Use three nearby stations and walk with an adult.','三站距离适中，成人陪同。'],['Let another player choose the next color; rearrange only after everyone steps aside.','让下一人选颜色，大家退出后再换布局。'],['Pacing, body awareness and observation.','速度调节、身体意识、观察。'],['home','classroom','reading']),
 idea('balance-islands',['Balance Islands','平衡小岛'],'reset',[4,8],[1,4],'challenge',['td03'],'3–8','pause-observe',
  ['Stand steadily on each island, pause, then walk to the next stop.','在每座小岛上站稳停留，再走到下一站。'],
  ['Use a short route of 3–8 Aqua tiles with manageable steps and a waiting space.','用 3–8 片 Aqua 垫排短路线，步距适中，旁边留等候区。'],[
  step('Step','走上小岛','Walk to the first island with both feet supported.','走到第一座小岛，双脚稳稳站好。','td03'),step('Pause','站稳停留','Pause for three seconds in a comfortable two-foot stance. An adult stays nearby.','双脚舒适站稳，停留三秒，成人在旁。','td03'),step('Continue','走下一站','Walk to the next island and repeat; change explorer after the route.','走到下一站重复，完成路线后换人。','td03')],
  ['Make the pause shorter and offer an adult hand.','缩短停留，成人可伸手协助。'],['Try a different comfortable arm position while keeping both feet supported.','保持双脚站稳，尝试不同舒适手臂姿势。'],['Balance, controlled posture and body awareness.','平衡、姿势控制、身体意识。'],['home','classroom','reading']),
 idea('slow-motion-trail',['Slow Motion Trail','慢动作挑战'],'reset',[4,7],[1,4],'challenge',['td03'],'3–8','pause-observe',
  ['Keep a slow step–pause rhythm along a short route.','沿短路线保持慢步、停留的节奏。'],
  ['Arrange 3–8 Aqua tiles in a short line or gentle curve with clear access.','用 3–8 片 Aqua 垫排短直线或缓弯，留出通道。'],[
  step('Set a rhythm','定节奏','Agree on “slow step, pause, continue” and demonstrate once.','约定“慢步、停留、继续”，先示范一次。','td03'),step('Follow','跟节奏','Walk the route at that pace. Stepping on the floor between tiles is allowed.','按约定节奏走；垫子之间可以踩地面。','td03'),step('Repeat','再试一次','Take turns and compare the rhythms you tried, without ranking speed.','轮流尝试，说说节奏，不排名快慢。','td03')],
  ['Try two stations with an adult setting the pace.','用两站，成人带节奏。'],['Let a child suggest a different slow rhythm for the group.','孩子设计另一种慢节奏。'],['Pacing, attention to a sequence and movement control.','节奏、顺序注意、动作控制。'],['home','classroom','reading']),
 idea('adventure-trail',['Adventure Trail','冒险路线'],'mix',[4,8],[1,6],'challenge',['td01','td02','td03'],'6','mixed-route',
  ['Imagine at an animal stop, move at a color stop, and pause at an Aqua stop.','动物站想象，双色站行动，Aqua 站停留。'],
  ['Use two tiles from each collection: six in total. An adult arranges an open route while everyone waits aside.','每系列取两片，共六片；大家在旁等候，成人排开放路线。'],[
  step('Imagine','想象','At an animal tile, name a character or try a gentle animal movement.','到动物垫时，说角色或模仿简单动作。','td01'),step('Move','行动','At a Color Duos tile, complete an agreed action, such as slow steps.','到双色垫时，完成约定动作，如慢步。','td02'),step('Pause','停留','At an Aqua tile, pause and describe the pattern; repeat the three roles along the route.','到 Aqua 垫时停看纹理，沿路线重复三种角色。','td03')],
  ['With two collections, choose two distinct roles; follow the route together.','只有两系列时，明确两个不同角色，一起走。'],['Ask children to change one station rule and explain the switch.','孩子改一站规则，并说明变化。'],['Switching rules, imagination and remembering tasks.','规则切换、想象、任务记忆。']),
 idea('build-your-own-adventure',['Build Your Own Adventure','自创冒险'],'mix',[4,8],[1,6],'create',['td01','td02','td03'],'6','create-rules',
  ['Choose story, movement and pause rules, then invite someone to try your adventure.','自选故事、动作和停顿规则，再邀请同伴试玩。'],
  ['Use two tiles from each collection. Children suggest the route; an adult helps arrange it while others wait off the area.','每系列两片，孩子提出路线，成人协助摆放，其他人在区域外等候。'],[
  step('Imagine','定故事','Choose the characters or story for the animal stations.','为动物站选择角色或故事。','td01'),step('Move','定动作','Choose a simple action or color order for the Color Duos stations.','为双色站选择简单动作或颜色顺序。','td02'),step('Pause','定停顿','Choose what to notice at the Aqua stations. Explain all rules, try the route, then revise together.','为 Aqua 站决定观察什么；讲清全部规则、试玩，再一起修改。','td03')],
  ['Use two collections and one task for each; an adult helps explain.','用两个系列，各定一个任务，成人协助说明。'],['Invite someone else to redesign one station and try their version.','邀请同伴改一站，再试玩新版本。'],['Creating, planning, communication and collaboration.','创造、规划、沟通、协作。']),
 idea('treasure-quest',['Treasure Quest','寻宝任务'],'mix',[4,8],[2,6],'create',['td01','td02','td03'],'6','mixed-route',
  ['Create animal, color and pause clues for a friend to find a paper treasure.','设计动物、颜色和停顿线索，让同伴找到纸质宝藏。'],
  ['Use two tiles from each collection and a paper treasure card placed beside the final stop.','每系列两片，终点旁放一张纸质宝藏卡。'],[
  step('Make clues','编线索','Children and an adult create a route: start with an animal, then choose a visible color.','孩子和成人编路线线索：从动物起步，再选可见颜色。','td01'),step('Follow','找路线','A partner follows the clues through the Color Duos stations while the group helps.','同伴按线索经过双色站点，小组一起提示。','td02'),step('Pause & find','停看寻宝','Pause at an Aqua station before finding the card beside the last stop; swap clue-makers and explorers.','在 Aqua 站停看，再找最后一站旁的卡片，交换出题者与探索者。','td03')],
  ['An adult provides two clues; this guided variation is Challenge.','成人提供两条线索；此执行版本属于 Challenge。'],['Let the children invent a new clue route and explain it to another group.','孩子自编新线索，向另一组解释。'],['Clue-making, problem solving and cooperation.','线索设计、解决问题、合作。']),
 idea('choose-a-color',['Choose a Color, Choose a Step','选一个颜色，走下一步'],'move',[3,6],[1,4],'discover',['td02'],'3–8','turn-taking',
  ['Choose the next color yourself, explore its pattern, then swap roles.','自己选下一种颜色，探索纹理，再交换角色。'],
  ['Place 3–8 Color Duos tiles in an open path, with a waiting spot beside it.','用 3–8 片双色垫排开放路线，旁边留等候点。'],[
  step('Choose','自主选择','One player points to a visible color on a tile. Naming the color is optional.','一人指向垫上可见颜色，不要求说对色名。','td02'),step('Explore','探索描述','The explorer steps or presses on it and describes the moving liquid.','探索者踩踏或按压，说说液体变化。','td02'),step('Swap','交换角色','Swap chooser and explorer; a solo player can do both, with an adult nearby.','交换选择者和探索者；单人可自己完成，成人陪同。','td02')],
  ['Start with three tiles and allow gestures.','从三片开始，允许手势回应。'],['Explain your choice; for fixed action rules try Color Command, or for memory try Follow My Path.','说说为何选这片；固定动作规则可玩颜色指令，记顺序可玩跟着我的路线。'],['Agency, observation, describing and turn-taking.','自主选择、观察、描述、轮流。'],['home','classroom'],'starter'),
 idea('quiet-color-watch',['Quiet Color Watch','静静看蓝绿流动'],'reset',[3,8],[1,4],'discover',['td03'],'1–4','pause-observe',
  ['Look, press with a hand, then lift your hand and describe the changing pattern.','先看、用手按压、移开，再描述纹理变化。'],
  ['Place 1–4 Aqua tiles beside a quiet indoor area. Keep books and furniture off them.','安静室内区域旁平放 1–4 片 Aqua 垫，书本和家具不压在上面。'],[
  step('Look','先观察','Choose a blue or green tile and look at its current pattern.','选蓝色或绿色垫，先看当前纹理。','td03'),step('Press','按压','Press with a hand and notice where the color moves.','用手按压，观察颜色往哪里移动。','td03'),step('Lift & notice','移开继续看','Lift your hand, keep observing, then invite another player to choose. There is no timer.','移开手继续看，再邀请下一人选择，不设倒计时。','td03')],
  ['Use one tile and let an adult demonstrate once.','只用一片，成人示范一次。'],['Compare the pattern before and after a press. For movement, try Quiet Steps.','比较按压前后纹理；想加入移动可玩安静脚步。'],['Observation, describing changes and taking turns.','细节观察、变化描述、轮流。'],['home','classroom','reading'],'starter'),
 idea('three-tile-layouts',['Three Tile Layouts','一套地垫，三种摆法'],'move',[3,8],[1,6],'discover',['td01','td02','td03'],'8','create-rules',
  ['Use any one eight-tile collection to make a line, grid or gentle curve.','任一八片系列都可排直线、方阵或缓弯。'],
  ['Start with one collection. Rearrange only while children wait outside the play area.','使用任一系列一套，孩子在区域外等候时再调整。'],[
  step('Line','直线','Place tiles one after another, flat and without overlap.','依次单层平放，不重叠。'),step('Grid','方阵','Try two rows of four with every border visible.','两行四列，边界可见。'),step('Curve','缓弯','Change positions to form a gentle turn without blocking a walkway.','改变位置让路线缓转，不堵通道。')],
  ['Start with fewer tiles.','先用更少片数。'],['Add a task using Build a Color Course or Build Your Own Adventure.','搭配自创彩色挑战或自创冒险加入任务。'],['A setup reference, not a separate game.','这是布置参考，不是独立游戏。'],['home','classroom'],'guide'),
 idea('preschool-turn-taking',['Preschool Turn-Taking','课堂轮流组织指南'],'explore',[3,8],[2,6],'discover',['td01','td02'],'4–8','turn-taking',
  ['Organize chooser, explorer and observer roles for a shared classroom activity.','用选择者、探索者、观察者组织课堂活动。'],
  ['Choose either suitable collection, use 4–8 tiles and prepare a waiting space with adult supervision.','任选适用系列，用 4–8 片，在成人监护下设等候区。'],[
  step('Choose','选择者','One child points to an animal or visible color.','一人指动物或可见颜色。'),step('Explore','探索者','The next child presses or steps; only one child uses a tile at a time.','下一人按压或踩踏，每片一次一人。'),step('Observe & swap','观察并轮换','Others describe what they noticed, then rotate roles. Adapt group size to the room.','其他人描述所见，再轮换角色；人数按空间调整。')],
  ['Use two roles and demonstrate a turn.','从两个角色开始，示范一轮。'],['Use these roles alongside a Signature game; multiple compatible products do not make this Mixed Play.','将角色用于代表玩法；适用多个产品并不等于混合玩法。'],['A group organization reference, not a separate game.','这是小组组织参考，不是独立游戏。'],['classroom'],'guide')
];
playIdeas.find(i=>i.id==='treasure-quest').requirements.extras=[bilingual('One paper treasure card','一张纸质宝藏卡')];
