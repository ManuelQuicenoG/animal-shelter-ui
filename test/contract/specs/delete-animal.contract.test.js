import { provider } from '../config/initPact';
import { AnimalController } from '../../../controllers';
import { Matchers } from '@pact-foundation/pact';

const animal_name = 'prueba';

describe('Given an animal service', () => {
    beforeAll(async() => {
        await provider.setup();
    });

    describe('When a request to remove a cat arrived ', () => {
        beforeAll(async() => {
            await provider.addInteraction({
                state: 'backend service is ready',
                uponReceiving: 'a request to delete a cat',
                withRequest: {
                    method: 'DELETE',
                    path: '/animals/'+animal_name
                },
                willRespondWith: {
                    status: 200,
                    body: Matchers.eachLike({
                        message: Matchers.string('Animal deleted successfully'),
                    }, {min: 1})
                }
            });
        });

        test('Then it should return a confirm message that indicate successfully process', async() => {
            const response = await AnimalController.delete(animal_name);
            expect(response.data).toMatchSnapshot();

            await provider.verify();
        })

    });

    afterAll(async () => {
        await provider.finalize();
    });
});
