
import React from 'react';
import { Scenario, CatProfile } from './types';

export const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQgM32Z8vofJ3TD8T8UYu21Rxej4r7SAPVaJq0SrV-sfOQ-CjJS7_7XOZ8yxahiLX40KqLENyVW-pq0/pub?output=csv";

export const UI_TEXT = {
  "zh-TW": {
    appTitle: "喵～時刻",
    appSubtitle: "給忙碌心靈的 3 分鐘貓語錄",
    stateTitle: "現在的狀態…",
    stateSubtitle: "先選擇你現在的狀態，貓會陪你走下一步。",
    dataSource: "資料來源：",
    dsSheet: "Google Sheet",
    dsFallback: "內建備援",
    todayQuote: "今日貓語",
    pickCat: "選一隻貓，領取處方。",
    masterRx: "貓大師生活秘方",
    rxMissing: "（此則處方尚未設定行動建議）",
    again: "再來一帖",
    changeState: "換個狀態",
    favorites: "收藏",
    favEmpty: "尚未收藏任何靈感",
    copied: "已複製 (含連結)",
    copyFail: "複製失敗",
    removed: "已移除收藏",
    saved: "已收藏",
    close: "關閉",
    remove: "移除",
    copy: "複製",
    lang: "語言",
    ttsButton: "讓貓大師唸給你聽",
    ttsTip: "點一下，貓會用聲音把處方唸出來",
    ttsLoading: "貓大師正在準備聲音..."
  },
  "zh-CN": {
    appTitle: "喵～时刻",
    appSubtitle: "给忙碌心灵的 3 分钟猫语录",
    stateTitle: "现在的状态…",
    stateSubtitle: "先选择你现在的状态，猫会陪你走下一步。",
    dataSource: "数据来源：",
    dsSheet: "Google Sheet",
    dsFallback: "内建备援",
    todayQuote: "今日猫语",
    pickCat: "选一只猫，领取处方。",
    masterRx: "猫大师生活秘方",
    rxMissing: "（此则处方尚未设定行动建议）",
    again: "再来一帖",
    changeState: "换个状态",
    favorites: "收藏",
    favEmpty: "尚未收藏任何灵感",
    copied: "已复制（含链接）",
    copyFail: "复制失败",
    removed: "已移除收藏",
    saved: "已收藏",
    close: "关闭",
    remove: "移除",
    copy: "复制",
    lang: "语言",
    ttsButton: "让猫大师念给你听",
    ttsTip: "点一下，猫会用声音把处方念出来",
    ttsLoading: "猫大师正在准备声音..."
  },
  "en": {
    appTitle: "Meow~ Moment",
    appSubtitle: "3-minute cat quotes for busy minds",
    stateTitle: "Current mood…",
    stateSubtitle: "Pick your mood. The cat will guide your next step.",
    dataSource: "Source:",
    dsSheet: "Google Sheet",
    dsFallback: "Built-in fallback",
    todayQuote: "Today’s Meow",
    pickCat: "Pick a cat to receive your prescription.",
    masterRx: "Cat Master Recipe",
    rxMissing: "(No prescription action set yet)",
    again: "One more",
    changeState: "Change mood",
    favorites: "Saved",
    favEmpty: "No saved wisdom yet",
    copied: "Copied (with footer)",
    copyFail: "Copy failed",
    removed: "Removed",
    saved: "Saved",
    close: "Close",
    remove: "Remove",
    copy: "Copy",
    lang: "Language",
    ttsButton: "Let Cat Master Read",
    ttsTip: "Tap to hear the prescription in the Cat Master's voice",
    ttsLoading: "Cat Master is preparing voice..."
  }
};

export const STATES: Scenario[] = [
  { id:"start",    label:{'zh-TW':"晨間準備",'zh-CN':"晨间准备",'en':"Morning"}, icon:"☕" },
  { id:"conflict", label:{'zh-TW':"防禦奧客",'zh-CN':"防御客户",'en':"Defend"}, icon:"🛡️" },
  { id:"win",      label:{'zh-TW':"達成成就",'zh-CN':"达成成就",'en':"Achieve"}, icon:"🏔️" },
  { id:"tired",    label:{'zh-TW':"職業倦怠",'zh-CN':"职业倦怠",'en':"Burnout"}, icon:"☁️" },
  { id:"push",     label:{'zh-TW':"專注衝刺",'zh-CN':"专注冲刺",'en':"Focus"}, icon:"⚡" }
];

export const CATS: CatProfile[] = [
  { id:"gentle", name:{'zh-TW':"溫柔貓",'zh-CN':"温柔猫",'en':"Gentle"}, color:"#EADBC8" },
  { id:"focus",  name:{'zh-TW':"專注貓",'zh-CN':"专注猫",'en':"Focus"},  color:"#D7CCC8" },
  { id:"wise",   name:{'zh-TW':"智慧貓",'zh-CN':"智慧猫",'en':"Wise"},   color:"#CFD8DC" },
  { id:"rest",   name:{'zh-TW':"休息貓",'zh-CN':"休息猫",'en':"Rest"},   color:"#FFE0B2" }
];
