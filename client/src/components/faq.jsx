import React, { useState } from 'react';
import './FAQ.css';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-item">
      <button
        className="faq-question"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <span>{isOpen ? '-' : '+'}</span>
      </button>
      {isOpen && (
        <div className="faq-answer">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  const faqData = [
    {
      question: "How do you rate?",
      answer: "I don't know, but the flag is a big plus."
    },
    {
      question: "How do you make holy water?",
      answer: "You boil the hell out of it."
    },
    {
      question: "What do you call someone with no body and no nose?",
      answer: "Nobody knows."
    },
    {
      question: "Why do you never see elephants hiding in trees?",
      answer: "Because they're so good at it."
    },
    {
      question: "Why can't you hear a pterodactyl go to the bathroom?",
      answer: "Because the P is silent."
    },
    {
      question: "Why did the invisible man turn down the job offer?",
      answer: "He couldn't see himself doing it."
    },
  ];

  return (
    <div className="faq">
      <h2>Frequently Asked Questions</h2>
      {faqData.map((faq, index) => (
        <FAQItem key={index} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  );
};

export default FAQ;