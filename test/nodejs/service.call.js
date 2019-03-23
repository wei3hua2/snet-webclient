const c = require('chai');
const m = require('mocha');
const {Config} = require('../config/config');
const {ServiceSvc, ChannelSvc, AccountSvc} = require('../../dist/impls');
const {RUN_JOB_STATE} = require('../../dist/models/options');
const {ERROR_CODES} = require('../../dist/errors');

let config;
m.before(async() => {
    config = await Config.init();
});
m.after( async () => {
  config.teardown();
});

m.describe('service-call', () => {

  m.it('should throw error for when not init', async function (){
    const svc = await ServiceSvc.init(config.acct1, 'snet', 'example-service', {init: false});
    
    c.expect(svc.data).to.be.deep.equal({id:'example-service',organizationId:'snet'});

    try{ const gId = svc.groupId;}catch(err){
      c.expect(err.name).to.be.equal('SnetError');
      c.expect(err.code).to.be.equal(ERROR_CODES.svc_metadata_not_init);
    }
    try{ const gId = svc.paymentAddress;}catch(err){
      c.expect(err.name).to.be.equal('SnetError');
      c.expect(err.code).to.be.equal(ERROR_CODES.svc_metadata_not_init);
    }
    try{ const gId = svc.paymentExpirationThreshold;}catch(err){
      c.expect(err.name).to.be.equal('SnetError');
      c.expect(err.code).to.be.equal(ERROR_CODES.svc_metadata_not_init);
    }
    try{ const gId = svc.endpoint;}catch(err){
      c.expect(err.name).to.be.equal('SnetError');
      c.expect(err.code).to.be.equal(ERROR_CODES.svc_metadata_not_init);
    }
    try{ const gId = svc.price;}catch(err){
      c.expect(err.name).to.be.equal('SnetError');
      c.expect(err.code).to.be.equal(ERROR_CODES.svc_metadata_not_init);
    }
    try{ await svc.pingDaemonHeartbeat();}catch(err){
      c.expect(err.name).to.be.equal('SnetError');
      c.expect(err.code).to.be.equal(ERROR_CODES.svc_metadata_not_init);
    }
    try{ await svc.getDaemonEncoding();}catch(err){
      c.expect(err.name).to.be.equal('SnetError');
      c.expect(err.code).to.be.equal(ERROR_CODES.svc_metadata_not_init);
    }
    try{ await svc.getChannels();}catch(err){
      c.expect(err.name).to.be.equal('SnetError');
      c.expect(err.code).to.be.equal(ERROR_CODES.svc_metadata_not_init);
    }

    try{ svc.defaultRequest('add');}catch(err){
      c.expect(err.name).to.be.equal('SnetError');
      c.expect(err.code).to.be.equal(ERROR_CODES.svc_protobuf_not_init);
    }
    try{ svc.info();}catch(err){
      c.expect(err.name).to.be.equal('SnetError');
      c.expect(err.code).to.be.equal(ERROR_CODES.svc_protobuf_not_init);
    }

    try{ await svc.runJob('add',{a:1,b:4});}catch(err){
      c.expect(err.name).to.be.equal('SnetError');
      c.expect(err.code).to.be.equal(ERROR_CODES.svc_not_init);
    }

  });

  m.it('should init services by type', async function () {
    const svcNotInit = await ServiceSvc.init(config.acct1, 'snet', 'example-service', {init: false});

    c.expect(svcNotInit.data).to.be.deep.equal({ id: 'example-service', organizationId: 'snet' });
    

    await svcNotInit.initRegistry();

    try{ const gId = svcNotInit.groupId;}catch(err) {
      c.expect(err.name).to.be.equal('SnetError');
      c.expect(err.code).to.be.equal(ERROR_CODES.svc_metadata_not_init);
    }

    c.expect(svcNotInit.data).to.be.deep.equal({id:'example-service',organizationId:'snet', tags: [ 'Service', 'Example', 'Arithmetic' ]});

    const svcInitReg = await ServiceSvc.init(config.acct1, 'snet', 'example-service', {init: 'registry'});
    c.expect(svcNotInit.data).to.be.deep.equal(svcInitReg.data);

    await svcNotInit.initMetadata();

    const svcInitMeta = await ServiceSvc.init(config.acct1, 'snet', 'example-service', {init: 'metadata'});
    c.expect(svcNotInit.data).to.be.deep.equal(svcInitMeta.data);

    c.expect(svcNotInit.data).to.be.have.all.keys(['id','organizationId','tags', 'metadataURI','metadata']);

  });

  m.it('should get service channels for services', async () => {
    let svc = await ServiceSvc.init(config.acct1, 'snet', 'example-service');
    let channels = await svc.getChannels({init: true});

    c.expect(channels.length).to.be.greaterThan(0);

    svc = await ServiceSvc.init(config.acct1, 'snet', 'style-transfer');
    channels = await svc.getChannels();
    c.expect(channels.length).to.be.greaterThan(-1);

    try{
      const svc = await ServiceSvc.init(config.acct1, 'snet', 'not-found-service');
    }catch(err){
      c.expect(err.code).to.be.equal('sv_registry_id_not_found');
      c.expect(err.params).to.be.deep.equal(['snet','not-found-service']);
    }
  });

  m.it('should retrieve snet example-service detailed info', async function() {
    const svc = await ServiceSvc.init(config.acct1, 'snet', 'example-service');

    const info = svc.info();
    const name = info.name;
    const methods = info.methods;

    c.expect(name).to.be.equal('Calculator');
    c.expect(methods).to.have.all.keys(['add','sub','mul','div']);

    const addRequest = methods.add.request;
    const addResponse = methods.add.response;

    c.expect(addRequest.name).to.be.equal('Numbers');

    c.expect(addRequest.fields.a).to.be.deep.equal({ type: 'float', required: false, optional: true, value: 0 });
    c.expect(addRequest.fields.b).to.be.deep.equal({ type: 'float', required: false, optional: true, value: 0 });

    c.expect(addResponse.name).to.be.equal('Result');

    c.expect(addResponse.fields.value).to.be.deep.equal({ type: 'float', required: false, optional: true, value: 0 });

    const request = svc.defaultRequest('add');
    c.expect(request).to.be.deep.equal({a:0, b:0});

    const svcData = svc.data;
    
    c.expect(svcData['id']).to.be.equal('example-service');
    c.expect(svcData['organizationId']).to.be.equal('snet');
    c.expect(svcData['tags']).to.be.deep.equal(['Service','Example','Arithmetic']);

    c.expect(svcData['metadata']).to.be.contain.keys(['version', 'display_name', 'encoding','service_type',
        'payment_expiration_threshold', 'model_ipfs_hash', 'mpe_address', 'pricing', 'groups',
        'endpoints', 'service_description']);
  });

  m.it('should ping example service daemon for heartbeat', async function () {
    const exampleSvc = await ServiceSvc.init(config.acct1, 'snet', 'example-service');
    const heartbeat = await exampleSvc.pingDaemonHeartbeat();

    c.expect(heartbeat).have.all.keys(['daemonID','timestamp','status','serviceheartbeat']);
    c.expect(heartbeat.status).to.be.equal('Online');
    c.expect(heartbeat.timestamp).to.be.greaterThan(0);
    c.expect(heartbeat.timestamp).to.be.lessThan(new Date().getTime());

  });

  m.it('should get the encoding from example service daemon', async function () {
    const exampleSvc = await ServiceSvc.init(config.acct1, 'snet', 'example-service');
    const encoding = await exampleSvc.getDaemonEncoding();

    c.expect(encoding).that.be.equal('proto\n');
  });

})
