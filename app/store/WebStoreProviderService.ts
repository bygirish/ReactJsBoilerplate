import { Store } from 'redux';
import { storeData } from './index';
import { Logger } from '@utils/Logger';

let webStore: Store;
let webPersistor;
class WebStoreProviderService {
    public init() {
        Logger.info('[WebStoreProviderService - init()] Preparing store and persister')
        const {store, persistor} = storeData();
        webStore = store;
        webPersistor = persistor;
    }

    public getStore(): Store<any> {
        Logger.info('[WebStoreProviderService - getStore()]')
        if(!webStore || webStore === null){
            this.init();
        }
        return webStore;
    }

    public getPersistor(){
        Logger.info('[WebStoreProviderService - getPersistor()]')
        if(!webPersistor || webPersistor === null){
            this.init();
        }
        return webPersistor;
    }
}

const storeProviderService = new WebStoreProviderService();
export { storeProviderService as WebStoreProviderService };
