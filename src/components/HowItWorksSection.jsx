import React from 'react';
import { Smartphone, UtensilsCrossed, Bike, Clock, ArrowRight } from 'lucide-react';
import { processSteps } from '../data/reviewsData';

export default function HowItWorksSection() {
  const icons = {
    smartphone: <Smartphone size={32} />,
    'chef-hat': <UtensilsCrossed size={32} />,
    truck: <Bike size={32} />
  };

  return (
    <section className="section-wrapper process-section" id="how-it-works">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-centered">
          <span className="badge-tag" style={{ background: '#fff1f4', color: '#ff2a5f' }}>
            SIMPLE PROCESS
          </span>
          <h2 className="section-title">
            How it <span className="text-gradient-pink">Works</span>
          </h2>
          <p className="section-subtitle">
            Three simple steps to effortless healthy living.
          </p>
        </div>

        {/* 3 Step Cards from Video */}
        <div className="process-steps-grid">
          {processSteps.map((step) => (
            <div key={step.number} className="process-step-card">
              {/* Number Badge */}
              <div className="step-badge-number">{step.number}</div>

              {/* Neumorphic Pedestal Icon */}
              <div className="step-icon-pedestal">
                {icons[step.icon]}
              </div>

              {/* Content */}
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
