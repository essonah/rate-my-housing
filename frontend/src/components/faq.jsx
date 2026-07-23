import React, { useState } from 'react';
import './FAQ.css';

const FAQItem = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const answerId = `faq-answer-${index}`;

  return (
    <div className="faq-item">
      <h3 className="faq-question-heading">
        <button
          type="button"
          className="faq-question"
          aria-expanded={isOpen}
          aria-controls={answerId}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{question}</span>
          <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
        </button>
      </h3>
      {isOpen && (
        <div className="faq-answer" id={answerId}>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  const faqData = [
    {
      question: "How do I rate a housing option?",
      answer: "To rate a housing option, navigate to the housing listing and click on the 'Rate this Housing' button. You can then provide a star rating and leave a review."
    },
    {
      question: "How are the overall ratings calculated?",
      answer: "Overall ratings are calculated based on the average of all individual ratings submitted by users."
    },
    {
      question: "Is my review anonymous?",
      answer: "By default, your reviews are not anonymous. However, you can choose to post reviews anonymously by selecting the 'Post as Anonymous' option when submitting your review."
    },
    {
      question: "What should I include in my review?",
      answer: "Your review should include information about your experience, the condition of the housing, the landlord's responsiveness, and any other relevant details that might help other students make informed decisions."
    },
    {
      question: "Can I report inappropriate reviews?",
      answer: "Yes, if you come across a review that you believe is inappropriate or violates our guidelines, you can report it by clicking on the 'Report' button next to the review."
    },

    {
      question: "Are all reviews verified?",
      answer: "We strive to ensure the authenticity of reviews. Our team regularly reviews submitted content, and we encourage users to report any suspicious or false reviews."
    },
  
  ];

  return (
    <div className="faq">
      <h2>Frequently Asked Questions</h2>
      {faqData.map((faq, index) => (
        <FAQItem key={index} index={index} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  );
};

export default FAQ;
