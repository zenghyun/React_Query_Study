import { screen } from '@testing-library/react';

import { renderWithQueryClient } from '../../../test-utils';
import { Treatments } from '../Treatments';

/**
 * Wrap in Query Provider
 * - Create function to wrap in a Query Provider before rendering
 * - Query provider needs query client
 *  - Each test gets its own query client for best isolation
 * - Generate query client with a function
 *  - will help when we want to set up defaults 
 * - Allow overriding with 'special' client if needed for particular test 
 * - reference:https://tkdodo.eu/blog/testing-react-query#for-components
 * - Wrap for every test? Make a custom testing library render function 
 *  - https://testing-library.com/docs/react-testing-library/setup#custom-render
 */

test('renders response from query', async () => {
  renderWithQueryClient(<Treatments />);

  const treatmentTitles = await screen.findAllByRole('heading', {
    name: /massage|facial|scrub/i,
  });
  expect(treatmentTitles).toHaveLength(3);
});
