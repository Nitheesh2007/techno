import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import Scan from './pages/Scan';
import Recipes from './pages/Recipes';
import MealPlan from './pages/MealPlan';
import ShoppingList from './pages/ShoppingList';
import FridgeMap from './pages/FridgeMap';
import PreservationGuide from './pages/PreservationGuide';
import Community from './pages/Community';
import BarcodeHub from './pages/BarcodeHub';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Nutrition from './pages/Nutrition';
import KitchenAudit from './pages/KitchenAudit';
import CompostLab from './pages/CompostLab';
import DealsRadar from './pages/DealsRadar';
import Challenges from './pages/Challenges';
import Household from './pages/Household';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-emerald-500/30 transition-colors duration-200">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />

              <Route path="/products" element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              } />

              <Route path="/products/add" element={
                <ProtectedRoute>
                  <AddProduct />
                </ProtectedRoute>
              } />

              <Route path="/scan" element={
                <ProtectedRoute>
                  <Scan />
                </ProtectedRoute>
              } />

              <Route path="/recipes" element={
                <ProtectedRoute>
                  <Recipes />
                </ProtectedRoute>
              } />

              <Route path="/meal-plan" element={
                <ProtectedRoute>
                  <MealPlan />
                </ProtectedRoute>
              } />

              <Route path="/shopping-list" element={
                <ProtectedRoute>
                  <ShoppingList />
                </ProtectedRoute>
              } />

              <Route path="/fridge-map" element={
                <ProtectedRoute>
                  <FridgeMap />
                </ProtectedRoute>
              } />

              <Route path="/nutrition" element={
                <ProtectedRoute>
                  <Nutrition />
                </ProtectedRoute>
              } />

              <Route path="/audit" element={
                <ProtectedRoute>
                  <KitchenAudit />
                </ProtectedRoute>
              } />

              <Route path="/preservation-guide" element={
                <ProtectedRoute>
                  <PreservationGuide />
                </ProtectedRoute>
              } />

              <Route path="/compost" element={
                <ProtectedRoute>
                  <CompostLab />
                </ProtectedRoute>
              } />

              <Route path="/deals-radar" element={
                <ProtectedRoute>
                  <DealsRadar />
                </ProtectedRoute>
              } />

              <Route path="/challenges" element={
                <ProtectedRoute>
                  <Challenges />
                </ProtectedRoute>
              } />

              <Route path="/household" element={
                <ProtectedRoute>
                  <Household />
                </ProtectedRoute>
              } />

              <Route path="/community" element={
                <ProtectedRoute>
                  <Community />
                </ProtectedRoute>
              } />

              <Route path="/barcode-hub" element={
                <ProtectedRoute>
                  <BarcodeHub />
                </ProtectedRoute>
              } />

              <Route path="/analytics" element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } />

              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } />

              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />

              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
