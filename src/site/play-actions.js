// Reusable approved action drawings, not depictions of physical product tiles.
export const actionIcon=id=>`<svg class="play-action-icon" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><use href="/assets/play-actions.svg#${id}"/></svg>`;
export const modeActions={explore:'animal',move:'color',reset:'slow',mix:'build'};
const actions={
 'animal-safari':['animal','animal','story'],
 'move-like-an-animal':['animal','slow','turn'],
 'story-steps':['story','story','story'],
 'color-command':['color','slow','turn'],
 'follow-my-path':['path','look','turn'],
 'build-a-color-course':['build','color','path'],
 'quiet-steps':['color','slow','look'],
 'balance-islands':['slow','stand','path'],
 'slow-motion-trail':['slow','path','turn'],
 'adventure-trail':['animal','slow','look'],
 'build-your-own-adventure':['story','color','look'],
 'treasure-quest':['animal','path','look'],
 'choose-a-color':['color','press','turn'],
 'quiet-color-watch':['look','press','look'],
 'three-tile-layouts':['build','path','build'],
 'preschool-turn-taking':['color','press','turn']
};
export const stepAction=(idea,index)=>actions[idea.id]?.[index]||modeActions[idea.mode];
export const cardAction=idea=>({'story-steps':'story','follow-my-path':'path','balance-islands':'stand','quiet-color-watch':'press','three-tile-layouts':'build','preschool-turn-taking':'turn'}[idea.id]||(idea.difficulty==='create'?'build':modeActions[idea.mode]));
