import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Question } from './Question';
import type { Question as QuestionType } from '../types/quiz.types';

describe('Question Component', () => {
  const mockQuestion: QuestionType = {
    id: 'test1',
    question: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correct: 1,
    explanation: '2 + 2 equals 4',
    difficulty: 'easy',
    tags: ['math'],
  };

  const mockOnAnswer = vi.fn();

  beforeEach(() => {
    mockOnAnswer.mockClear();
  });

  it('renders question and options correctly', () => {
    render(<Question question={mockQuestion} onAnswer={mockOnAnswer} />);
    
    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
  });

  it('calls onAnswer when option is clicked', () => {
    render(<Question question={mockQuestion} onAnswer={mockOnAnswer} />);
    
    // Click on the button that contains option B (index 1)
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]); // Second button is option B (index 1)
    
    expect(mockOnAnswer).toHaveBeenCalledWith(1);
  });

  it('shows correct/incorrect answers when showResult is true', () => {
    render(
      <Question 
        question={mockQuestion} 
        onAnswer={mockOnAnswer}
        showResult={true}
        userAnswer={0}
      />
    );
    
    // Should show explanation
    expect(screen.getByText('Explanation')).toBeInTheDocument();
    expect(screen.getByText('2 + 2 equals 4')).toBeInTheDocument();
  });

  it('disables buttons when showing results', () => {
    render(
      <Question 
        question={mockQuestion} 
        onAnswer={mockOnAnswer}
        showResult={true}
        userAnswer={1}
      />
    );
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });
});