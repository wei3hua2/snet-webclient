import {Account, AccountInitOptions} from './account';
import {Organization} from './organization';
import {Service, ServiceMetadata, ServiceInfo, ServiceFieldInfo, ServiceHeartbeat, SvcInitOptions} from './service';
import {Channel, ChannelState} from './channel';
import {InitOptions, RUN_JOB_STATE, RunJobOptions} from './options';

interface Data {
    isInit: boolean;
    data: Object;
    init(): Promise<any>;
}

export {Organization, Account, Service, Channel, ChannelState, InitOptions, AccountInitOptions, SvcInitOptions,
    ServiceHeartbeat, ServiceMetadata, ServiceInfo, ServiceFieldInfo, Data, RUN_JOB_STATE, RunJobOptions};