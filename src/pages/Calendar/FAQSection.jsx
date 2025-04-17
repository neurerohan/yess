import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

const faqData = [
  {
    question: "What is the Nepali Calendar (Bikram Sambat)?",
    answer: "The Bikram Sambat (BS) is the official solar calendar of Nepal. It is approximately 56 years and 8.5 months ahead of the Gregorian calendar (AD). It's used for official purposes, determining festival dates, and everyday life."
  },
  {
    question: "How do I read this calendar?",
    answer: "Each box represents a day. The large number is the Nepali (BS) date. The smaller date is the corresponding English (AD) date. Below that, you may find the 'Tithi' (lunar day) and a dot indicating events or holidays for that day. Click any day to see detailed events."
  },
  {
    question: "What is a 'Tithi'?",
    answer: "A Tithi represents a lunar day in the Hindu lunisolar calendar. Its duration can vary slightly. There are 30 tithis in a lunar month, divided into two pakshas (phases): Shukla Paksha (waxing moon) and Krishna Paksha (waning moon)."
  },
  {
    question: "How accurate is the event information?",
    answer: "The event and festival information is based on publicly available data. While efforts are made for accuracy, please verify critical dates with official sources, especially for regional festivals or holidays."
  },
  {
    question: "Can I convert dates between BS and AD?",
    answer: "Yes! This website also features a dedicated BS to AD Date Converter tool. You can find the link below the calendar."
  }
];

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left text-gray-700 hover:text-green-600 focus:outline-none"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-sm sm:text-base">{question}</span>
        {isOpen ? (
          <ChevronUpIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="mt-3 pl-2 pr-1 text-gray-600 text-sm sm:text-base leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};

const FAQSection = () => {
  return (
    <div className="mt-12 max-w-4xl mx-auto">
      <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-5 text-center">
        Frequently Asked Questions
      </h3>
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6">
        {faqData.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

export default FAQSection; 