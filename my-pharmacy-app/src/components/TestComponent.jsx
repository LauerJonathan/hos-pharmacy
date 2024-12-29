import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const TestComponent = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-md mx-auto bg-card p-6 rounded-lg shadow-lg space-y-4">
        <h1 className="text-2xl font-bold text-primary">
          Test des Composants UI
        </h1>
        
        <div className="space-y-2">
          <Input type="text" placeholder="Test de l'input..." />
        </div>

        <div className="space-y-2">
          <Button variant="default">Bouton Primary</Button>
          <Button variant="secondary">Bouton Secondary</Button>
          <Button variant="destructive">Bouton Destructive</Button>
          <Button variant="outline">Bouton Outline</Button>
        </div>
      </div>
    </div>
  );
};

export default TestComponent;