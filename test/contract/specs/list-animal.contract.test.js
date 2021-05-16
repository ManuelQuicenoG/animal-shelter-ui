import { Matchers } from '@pact-foundation/pact';
import { AnimalController } from '../../../controllers';
import { provider } from '../config/initPact';

describe('Animal Service', () => {
    beforeAll(async() => {
        await provider.setup();
    });
    describe('When a request to list all animals is made', () => {
        beforeAll(async () => {
            await provider.addInteraction({
                uponReceiving: 'a request to list all animals',
                state: "has animals",
                withRequest: {
                    method: 'GET',
                    path: '/animals'
                },
                willRespondWith: {
                    status: 200,
                    body: Matchers.eachLike(
                        {
                            name: Matchers.like('manchas'),
                            breed: Matchers.like("Bengali"),
                            gender: Matchers.like("Female"),
                            vaccinated: Matchers.boolean(true)
                        }, {min: 1}
                    )
                }
            });
        });

        test('should return the correct data', async () => {
            const response = await AnimalController.list();
            expect(response.data).toMatchSnapshot();
            
            await provider.verify()
        });

        afterAll(async() =>await provider.finalize());
    });
});
