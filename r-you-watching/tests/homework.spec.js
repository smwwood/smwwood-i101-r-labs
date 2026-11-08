import {test,expect} from '@playwright/test';
import {unzipSync} from 'fflate';
import fs from 'node:fs';
const basic=[
 'hist(rated_episodes$rating)',
 'line_graph(rated_episodes, episode_order, rating)',
 'sample(episodes$summary[nzchar(episodes$summary)], 4)\nepisodes$michael <- grepl("Michael", episodes$summary, ignore.case=TRUE)\nepisodes$jim <- grepl("Jim", episodes$summary, ignore.case=TRUE)\nepisodes$pam <- grepl("Pam", episodes$summary, ignore.case=TRUE)\nepisodes$dwight <- grepl("Dwight", episodes$summary, ignore.case=TRUE)\nword_counts <- data.frame(word=c("Michael","Jim","Pam","Dwight"), count=c(sum(episodes$michael),sum(episodes$jim),sum(episodes$pam),sum(episodes$dwight)))\nbar_graph(word_counts, word, count)'
];
const customized=[
 'hist(rated_episodes$rating, col="turquoise3", border="white", breaks=12, main="Ratings distribution", xlab="Episode rating", las=1)',
 'line_graph(rated_episodes, episode_order, rating, col="steelblue", lwd=3, type="b", pch=19, cex=.6, ylim=c(0,10), main="Ratings across the series")',
 'bar_graph(word_counts, word, count, col="coral", border="white", horiz=TRUE, space=.5, main="Characters in descriptions")'
];
async function run(page,kind){await page.locator('#run-'+kind).click();await expect(page.locator('#run-'+kind)).toBeEnabled({timeout:90000});await expect(page.locator('#output-'+kind)).not.toHaveClass(/error/);await expect(page.locator('#graph-'+kind+' img')).toBeVisible();}
test('six independent graphs, refresh, shared objects and finalized ZIP',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Choose Your Show →'}).click();await page.getByText('Need a starting point? Or is TVmaze unavailable? Use the bundled example of The Office.').click();await page.getByRole('button',{name:'Use The Office example'}).click();await page.getByRole('button',{name:'Start Investigating →'}).click();await expect(page.locator('#run-basic')).toBeEnabled({timeout:150000});
 const originals=[],finals=[];
 for(let i=0;i<3;i++){
  await page.getByRole('button',{name:['Ratings','Trends','Storylines'][i],exact:true}).click();await page.locator('#editor-basic').fill(basic[i]);await run(page,'basic');originals[i]=await page.locator('#graph-basic img').getAttribute('src');await page.locator('#editor-custom').focus();await expect(page.locator('#editor-custom')).toHaveValue(basic[i]);await page.locator('#editor-custom').fill(customized[i]);await run(page,'custom');finals[i]=await page.locator('#graph-custom img').getAttribute('src');expect(finals[i]).not.toBe(originals[i]);expect(await page.locator('#graph-basic img').getAttribute('src')).toBe(originals[i]);await expect(page.locator('#editor-basic')).toHaveValue(basic[i]);
  for(const field of await page.locator('textarea[data-answer]').all())await field.fill('A brief test observation based on the graph.');for(const group of await page.locator('fieldset.question').all())await group.getByRole('radio').first().check();
 }
 await page.locator('#editor-custom').fill('stop("Deliberate test error")');await page.locator('#run-custom').click();await expect(page.locator('#run-custom')).toBeEnabled();await expect(page.locator('#output-custom')).toContainText('Deliberate test error');expect(await page.locator('#graph-custom img').getAttribute('src')).toBe(finals[2]);expect(await page.locator('#graph-basic img').getAttribute('src')).toBe(originals[2]);
 await page.reload();await expect(page.locator('#run-custom')).toBeEnabled({timeout:150000});await page.locator('#editor-custom').fill(customized[2]);await run(page,'custom');
 for(let i=0;i<3;i++){await page.getByRole('button',{name:['Ratings','Trends','Storylines'][i],exact:true}).click();expect(await page.locator('#graph-basic img').getAttribute('src')).toBe(originals[i]);await expect(page.locator('#editor-basic')).toHaveValue(basic[i]);await expect(page.locator('#editor-custom')).toHaveValue(customized[i]);await expect(page.locator('textarea[data-answer]').first()).not.toBeEmpty();}
 await page.getByRole('button',{name:'Finish',exact:true}).click();await page.locator('#export').click();await expect(page.locator('#export-message')).toContainText('your name');await page.getByRole('textbox',{name:'Your name',exact:true}).fill('Revision Test Student');
 for(let n=0;n<2;n++){const event=page.waitForEvent('download');await page.locator('#export').click();const d=await event;const zip=unzipSync(fs.readFileSync(await d.path()));expect(Object.keys(zip).sort()).toEqual(['01_episode_ratings.png','02_ratings_over_time.png','03_summary_words.png','R_You_Watching_Homework.pdf']);['01_episode_ratings.png','02_ratings_over_time.png','03_summary_words.png'].forEach((name,i)=>expect(Buffer.from(zip[name]).toString('base64')).toBe(finals[i].split(',')[1]));}
});
test('Chernobyl warning and keyboard navigation',async({page})=>{await page.goto('/');await page.getByRole('button',{name:'Choose Your Show →'}).focus();await page.keyboard.press('Enter');await page.getByRole('searchbox').fill('Chernobyl');await page.getByRole('button',{name:'Search shows'}).click();await page.getByRole('article').filter({has:page.getByRole('heading',{name:'Chernobyl',exact:true})}).getByRole('button').click();await expect(page.locator('.warning')).toHaveText('This show has fewer than 10 usable ratings or summaries. We recommend choosing another show for clearer patterns.');await expect(page.getByRole('button',{name:'Start Investigating →'})).toBeEnabled();await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);});
