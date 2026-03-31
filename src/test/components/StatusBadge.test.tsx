import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatusBadge from '@/components/common/StatusBadge';

describe('StatusBadge', () => {
  it('should render Active status', () => {
    render(<StatusBadge status="Active" />);
    const badge = screen.getByText('Active');
    expect(badge).toBeInTheDocument();
  });

  it('should render Inactive status', () => {
    render(<StatusBadge status="Inactive" />);
    const badge = screen.getByText('Inactive');
    expect(badge).toBeInTheDocument();
  });

  it('should render Pending status', () => {
    render(<StatusBadge status="Pending" />);
    const badge = screen.getByText('Pending');
    expect(badge).toBeInTheDocument();
  });

  it('should render Approved status', () => {
    render(<StatusBadge status="Approved" />);
    const badge = screen.getByText('Approved');
    expect(badge).toBeInTheDocument();
  });

  it('should render Rejected status', () => {
    render(<StatusBadge status="Rejected" />);
    const badge = screen.getByText('Rejected');
    expect(badge).toBeInTheDocument();
  });

  it('should render Not Started status', () => {
    render(<StatusBadge status="NotStarted" />);
    const badge = screen.getByText('Not Started');
    expect(badge).toBeInTheDocument();
  });
});

vhjds gdsgfaw