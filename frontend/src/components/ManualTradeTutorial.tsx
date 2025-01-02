import React, { useState } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';
import { useTutorial } from '../context/TutorialContext';
import { supabase } from '../context/SupabaseClient';

const manualTradeSteps: Step[] = [
  {
    target: 'body',
    content: 'Welcome to the Manual Trade Entry form! Let\'s walk through how to properly log your trades.',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="trade-datetime"]',
    content: 'Start by entering the date and time of your trade. This helps in tracking your trading patterns across different times.',
    placement: 'bottom',
    disableScrolling: true,
  },
  {
    target: '[data-tour="trade-contract"]',
    content: 'Select your contract type (e.g., MES, MNQ) and whether it was a Long or Short trade. Each contract has a specific multiplier that affects your P&L calculation.',
    placement: 'bottom',
    disableScrolling: true,
  },
  {
    target: '[data-tour="trade-strategy"]',
    content: 'Choose the strategy you used for this trade. This helps in analyzing which strategies are most profitable.',
    placement: 'bottom',
    disableScrolling: true,
  },
  {
    target: '[data-tour="trade-brokerage"]',
    content: 'Select your brokerage platform. This helps in tracking fees and performance across different brokers.',
    placement: 'bottom',
    disableScrolling: true,
  },
  {
    target: '[data-tour="trade-prices"]',
    content: 'Enter your entry price, original stop loss, and take profit levels. These help calculate your risk-to-reward ratios.',
    placement: 'bottom',
    disableScrolling: true,
  },
  {
    target: '[data-tour="trade-quantity"]',
    content: 'Specify how many contracts you traded. This affects your total P&L calculation.',
    placement: 'bottom',
    disableScrolling: true,
  },
  {
    target: '[data-tour="trade-executions"]',
    content: 'This section shows all your trade executions. By default, there is an entry execution that matches your entry price and quantity.',
    placement: 'top',
    disableScrolling: true,
  },
  {
    target: '[data-tour="add-exit-btn"]',
    content: '⚠️ IMPORTANT: You MUST add at least one exit execution for your P&L to be calculated correctly! Click this button to add your exit price and quantity. If you scaled out of the position, you can add multiple exits.',
    placement: 'top',
    disableScrolling: true,
    spotlightPadding: 15,
  },
  {
    target: '[data-tour="trade-screenshot"]',
    content: 'Upload a screenshot of your trade. This is helpful for later review and learning.',
    placement: 'bottom',
    disableScrolling: true,
  },
  {
    target: '[data-tour="trade-notes"]',
    content: 'Add detailed notes about your trade setup, market conditions, and any lessons learned.',
    placement: 'bottom',
    disableScrolling: true,
  }
];

export default function ManualTradeTutorial() {
  const { 
    showManualTradeTutorial, 
    setShowManualTradeTutorial, 
    setHasCompletedManualTradeTutorial 
  } = useTutorial();
  const [currentStep, setCurrentStep] = useState(0);

  const handleJoyrideCallback = async (data: CallBackProps) => {
    const { status, type, index, action } = data;

    // Handle close button click
    if (type === 'step:after' && action === 'close') {
      if (index === 0) {  // Only for first step
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase
              .from('user_preferences')
              .update({ has_completed_manual_trade_tutorial: true })
              .eq('user_id', user.id);
          }
        } catch (error) {
          console.error('Error updating manual trade tutorial status:', error);
        }

        setShowManualTradeTutorial(false);
        setHasCompletedManualTradeTutorial(true);
      }
      return;
    }

    // Update current step
    if (type === 'step:after' && action === 'next') {
      setCurrentStep(index + 1);
    }

    if (type === 'step:after' && action === 'prev') {
      setCurrentStep(index - 1);
    }

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('user_preferences')
            .update({ has_completed_manual_trade_tutorial: true })
            .eq('user_id', user.id);
        }
      } catch (error) {
        console.error('Error updating manual trade tutorial status:', error);
      }

      setShowManualTradeTutorial(false);
      setHasCompletedManualTradeTutorial(true);
    }
  };

  return (
    <Joyride
      steps={manualTradeSteps}
      run={showManualTradeTutorial}
      continuous
      showProgress
      showSkipButton
      stepIndex={currentStep}
      callback={handleJoyrideCallback}
      disableCloseOnEsc
      scrollToFirstStep={false}
      scrollOffset={0}
      disableScrolling
      styles={{
        options: {
          primaryColor: '#9333EA',
          textColor: '#FFFFFF',
          backgroundColor: '#1A1A1A',
          arrowColor: '#1A1A1A',
          overlayColor: 'rgba(0, 0, 0, 0.75)',
          zIndex: 1000,
        },
        tooltip: {
          padding: '20px',
          borderRadius: '12px',
          backgroundColor: '#1A1A1A',
          border: '1px solid rgba(147, 51, 234, 0.3)',
        },
        tooltipContainer: {
          textAlign: 'center'
        },
        tooltipTitle: {
          color: '#FFFFFF',
          fontSize: '16px',
          fontWeight: '600'
        },
        tooltipContent: {
          color: '#E5E7EB',
          fontSize: '14px',
          padding: '10px 0'
        },
        buttonNext: {
          backgroundColor: '#9333EA',
          padding: '8px 16px',
          borderRadius: '8px',
          color: '#FFFFFF',
          border: 'none',
          fontSize: '14px',
          fontWeight: '500',
          transition: 'background-color 0.2s ease',
        },
        buttonBack: {
          marginRight: '8px',
          padding: '8px 16px',
          borderRadius: '8px',
          color: '#E5E7EB',
          backgroundColor: 'transparent',
          border: '1px solid rgba(147, 51, 234, 0.5)',
          fontSize: '14px',
          fontWeight: '500',
          transition: 'background-color 0.2s ease',
        },
        buttonSkip: {
          color: '#9CA3AF',
          fontSize: '14px',
          fontWeight: '500',
          transition: 'color 0.2s ease',
        },
        buttonClose: {
          transform: 'scale(0.8)',
          padding: '8px',
          color: '#9CA3AF',
          transition: 'color 0.2s ease',
        }
      }}
      floaterProps={{
        styles: {
          arrow: {
            color: '#1A1A1A'
          }
        },
        disableAnimation: true
      }}
      locale={{
        last: 'Got it!',
        skip: 'Skip tutorial',
        next: 'Next (Step %{step} of %{total})',
        back: 'Back'
      }}
      disableOverlayClose
      spotlightClicks
      disableOverlay={false}
    />
  );
} 