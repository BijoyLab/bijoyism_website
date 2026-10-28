import test from 'node:test';
import assert from 'node:assert/strict';
import {httpsRedirectUrl} from '../src/site/transport.js';
const target=(path,host,proto)=>httpsRedirectUrl(new URL(path,'http://localhost:3100'),new Headers({host,...(proto?{'x-forwarded-proto':proto}:{})}))?.href||null;

test('HTTP public pages, crawler files, assets and APIs preserve path and query on HTTPS',()=>{
 for(const path of ['/en/products/?utm_source=google','/zh/play-ideas/?setting=classroom&collection=td02','/sitemap.xml','/robots.txt','/assets/logo-red-v01.svg','/api/purchase-events/','/_next/static/example.js']){
  assert.equal(target(path,'bijoyism.cc','http'),'https://bijoyism.cc'+path);
 }
 assert.equal(target('/en/?x=1','www.bijoyism.cc','http'),'https://bijoyism.cc/en/?x=1');
 assert.equal(target('/?x=1','bijoyism.cn','http'),'https://bijoyism.cc/zh/?x=1');
 assert.equal(target('/?x=1','bijoyism.cc','http'),'https://bijoyism.cc/?x=1');
});

test('HTTPS visitor protocol prevents reverse-proxy loops; local preview stays HTTP',()=>{
 assert.equal(target('/en/','bijoyism.cc','https'),null);
 assert.equal(target('/en/','bijoyism.cc','https, http'),null);
 assert.equal(target('/en/','bijoyism.cc','http, https'),'https://bijoyism.cc/en/');
 for(const host of ['localhost:3000','127.0.0.1:3100','example.com','bijoyism.cc.example.com'])assert.equal(target('/en/',host,'http'),null);
 const headers=new Headers({host:'bijoyism.cc'});
 assert.equal(httpsRedirectUrl(new URL('https://bijoyism.cc/en/'),headers),null);
 assert.equal(httpsRedirectUrl(new URL('http://bijoyism.cc/en/'),headers)?.href,'https://bijoyism.cc/en/');
});
