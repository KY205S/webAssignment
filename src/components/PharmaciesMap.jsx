import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import PharmaciesMap from './MyMapComponent'; // 确保正确引入PharmaciesMap组件

const App = () => {
  const [postcode, setPostcode] = useState('');
  const [submit, setSubmit] = useState(false);

  const handlePostcodeChange = (event) => {
    setPostcode(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmit(true);
  };

  return (
    <Router>
      <div>
        <h1>药房位置服务</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={postcode}
            onChange={handlePostcodeChange}
            placeholder="请输入7位postcode"
            maxLength="7"
          />
          <button type="submit">查找药房</button>
        </form>
        {submit && <Navigate to={`/PharmaciesMap?postcode=${postcode}`} replace />}
        <Routes>
          <Route path="/PharmaciesMap" element={<PharmaciesMap postcode={new URLSearchParams(window.location.search).get('postcode')} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
