import { HttpErrorResponse } from '@angular/common/http';

import { isNotFound, toProblemMessage } from './problem-message';

describe('toProblemMessage', () => {
  const fallback = 'Something went wrong.';

  it('explains that the API could not be reached', () => {
    const error = new HttpErrorResponse({ status: 0 });

    expect(toProblemMessage(error, fallback)).toContain('Could not reach the Pokedex service');
  });

  it('prefers the problem detail, then the title', () => {
    const withDetail = new HttpErrorResponse({ status: 404, error: { title: 'Pokemon not found', detail: 'No Pokemon exists with id 9999.' } });
    const withTitle = new HttpErrorResponse({ status: 500, error: { title: 'Something went wrong' } });

    expect(toProblemMessage(withDetail, fallback)).toBe('No Pokemon exists with id 9999.');
    expect(toProblemMessage(withTitle, fallback)).toBe('Something went wrong');
  });

  it('falls back when the body is not Problem Details', () => {
    const plainText = new HttpErrorResponse({ status: 502, error: 'Bad Gateway' });

    expect(toProblemMessage(plainText, fallback)).toBe(fallback);
    expect(toProblemMessage(new Error('boom'), fallback)).toBe(fallback);
  });
});

describe('isNotFound', () => {
  it('is true only for 404 responses', () => {
    expect(isNotFound(new HttpErrorResponse({ status: 404 }))).toBeTrue();
    expect(isNotFound(new HttpErrorResponse({ status: 500 }))).toBeFalse();
    expect(isNotFound(new Error('404'))).toBeFalse();
  });
});
