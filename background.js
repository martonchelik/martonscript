'use strict';



chrome.runtime.onInstalled.addListener(async () => {
    chrome.storage.local.get(['roulette_custom', 'instant_custom', 'baccarat_custom'], function(result) {
        const roulette_custom = result.roulette_custom;
        const instant_custom = result.instant_custom;
        const baccarat_custom = result.baccarat_custom;
        console.log(roulette_custom)
        if(!roulette_custom && !instant_custom && !baccarat_custom){
            const rouletteCustom = 'immersive roulette, lightning roulette, xxxtreme lightning roulette, auto-roulette, Bar Roulette 2000x, Spanish Roulette, Auto-Roulette 1, Roulette Russia, Live Roulette'.toLowerCase()
            const instantCustom =  'aviator, jetx'
            const baccaratCustom = 'live no commission baccarat, baccarat a, speed baccarat d'
            chrome.storage.local.set({
                roulette_custom: rouletteCustom,
                instant_custom: instantCustom,
                baccarat_custom: baccaratCustom
            }, function() {
                console.log('Values saved');
            });
        }
    })
});

