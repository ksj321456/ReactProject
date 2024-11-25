import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
<<<<<<< HEAD
import RegisterPage from './RegisterPage';
import Portfolio from './Portfolio';
import CoinTable from './CoinTable';
import CoinChart from './CoinChart';
=======
>>>>>>> origin/master

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
<<<<<<< HEAD
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/main" element={<CoinTable />} />
                <Route path="/portfolio" element={<Portfolio/>}/>
                <Route path='/chart' element={<CoinChart />} />
=======
>>>>>>> origin/master
            </Routes>
        </Router>
    );
}

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> origin/master
