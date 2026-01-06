import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProcessingScreen from './screens/ProcessingScreen';
import RelationshipsScreen from './screens/RelationshipsScreen';
import ReviewScreen from './screens/ReviewScreen';
import DashboardScreen from './screens/DashboardScreen';
import ShareScreen from './screens/ShareScreen';
import MobilePreviewScreen from './screens/MobilePreviewScreen';
import AnalysisScreen from './screens/AnalysisScreen';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/processing" element={<ProcessingScreen />} />
        <Route path="/relationships" element={<RelationshipsScreen />} />
        <Route path="/review" element={<ReviewScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/share" element={<ShareScreen />} />
        <Route path="/mobile-preview" element={<MobilePreviewScreen />} />
        <Route path="/analysis" element={<AnalysisScreen />} />
      </Routes>
    </Router>
  );
};

export default App;