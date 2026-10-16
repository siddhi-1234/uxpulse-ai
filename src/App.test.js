import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders UXPulse brand title', () => {
  render(<App />);
  const brandElement = screen.getByText(/UXPulse/i);
  expect(brandElement).toBeInTheDocument();
});
