/**
 * @module snet
 */

import {Contract} from './contract';
import {Account} from '../models/account';

//@ts-ignore
import RegistryNetworks from 'singularitynet-platform-contracts/networks/Registry.json';
//@ts-ignore
import RegistryAbi from 'singularitynet-platform-contracts/abi/Registry.json';

import {TransactOptions, EventOptions} from '../utils/eth';

class Registry extends Contract {
    constructor(account: Account){ super(account); }

    getAbi(){ return RegistryAbi; }
    getNetworkObj(){ return RegistryNetworks; }

    OrganizationCreated = (opt:EventOptions={}) => this.eventContract('OrganizationCreated', opt);
    OrganizationModified = (opt:EventOptions={}) => this.eventContract('OrganizationModified', opt);
    OrganizationDeleted = (opt:EventOptions={}) => this.eventContract('OrganizationDeleted', opt);
    ServiceCreated = (opt:EventOptions={}) => this.eventContract('ServiceCreated', opt);
    ServiceMetadataModified = (opt:EventOptions={}) => this.eventContract('ServiceMetadataModified', opt);
    ServiceTagsModified = (opt:EventOptions={}) => this.eventContract('ServiceTagsModified', opt);
    ServiceDeleted = (opt:EventOptions={}) => this.eventContract('ServiceDeleted', opt);
    TypeRepositoryCreated = (opt:EventOptions={}) => this.eventContract('TypeRepositoryCreated', opt);
    TypeRepositoryModified = (opt:EventOptions={}) => this.eventContract('TypeRepositoryModified', opt);
    TypeRepositoryDeleted = (opt:EventOptions={}) => this.eventContract('TypeRepositoryDeleted', opt);

    /******* Call *******/

    listOrganizations = () => {
        return this.callContract('listOrganizations').then(
            (orgAddresses) => {
                const orgs = Array.from(orgAddresses.orgIds);
                return orgs.map((org:string) => this.eth.hexToUtf8(org));
            });
    }
    getOrganizationById = (orgId: string) => {
        return this.callContract('getOrganizationById', this.eth.asciiToBytes(orgId)).then(
            (org) => {
                const svcIds = Array.from(org.serviceIds), repoIds = Array.from(org.repositoryIds);
                
                org.id = this.eth.hexToUtf8(org.id),
                org.serviceIds = svcIds.map((svcId:string) => this.eth.hexToUtf8(svcId)),
                org.repositoryIds = repoIds.map((repoId:string) => this.eth.hexToUtf8(repoId))
                
                return org;
            }
        );
    }
    listServicesForOrganization = (orgId: string) => {
        return this.callContract('listServicesForOrganization', this.eth.asciiToBytes(orgId)).then(
            (svcs) => {
                const svcIds = Array.from(svcs.serviceIds);
                svcs.serviceIds = svcIds.map((s:string) => this.eth.hexToUtf8(s));

                return svcs;
            }
        );
    }
    getServiceRegistrationById = (orgId: string, serviceId: string) => {
        return this.callContract('getServiceRegistrationById', this.eth.asciiToBytes(orgId), this.eth.asciiToBytes(serviceId)).then(
            (svcReg) => {
                const tags = Array.from(svcReg.tags);
                svcReg.id = this.eth.hexToUtf8(svcReg.id);
                svcReg.metadataURI = svcReg.metadataURI ?  this.eth.hexToUtf8(svcReg.metadataURI) : svcReg.metadataURI;
                svcReg.tags = tags.map((t:string) => this.eth.hexToUtf8(t));

                return svcReg;
            }
        );
    }
    listTypeRepositoriesForOrganization = (orgId: string) => {
        return this.callContract('listTypeRepositoriesForOrganization', this.eth.asciiToBytes(orgId)).then(
            (typeRepos) => {
                const repoIds = Array.from(typeRepos.repositoryIds)
                typeRepos.repositoryIds = repoIds.map((r:string) => this.eth.hexToUtf8(r));

                return typeRepos;
            }
        )
    }

    
    listServiceTags = () => this.callContract('listServiceTags').then((svcTags) => {
        return {tags: Array.from(svcTags.tags).map((t:string) => this.eth.hexToUtf8(t))};
    });
    listServicesForTag = (tag: string) => {
        return this.callContract('listServicesForTag', this.eth.asciiToBytes(tag)).then(
            (svcs) => {
                const orgIds = Array.from(svcs.orgIds);
                const serviceIds = Array.from(svcs.serviceIds);
                svcs.orgIds = orgIds.map((o:string) => this.eth.bytesToAscii(o));
                svcs.serviceIds = serviceIds.map((s:string) => this.eth.bytesToAscii(s));

                return svcs;
            });
    }

    listTypeRepositoryTags = () => this.callContract('listTypeRepositoryTags'); //TODO
    listTypeRepositoriesForTag = (tag: string) => this.callContract('listTypeRepositoriesForTag', this.fromAscii(tag)); //TODO
    supportsInterface = (interfaceId: string) => this.callContract('supportsInterface', interfaceId); //TODO
    getTypeRepositoryById = (orgId: string, repositoryId: string) => this.callContract('getTypeRepositoryById', this.fromAscii(orgId), this.fromAscii(repositoryId)); //TODO


    // transact

    createOrganization = (orgId:string, orgName:string='', members:string[]=[], txOpt:TransactOptions={}) => {
        const oId = this.eth.asciiToBytes(orgId);
        return this.transactContract('createOrganization',txOpt,oId, orgName, members);
    }

    changeOrganizationOwner = (orgId:string, newOwner:string, txOpt:TransactOptions={}) => {
        const oId = this.eth.asciiToBytes(orgId);
        return this.transactContract('changeOrganizationOwner',txOpt,oId,newOwner);
    }
    changeOrganizationName = (orgId:string, orgName:string, txOpt:TransactOptions={}) => {
        const oId = this.eth.asciiToBytes(orgId);
        return this.transactContract('changeOrganizationName',txOpt,oId,orgName);
    }
    addOrganizationMembers = (orgId:string, newMembers:string[], txOpt:TransactOptions={}) => {
        const oId = this.eth.asciiToBytes(orgId);
        return this.transactContract('addOrganizationMembers',txOpt,oId,newMembers);
    }
    removeOrganizationMembers = (orgId:string, existingMembers:string[], txOpt:TransactOptions={}) => {
        const oId = this.eth.asciiToBytes(orgId);
        return this.transactContract('removeOrganizationMembers',txOpt,oId,existingMembers);
    }
    deleteOrganization = (orgId:string, txOpt:TransactOptions={}) => {
        const oId = this.eth.asciiToBytes(orgId);
        return this.transactContract('deleteOrganization',txOpt,oId);
    }

    createServiceRegistration = (orgId:string, serviceId:string, metadataURI:string='', tags:string[]=[], txOpt:TransactOptions={}) => {
        const that = this;
        const oId = this.eth.asciiToBytes(orgId), sId = this.eth.asciiToBytes(serviceId);
        const mdURI = this.eth.asciiToBytes(metadataURI);
        const ts = tags.map(function(t){return that.eth.asciiToBytes(t);});

        return this.transactContract('createServiceRegistration',txOpt, oId, sId, mdURI, ts);
    }
    updateServiceRegistration = (orgId:string, serviceId:string, metadataURI:string='', txOpt:TransactOptions={}) => {
        const oId = this.eth.asciiToBytes(orgId), sId = this.eth.asciiToBytes(serviceId);
        const mdURI = this.eth.asciiToBytes(metadataURI);

        return this.transactContract('updateServiceRegistration',txOpt, oId, sId, mdURI);
    }
    addTagsToServiceRegistration = (orgId:string, serviceId:string, tags:string[]=[], txOpt:TransactOptions={}) => {
        const that = this;
        const oId = this.eth.asciiToBytes(orgId), sId = this.eth.asciiToBytes(serviceId);
        const ts = tags.map(function(t){return that.eth.asciiToBytes(t);});

        return this.transactContract('addTagsToServiceRegistration',txOpt, oId, sId, ts);
    }
    removeTagsFromServiceRegistration = (orgId:string, serviceId:string, tags:string[]=[], txOpt:TransactOptions={}) => {
        const that = this;
        const oId = this.eth.asciiToBytes(orgId), sId = this.eth.asciiToBytes(serviceId);
        const ts = tags.map(function(t){return that.eth.asciiToBytes(t);});

        return this.transactContract('removeTagsFromServiceRegistration',txOpt, oId, sId, ts);
    }
    deleteServiceRegistration = (orgId:string, serviceId:string, txOpt:TransactOptions={}) => {
        const oId = this.eth.asciiToBytes(orgId), sId = this.eth.asciiToBytes(serviceId);

        return this.transactContract('deleteServiceRegistration',txOpt, oId, sId);
    }

    createTypeRepositoryRegistration = (orgId:string, repositoryId:string, repositoryURI:string, tags:string[], txOpt:TransactOptions={}) => this.transactContract('createTypeRepositoryRegistration',txOpt,orgId,repositoryId,repositoryURI,tags);
    updateTypeRepositoryRegistration = (orgId:string, repositoryId:string, repositoryURI:string, txOpt:TransactOptions={}) => this.transactContract('updateTypeRepositoryRegistration',txOpt,orgId, repositoryId, repositoryURI);
    addTagsToTypeRepositoryRegistration = (orgId:string, repositoryId:string, tags:string[], txOpt:TransactOptions={}) => this.transactContract('addTagsToTypeRepositoryRegistration',txOpt,orgId, repositoryId, tags);
    removeTagsFromTypeRepositoryRegistration = (orgId:string, repositoryId:string, tags:string[], txOpt:TransactOptions={}) => this.transactContract('removeTagsFromTypeRepositoryRegistration',txOpt,orgId, repositoryId, tags);
    deleteTypeRepositoryRegistration = (orgId:string, repositoryId:string, txOpt:TransactOptions={}) => this.transactContract('deleteTypeRepositoryRegistration',txOpt,orgId,repositoryId);
}

export {Registry}