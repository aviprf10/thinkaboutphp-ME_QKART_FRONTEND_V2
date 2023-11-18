// Form.js

import React from 'react';
import './FormStyles.css'; // Import the styles

const Form = () => {
  return (
    <div className="form-container">
      <label className="label" htmlFor="name">
        Name:
      </label>
      <input className="input" type="text" id="name" name="name" />

      <label className="label" htmlFor="email">
        Email:
      </label>
      <input className="input" type="email" id="email" name="email" />

      <button className="button" type="submit">
        Submit
      </button>
    </div>
  );
};

export default Form;
