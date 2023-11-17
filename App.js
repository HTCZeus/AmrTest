/* eslint-disable prettier/prettier */
import React, { useEffect,useState } from 'react';
import {
  View,
  Button,
  StyleSheet,
  SafeAreaView,
  Platform
} from 'react-native';
import AdmostModule, { AdMostAdView, AIEvents,ABEvents,AREvents, AdmostEventEmitter,AdmostInterstitial,AdmostRewarded } from "react-native-admost-main";

const AppID = Platform.select({
  ios:'15066ddc-9c18-492c-8185-bea7e4c7f88c',
  android:'6cc8e89a-b52a-4e9a-bb8c-579f7ec538fe'
})

const intersititialZoneID = Platform.select({
  ios:'39f74377-5682-436a-9338-9d1c4df410bd',
  android:'f99e409b-f9ab-4a2e-aa9a-4d143e6809ae'
})

const rewardedZoneID = Platform.select({
  ios: '2bdefd44-5269-4cbc-b93a-373b74a2f067',
  android: 'e5efb075-59ff-401b-892e-8500ee6f841f' // Test zone ID değil uğura sor 
})

const bannerZoneID = Platform.select({
  ios: 'b4009772-de04-42c4-bbaa-c18da9e4a1ab',
  android:'9fb970db-7d96-4ef2-ac8c-d88ec22270ff'
})

const layoutName = Platform.select({
  ios:'CustomNative300x120',
  android:'custom_layout_native_250'
});

const App = () => {
   useEffect(() => {
  const admostInit = async () => {
    AdmostModule.setAppID(AppID);
    AdmostModule.setUserConsents(true); 
    AdmostModule.setSubjectToGDPR(false);
    AdmostModule.setSubjectToCCPA(false);
    AdmostModule.setUserChild(false);
    await AdmostModule.start()
    .then((result)=>{
      console.log(result)
    })
    .catch((error)=>{
      console.log(error)
    })
    await AdmostInterstitial.initWithZoneID(intersititialZoneID);
    AdmostInterstitial.loadAd();
    await AdmostRewarded.initWithZoneID(rewardedZoneID);
    AdmostRewarded.loadAd();    
  };
    AIEventListeners();
    AREventlisteners();
    ABEventlisteners();
     admostInit();
     return () => { 
      ABEventlistenersCleanUp();
      AREventlistenersCleanUp();
      AIEventListenersCleanUp();
     };
   }, []);
     const AIEventListeners = () => {
       iFail = AdmostEventEmitter.addListener(AIEvents.DID_FAIL_TO_RECEIVE, (errorCode) => {
         console.log('Interstitial ad did fail to receive. Error Code:', errorCode);
         
       });
       iReceive = AdmostEventEmitter.addListener(AIEvents.DID_RECEIVE, (network) => {
         console.log('Interstitial ad did receive. Network:', network);
       });
       iShow = AdmostEventEmitter.addListener(AIEvents.DID_SHOW, (network) => {
         console.log('Interstitial ad did show. Network:', network);
       });
       iClick = AdmostEventEmitter.addListener(AIEvents.DID_CLICK, (s) => {
         console.log('Interstitial ad did click. Value:', s);
       });
       iDismiss = AdmostEventEmitter.addListener(AIEvents.DID_DISMISS, (message) => {
         console.log('Interstitial ad dismissed. Message:', message);
         AdmostInterstitial.loadAd();
       });
   };
    const AIEventListenersCleanUp = () => {
      iFail.remove();
      iReceive.remove();
      iShow.remove();
      iClick.remove();
      iDismiss.remove();
    };

   const AREventlisteners = () => {
     rFail = AdmostEventEmitter.addListener(AREvents.DID_FAIL_TO_RECEIVE, (errorCode) => {
       console.log('Rewarded ad did fail to receive', errorCode);
     });
     rReceive = AdmostEventEmitter.addListener(AREvents.DID_RECEIVE, (network) => {
       console.log('Rewarded ad did receive', network);
     });
     rShow = AdmostEventEmitter.addListener(AREvents.DID_SHOW, (network) => {
       console.log('Rewarded ad did show', network);
     });
     rComplete = AdmostEventEmitter.addListener(AREvents.DID_COMPLETE,  (network) => {
       console.log('Rewarded ad did complete you can reward the user', network);
     });
     rClick = AdmostEventEmitter.addListener(AREvents.DID_CLICK, (s) => {
       console.log('Rewarded ad did clicked', s);
     });
     rDismiss = AdmostEventEmitter.addListener(AREvents.DID_DISMISS, (message) => {
       console.log('Rewarded ad did dissmissed', message);
       AdmostRewarded.loadAd();
     });
   };
   const AREventlistenersCleanUp = () =>{
    rFail.remove();
    rReceive.remove();
    rShow.remove();
    rComplete.remove();
    rClick.remove();
    rDismiss.remove();
   };
     const ABEventlisteners = () => {
      bClick = AdmostEventEmitter.addListener(ABEvents.DID_CLICK,  (network) => {
          console.log('Banner ad did clicked',network);
        });
      bFail = AdmostEventEmitter.addListener(ABEvents.DID_FAIL_TO_RECEIVE,  (errorCode) => {
          console.log('Banner ad did fail to receive',errorCode);
        });
      bReceive = AdmostEventEmitter.addListener(ABEvents.DID_RECEIVE,  (network) => {
          console.log('Banner ad did receive',network);
        });
      };
    const ABEventlistenersCleanUp = () => {
      bReceive.remove();
      bFail.remove();
      bClick.remove();
    };

  return (
    <SafeAreaView style={styles.container}>
      <View>
       <AdMostAdView
        ref={(ref) => (this.admostAdViewRef = ref)}
        style={styles.banner}
        zoneId={bannerZoneID}      
        //layoutName={layoutName}
        />
        <Button style={styles.button} title="SHOW ADMOST INTERSITITIAL" onPress={()=>{AdmostInterstitial.showAd()}} />
        <Button style={styles.button}title="SHOW ADMOST REWARDED" color={'red'} onPress={()=>{AdmostRewarded.showAd()}} />
        <Button style={styles.button}title="LOAD ADMOST INTERSITITIAL" color={'green'} onPress={()=>AdmostInterstitial.loadAd()} />
        <Button style={styles.button}title="LOAD ADMOST REWARDED" color={'black'} onPress={()=>{AdmostRewarded.loadAd()}} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  banner: {
    width:'100%',
    height: 300,
  },
  button: {
  },
});

export default App;

