import { filterOptions, splitMatch } from './autocomplete-logic';

describe('autocomplete-logic', () => {
  const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Kasur'];

  it('puts "starts with" matches before "contains" matches', () => {
    expect(filterOptions(cities, 'ka')).toEqual(['Karachi', 'Kasur']);
    expect(filterOptions(cities, 'la')).toEqual(['Lahore', 'Islamabad']);
  });

  it('returns the first options for an empty query, up to the limit', () => {
    expect(filterOptions(cities, '', 2)).toEqual(['Karachi', 'Lahore']);
  });

  it('splits a label around the match', () => {
    expect(splitMatch('Islamabad', 'lam')).toEqual(['Is', 'lam', 'abad']);
    expect(splitMatch('Lahore', 'xyz')).toEqual(['Lahore', '', '']);
  });
});
