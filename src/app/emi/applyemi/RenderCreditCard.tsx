'use client';

import { useState } from 'react';
import { ReactSVG } from 'react-svg';

export default function CreditCard() {
  const [cardNumber, setCardNumber] = useState('**** **** **** ****');

  const handleCardNumberChange = (e) => {
    const input = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (input.length <= 16) {
      const formatted = input
        .padEnd(16, '*')
        .replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
      setCardNumber(formatted);
    }
  };

  // Updated afterInjection to accept a single svg parameter
  const afterInjection = (svg: SVGSVGElement | null) => {
    if (!svg) {
      console.warn('SVG failed to load');
      return;
    }
    const textElement = svg.querySelector('#card-number');
    if (textElement) {
      textElement.textContent = cardNumber;
      // Adjust font size for very small SVG
      textElement.setAttribute('font-size', '6'); // Even smaller for 40px scale
    } else {
      console.warn('No <text> element with id="card-number" found in SVG');
      // Optionally add a text element if missing, with small coordinates
      const newTextElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      newTextElement.setAttribute('id', 'card-number');
      newTextElement.setAttribute('x', '5'); // Adjusted for small SVG
      newTextElement.setAttribute('y', '25'); // Adjusted for small SVG
      newTextElement.setAttribute('font-size', '6');
      newTextElement.setAttribute('font-family', 'Arial, sans-serif');
      newTextElement.setAttribute('fill', 'black');
      newTextElement.textContent = cardNumber;
      svg.appendChild(newTextElement);
    }
  };

  return (
    <div className="h-10 w-10 z-50"> {/* Tiny container: 40px x 40px */}
      <ReactSVG
        src="/svgfile/creditCardUi.svg"
        afterInjection={afterInjection}
        style={{ width: '10px', height: '40px' }} // Control size directly here: small 40px
      />
      {/* Uncomment if you want the input field (scaled small too) */}
      {/* <div className="mt-1">
        <input
          type="text"
          placeholder="Card #"
          onChange={handleCardNumberChange}
          maxLength="16"
          className="p-0.5 text-xs w-full" // Tiny input
        />
      </div> */}
    </div>
  );
}