describe('example test', () => {
  test('check if 1 ≠ 2', () => {
    expect(1).not.toEqual(2);
    expect(1).toEqual(1);
    expect(() => {
      throw new Error('sample error');
    }).toThrow();
  });
});
