'use strict';



chrome.runtime.onInstalled.addListener(async () => {
    chrome.storage.local.get(['roulette_custom', 'instant_custom', 'baccarat_custom', 'exPaySysCashOut', 'exPaySysDep'], function(result) {
        const roulette_custom = result.roulette_custom;
        const instant_custom = result.instant_custom;
        const baccarat_custom = result.baccarat_custom;
        console.log(roulette_custom)
        if(!roulette_custom && !instant_custom && !baccarat_custom){
            const rouletteCustom = 'immersive roulette, lightning roulette, xxxtreme lightning roulette, auto-roulette, Bar Roulette 2000x, Spanish Roulette, Auto-Roulette 1, Roulette Russia, Live Roulette, European Roulette VIP, European Roulette Christmas Edition, European Roulette, Virtual Roulette, Roulette 10 - Ruby, Roulette Live, Ruletka Live, Speed Roulette 2'.toLowerCase()
            const instantCustom =  'aviator, jetx, pilot cup'
            const baccaratCustom = 'live no commission baccarat, baccarat a, speed baccarat d'
            chrome.storage.local.set({
                roulette_custom: rouletteCustom,
                instant_custom: instantCustom,
                baccarat_custom: baccaratCustom
            }, function() {
                console.log('Values saved');
            });
        }
        if(!result.exPaySysCashOut){
            chrome.storage.local.set({
                exPaySysCashOut: "Black Rabbit, Platcore, Expay, Cypix, Accentpay, Sgate, TranZex, Gogetaway, TranzexPay, Paygames, Paycos"
            }, function() {
                console.log('Values saved');
            });
        }
        if(!result.exPaySysDep){
            chrome.storage.local.set({
                exPaySysDep: "Cypix payout EUR Mastercard/Visa - Bank Card, Betatransfer SBP Out - Sbp, Expay Out RUB - Bank Card, Forta out cash - Bank Card, Accent new out - Bank Card, Black Rabbit"
            }, function() {
                console.log('Values saved');
            });
        }
    })
});

