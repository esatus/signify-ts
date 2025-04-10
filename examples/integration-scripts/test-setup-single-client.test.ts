import { SignifyClient } from 'signify-ts';
import { resolveEnvironment } from './utils/resolve-env';
import {
    assertOperations,
    getOrCreateClients,
    getOrCreateIdentifier,
} from './utils/test-util';

let client: SignifyClient;
let name1_id: string, name1_oobi: string;

beforeAll(async () => {
    // Create client with pre-defined secret. Allows working with known identifiers
    [client] = await getOrCreateClients(1, ['0ADF2TpptgqcDE5IQUF1HeTp']);
});
beforeAll(async () => {
    [name1_id, name1_oobi] = await getOrCreateIdentifier(client, 'name1');
});
afterAll(async () => {
    await assertOperations(client);
});

describe('test-setup-single-client', () => {
    test('step1', async () => {
        const env = resolveEnvironment();
        expect(client.controller?.pre).toEqual(
            'EB3UGWwIMq7ppzcQ697ImQIuXlBG5jzh-baSx-YG3-tY'
        );
    });

    test('step2', async () => {
        const env = resolveEnvironment();
        const oobi = await client.oobis().get('name1', 'witness');
        expect(oobi.oobis).toHaveLength(3);
        switch (env.preset) {
            case 'local':
                expect(name1_oobi).toEqual(
                    `http://127.0.0.1:3902/oobi/${name1_id}/agent/${client.agent?.pre}`
                );
                expect(oobi.oobis[0]).toEqual(
                    `http://127.0.0.1:5642/oobi/${name1_id}/witness/BBilc4-L3tFUnfM_wJr4S4OJanAv_VmF_dJNN6vkf2Ha`
                );
                expect(oobi.oobis[1]).toEqual(
                    `http://127.0.0.1:5643/oobi/${name1_id}/witness/BLskRTInXnMxWaGqcpSyMgo0nYbalW99cGZESrz3zapM`
                );
                expect(oobi.oobis[2]).toEqual(
                    `http://127.0.0.1:5644/oobi/${name1_id}/witness/BIKKuvBwpmDVA4Ds-EpL5bt9OqPzWPja2LigFYZN2YfX`
                );
                break;
            case 'docker':
                expect(name1_oobi).toEqual(
                    `http://keria:3902/oobi/${name1_id}/agent/${client.agent?.pre}`
                );
                expect(oobi.oobis[0]).toEqual(
                    `http://witness-demo:5642/oobi/${name1_id}/witness/BBilc4-L3tFUnfM_wJr4S4OJanAv_VmF_dJNN6vkf2Ha`
                );
                expect(oobi.oobis[1]).toEqual(
                    `http://witness-demo:5643/oobi/${name1_id}/witness/BLskRTInXnMxWaGqcpSyMgo0nYbalW99cGZESrz3zapM`
                );
                expect(oobi.oobis[2]).toEqual(
                    `http://witness-demo:5644/oobi/${name1_id}/witness/BIKKuvBwpmDVA4Ds-EpL5bt9OqPzWPja2LigFYZN2YfX`
                );
                break;
        }
    });

    test('validate config', async () => {
        const env = resolveEnvironment();
        const config = await client.config().get();
        switch (env.preset) {
            case 'local':
                expect(config).toEqual({
                    iurls: [
                        'http://127.0.0.1:5642/oobi/BBilc4-L3tFUnfM_wJr4S4OJanAv_VmF_dJNN6vkf2Ha/controller?name=Wan&tag=witness',
                        'http://127.0.0.1:5643/oobi/BLskRTInXnMxWaGqcpSyMgo0nYbalW99cGZESrz3zapM/controller?name=Wes&tag=witness',
                        'http://127.0.0.1:5644/oobi/BIKKuvBwpmDVA4Ds-EpL5bt9OqPzWPja2LigFYZN2YfX/controller?name=Wil&tag=witness',
                    ],
                });
                break;
            case 'docker':
                expect(config).toEqual({
                    iurls: [
                        'http://witness-demo:5642/oobi/BBilc4-L3tFUnfM_wJr4S4OJanAv_VmF_dJNN6vkf2Ha/controller',
                        'http://witness-demo:5643/oobi/BLskRTInXnMxWaGqcpSyMgo0nYbalW99cGZESrz3zapM/controller',
                        'http://witness-demo:5644/oobi/BIKKuvBwpmDVA4Ds-EpL5bt9OqPzWPja2LigFYZN2YfX/controller',
                        'http://witness-demo:5645/oobi/BM35JN8XeJSEfpxopjn5jr7tAHCE5749f0OobhMLCorE/controller',
                        'http://witness-demo:5646/oobi/BIj15u5V11bkbtAxMA7gcNJZcax-7TgaBMLsQnMHpYHP/controller',
                        'http://witness-demo:5647/oobi/BF2rZTW79z4IXocYRQnjjsOuvFUQv-ptCf8Yltd7PfsM/controller',
                    ],
                });
                break;
        }
    });
});
