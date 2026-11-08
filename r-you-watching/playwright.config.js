import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',testMatch:'**/*.spec.js',timeout:180000,expect:{timeout:15000},workers:1,use:{baseURL:process.env.TEST_URL||'http://localhost:4173',viewport:{width:1440,height:1100}},reporter:'list'});
