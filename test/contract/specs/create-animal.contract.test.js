import { provider } from '../config/initPact';
import { AnimalController } from '../../../controllers';

describe('Create an animal service', () => {
    beforeAll(async() => {
        await provider.setup();
    });
    describe('When someone wants to create an animal', () => {
        beforeAll(async() => {
            await provider.addInteraction({
                state: 'backend service is ready',
                uponReceiving: 'a request to create an animal',
                withRequest: {
                    method: 'POST',
                    path: '/animals',
                    body: {'name': 'New cat',
                    'breed': 'Anyway',
                    'gender': 'Male',
                    'isVaccinated': false,
                    'vaccines': []}
                },
                willRespondWith: {
                    status: 201
                }
            });
        });

        test('Then it should return correct information', async() => {
            const response = await AnimalController.register({'name': 'New cat',
            'breed': 'Anyway',
            'gender': 'Male',
            'isVaccinated': false,
            'vaccines': []});
            expect(response.data).toMatchSnapshot();

            await provider.verify();
        })

    });

    afterAll(async () => {
        await provider.finalize();
    });
});