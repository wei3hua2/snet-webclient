import * as c from 'chai';
import * as m from 'mocha';
import {initWeb3, getConfigInfo} from './utils';
// import {Snet} from '../../src/snet';
// import {ServiceSvc, OrganizationSvc, AccountSvc} from '../../src/impls';
// import {Service, Organization, Account} from '../../src/models';
// import {Utils} from '../../src/utils';
import {Snet} from '../../dist/snet';
import {ServiceSvc, OrganizationSvc, AccountSvc} from '../../dist/impls';
import {Service, Organization, Account} from '../../dist/models';
import {Utils} from '../../dist/utils';


let web3, PERSONAL_ACCOUNT, PERSONAL_PRIVATE_KEY;

m.before(() => {
    web3 = initWeb3();
    PERSONAL_ACCOUNT = getConfigInfo()['PERSONAL_ACCOUNT'];
    PERSONAL_PRIVATE_KEY = getConfigInfo()['PERSONAL_PRIVATE_KEY'];
});
m.after(() => {
    web3.currentProvider.connection.close();
})

const EXAMPLESVC_SERVICE_INFO = {
  "name": "Calculator",
  "methods": {
    "add": {
      "request": {
        "name": "Numbers",
        "fields": {
          "a": {
            "type": "float",
            "required": false,
            "optional": true,
            "value": 0
          },
          "b": {
            "type": "float",
            "required": false,
            "optional": true,
            "value": 0
          }
        }
      },
      "response": {
        "name": "Result",
        "fields": {
          "value": {
            "type": "float",
            "required": false,
            "optional": true,
            "value": 0
          }
        }
      }
    },
    "sub": {
      "request": {
        "name": "Numbers",
        "fields": {
          "a": {
            "type": "float",
            "required": false,
            "optional": true,
            "value": 0
          },
          "b": {
            "type": "float",
            "required": false,
            "optional": true,
            "value": 0
          }
        }
      },
      "response": {
        "name": "Result",
        "fields": {
          "value": {
            "type": "float",
            "required": false,
            "optional": true,
            "value": 0
          }
        }
      }
    },
    "mul": {
      "request": {
        "name": "Numbers",
        "fields": {
          "a": {
            "type": "float",
            "required": false,
            "optional": true,
            "value": 0
          },
          "b": {
            "type": "float",
            "required": false,
            "optional": true,
            "value": 0
          }
        }
      },
      "response": {
        "name": "Result",
        "fields": {
          "value": {
            "type": "float",
            "required": false,
            "optional": true,
            "value": 0
          }
        }
      }
    },
    "div": {
      "request": {
        "name": "Numbers",
        "fields": {
          "a": {
            "type": "float",
            "required": false,
            "optional": true,
            "value": 0
          },
          "b": {
            "type": "float",
            "required": false,
            "optional": true,
            "value": 0
          }
        }
      },
      "response": {
        "name": "Result",
        "fields": {
          "value": {
            "type": "float",
            "required": false,
            "optional": true,
            "value": 0
          }
        }
      }
    }
  }
}



m.describe.only('Snet', () => {

  m.it('should have valid class', async function () {
    const snet = await Snet.init(web3, {address:PERSONAL_ACCOUNT, privateKey:PERSONAL_PRIVATE_KEY});
    
    const orgs = await snet.listOrganizations();
    const org = await snet.getOrganization('snet', {init: false});
    const svc = await snet.getService('snet', 'example-service', {init: false});

    c.expect(snet).to.be.an.instanceof(Snet);
    c.expect(snet.utils).to.be.an.instanceof(Utils);
    c.expect(snet.account).to.be.an.instanceof(Account);
    c.expect(snet.account).to.be.an.instanceof(AccountSvc);
    c.expect(svc).to.be.an.instanceof(Service);
    c.expect(svc).to.be.an.instanceof(ServiceSvc);
    c.expect(orgs).to.be.an.instanceof(Array);
    c.expect(orgs[0]).to.be.an.instanceof(Organization);
    c.expect(orgs[0]).to.be.an.instanceof(OrganizationSvc);
    c.expect(org).to.be.an.instanceof(Organization);
    c.expect(org).to.be.an.instanceof(OrganizationSvc);

    c.expect(org).to.not.be.an.instanceof(Snet);
  });

  m.it('should list organization', async function () {
    const snet = await Snet.init(web3, {address:PERSONAL_ACCOUNT, privateKey:PERSONAL_PRIVATE_KEY});
    // organizations

    let orgs = await snet.listOrganizations();
    let org = orgs[0];

    c.expect(orgs.length).to.be.greaterThan(0);
    c.expect(org.isInit).to.be.false;
    c.expect(org.id).to.exist;
    c.expect(org.name).to.undefined;


    orgs = await snet.listOrganizations({init:true});
    org = orgs[0];

    c.expect(orgs.length).to.be.greaterThan(0);
    c.expect(org.isInit).to.be.true;
    c.expect(org.id).to.exist;
    c.expect(org.name).to.exist;
    c.expect(org.services.length).to.be.greaterThan(0);

  });

  m.xit('should get organization : snet', async function () {
    const snet = await Snet.init(web3, {address:PERSONAL_ACCOUNT, privateKey:PERSONAL_PRIVATE_KEY});
    const snetOrg = await snet.getOrganization('snet');

    c.expect(snetOrg.isInit).to.be.true;
    c.expect(snetOrg.id).to.be.equal('snet');
    c.expect(snetOrg.name).to.be.equal('snet');

    const snetSvcs = await snetOrg.getServices();

    let snetSvc = snetSvcs[0];
    c.expect(snetSvcs.length).to.be.greaterThan(0);

    c.expect(snetSvc.id).to.exist;
    c.expect(snetSvc.organizationId).to.be.equal('snet');
    c.expect(snetSvc.isInit).to.be.false;

  });

  m.xit('should get service: example-service', async function () {
    const snet = await Snet.init(web3, {address:PERSONAL_ACCOUNT, privateKey:PERSONAL_PRIVATE_KEY});
    
    const exampleSvc = await snet.getService('snet', 'example-service');
    
    c.expect(exampleSvc.id).to.be.equal('example-service');
    c.expect(exampleSvc.organizationId).to.be.equal('snet');
    c.expect(exampleSvc.isInit).to.be.true;
    c.expect(exampleSvc.tags).to.exist;
    c.expect(exampleSvc.metadata).to.exist;
    c.expect(exampleSvc.ServiceProto).to.exist;


    const svcInfo = await exampleSvc.info();
    c.expect(svcInfo).to.be.deep.equal(EXAMPLESVC_SERVICE_INFO);
    
  });

  m.xit('should open channel', async function () {
    const snet = await Snet.init(web3, {address:PERSONAL_ACCOUNT, privateKey:PERSONAL_PRIVATE_KEY});
    const svc = await snet.getService('snet', 'named-entity-disambiguation');
    
    const channel = await svc.openChannel(null, 1, 1000);
    console.log(channel);

    c.expect(channel.id).to.exist;

  }).timeout(10 * 60 * 1000);

  m.xit('should able to retrieve all services detail', async function() {
    const snet = await Snet.init(web3, {address:PERSONAL_ACCOUNT, privateKey:PERSONAL_PRIVATE_KEY});
    const svcs = await (await snet.getOrganization('snet')).getServices({init:true});
    console.log(svcs.map(s => s.id));

    for(var i in svcs) {
      const svc = svcs[i];
      const id = svc.data['id'];
      
      if(id === 'example-service' || id === 'named-entity-disambiguation'){
        console.log("******" + svc.data['id'] + "******");
        console.log(Object.keys(svc.info().methods));

        Object.keys(svc.info().methods).forEach(method => {
          console.log(svc.defaultRequest(method));
        });

        // console.log('*** proto json');
        // console.log(JSON.stringify(svc.rawJsonProto,null,1));
        // console.log('*** proto array');
        // console.log(svc.protoModelArray.Service[0].parent);
        
        console.log();
      }
    }
  });

  m.xit('should run addition job from snet, example-service', function (done) {
    let service;

    Snet.init(web3, {address:PERSONAL_ACCOUNT, privateKey:PERSONAL_PRIVATE_KEY})
    .then((snet) => snet.getService('snet','example-service'))
    .then((svc) => {
      service = svc;
      const addRequest = svc.defaultRequest('add');

      c.expect(addRequest).to.have.keys(['a','b']);

      addRequest['a'] = 3, addRequest['b'] = 4;

      console.log('addRequest : '+JSON.stringify(addRequest));

      return addRequest;

    }).then((req) => {
      const job = service.runJob('add', req);

      job.on('signed_header', console.log);
      job.on('selected_channel', console.log);
      job.then((response) => {console.log(response); done();});
      job.catch((err) => {console.error(err); done(err);});

    }).catch((err) => {
      console.error(err);
      done(err);
    })
  });

  m.xit('FOR INFO PURPOSE ONLY: try out individual service', function (done) {
    const snetP = Snet.init(web3, {address:PERSONAL_ACCOUNT, privateKey:PERSONAL_PRIVATE_KEY});

    // snetP.then(snet => snet.getService('snet', 'example-service'))
    //   .then(svc => {
    //     const job = svc.runJob('add', {a:1,b:4}, {channel_min_expiration: 10000});
    //     listAllEvents(job);
    //     job.then(v => { console.log(v); done(); });
    //     job.catch(done);
    //   });

    snetP.then(snet => snet.getService('snet', 'named-entity-disambiguation'))
      .then(svc => {
        const request = svc.defaultRequest('named_entity_disambiguation');
        request.input ="Macdonald was a great firm before it was sold to S. J. Wolfe &amp; Co. ";
        
        const job = svc.runJob('named_entity_disambiguation', request, {channel_min_expiration: 10000});
        job.then(v => { console.log(JSON.stringify(v)); done(); });
        job.catch(done);
      });
    
  }).timeout(10 * 60 * 1000);

  m.xit('FOR INFO PURPOSE ONLY: all services info', async function () {
    const snet = await Snet.init(web3, {address:PERSONAL_ACCOUNT, privateKey:PERSONAL_PRIVATE_KEY});
    const result = {};

    const orgs = await snet.listOrganizations({init:false});

    for(var i=0;i<orgs.length;i++) {
      const org = orgs[i];
      result[org.id] = [];
      const svcs = await org.getServices({init:true});
      
      for(var j=0;j<svcs.length;j++) {
        const info = await svcs[j].info();
        result[org.id].push(info);
      }
    }

    var fs = require('fs');
    console.log(result);
    fs.writeFileSync('services.json', JSON.stringify(result,null,3));
    
  }).timeout(50000);
})
