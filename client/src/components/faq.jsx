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
      question: "How can I contact the landlord?",
      answer: "If the housing listing provides contact information, you can reach out to the landlord directly. If not, you can send a message through our platform if the landlord has enabled this feature."
    },
  
    {
      question: "Are all reviews verified?",
      answer: "We strive to ensure the authenticity of reviews. Our team regularly reviews submitted content, and we encourage users to report any suspicious or false reviews."
    },
    {
      question: "How can I improve my housing rating?",
      answer: "If you are a landlord, maintaining a clean, well-maintained property and responding promptly to tenant concerns can help improve your rating. Encouraging satisfied tenants to leave positive reviews can also be beneficial."
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