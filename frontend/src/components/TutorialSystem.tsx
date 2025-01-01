import React, { useState, useEffect } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';
import { useNavigate } from 'react-router-dom';
import { useTutorial } from '../context/TutorialContext';
import { useTrades } from '../context/TradeContext';
import { supabase } from '../context/SupabaseClient';
import './TutorialSystem.module.css';

const tutorialSteps: Step[] = [
//1
  {
    target: 'body',
    content: 'Welcome to TradeMind! Let\'s take a quick tour of the platform to help you get started.',
    placement: 'center',
    disableBeacon: true,
  },
//2
  {
    target: '[data-tour="dashboard"]',
    content: 'This is your Dashboard. Here you can see your trading performance and key metrics at a glance.',
    placement: 'right',
    spotlightPadding: 5,
    floaterProps: {
      offset: 15,
      disableAnimation: true
    }
  },
//3
  {
    target: '[data-tour="stats-widgets"]',
    content: 'These quick stats show your key performance metrics, they are easily customizable and can be added or removed.',
    placement: 'bottom',
    spotlightPadding: 5,
    floaterProps: {
      offset: 15,
      disableAnimation: true
    }
  },
//4
  {
    target: '[data-tour="large-widgets"]',
    content: 'Larger widgets provide detailed insights like performance charts, trade distribution, and market analysis.',
    placement: 'bottom',
    spotlightPadding: 5,
    floaterProps: {
      offset: 15,
      disableAnimation: true
    }
  },
//5
  {
    target: '[data-tour="daily-journal"]',
    content: 'Track your daily trading thoughts and market analysis here.',
    placement: 'right',
    spotlightPadding: 5,
    floaterProps: {
      offset: 15,
      disableAnimation: true
    }
  },
//6
  {
    target: '[data-tour="trades"]',
    content: 'View and manage all your trades, track positions, and review history.',
    placement: 'right',
    spotlightPadding: 5,
    floaterProps: {
      offset: 15,
      disableAnimation: true
    }
  },
//7
  {
    target: '[data-tour="trades-table"]',
    content: 'Here you can see all your trades in detail. Each trade has a checkbox that you can use to select it for bulk actions.',
    placement: 'top',
    spotlightPadding: 5,
    floaterProps: {
      offset: 15,
      disableAnimation: true
    }
  },
//8
  {
    target: '[data-tour="select-all"]',
    content: 'The checkbox in the header allows you to quickly select or deselect all trades at once.',
    placement: 'bottom',
    spotlightPadding: 5,
    floaterProps: {
      offset: 15,
      disableAnimation: true
    }
  },
// //9
//   {
//     target: '[data-tour="mass-actions"]',
//     content: 'When trades are selected, this menu appears allowing you to update their strategy or delete them in bulk.',
//     placement: 'bottom',
//     spotlightPadding: 5,
//     floaterProps: {
//       offset: 15,
//       disableAnimation: true
//     }
//   },
//
    {
    target: '[data-tour="notebook"]',
    content: 'Document your trading ideas and market research in the notebook.',
    placement: 'right',
    spotlightPadding: 5,
    floaterProps: {
      offset: 15,
      disableAnimation: true
    }
  },
  {
    target: '[data-tour="add-folder"]',
    content: 'Click the + button to create new folders to organize your notes.',
    placement: 'right',
    spotlightPadding: 5,
    floaterProps: {
      offset: 15,
      disableAnimation: true
    }
  },
  {
    target: '[data-tour="folders-list"]',
    content: 'Your folders appear here. Click on a folder to view its notes.',
    placement: 'right',
    spotlightPadding: 5,
    floaterProps: {
      offset: 15,
      disableAnimation: true
    }
  },
//   {
//     target: '[data-tour="add-note"]',
//     content: 'Create new notes within your selected folder using the + button.',
//     placement: 'left',
//     spotlightPadding: 5,
//     floaterProps: {
//       offset: 15,
//       disableAnimation: true
//     }
//   },
//10
  {
    target: '[data-tour="playbook"]',
    content: 'Create and manage your trading strategies and rules.',
    placement: 'right',
    spotlightPadding: 5,
    floaterProps: {
      offset: 15,
      disableAnimation: true
    }
  },
  {
    target: '[data-tour="create-playbook"]',
    content: 'Click here to create a new playbook for your trading strategy.',
    placement: 'left',
    spotlightPadding: 5,
    floaterProps: {
      offset: 15,
      disableAnimation: true
    }
  },
  {
    target: '[data-tour="playbook-card"]',
    content: 'Click on any playbook to view detailed statistics and performance metrics for that strategy.',
    placement: 'bottom',
    spotlightPadding: 5,
    floaterProps: {
      offset: 15,
      disableAnimation: true
    }
  },
//   {
//     target: '[data-tour="playbook-stats"]',
//     content: 'Here you can see key metrics like Net P&L, Win Rate, and detailed trade history for your strategy.',
//     placement: 'top',
//     spotlightPadding: 5,
//     floaterProps: {
//       offset: 15,
//       disableAnimation: true
//     }
//   },
//11
  {
    target: '[data-tour="reports"]',
    content: 'Generate detailed reports to analyze your trading performance.',
    placement: 'right',
    spotlightPadding: 5,
    floaterProps: {
      offset: 15,
      disableAnimation: true
    }
  },
//12
  {
    target: '[data-tour="add-trade"]',
    content: 'Click here to log trades manually or import them automatically.',
    placement: 'bottom',
    spotlightPadding: 5,
    floaterProps: {
      offset: 15,
      disableAnimation: true
    }
  }
];

export default function TutorialSystem() {
  const navigate = useNavigate();
  const { showTutorial, setShowTutorial, setHasCompletedTutorial } = useTutorial();
  const { playbooks } = useTrades();
  const [currentStep, setCurrentStep] = useState(0);

  // Add tutorial-active class when tutorial starts
  useEffect(() => {
    if (showTutorial) {
      document.body.classList.add('tutorial-active');
    } else {
      document.body.classList.remove('tutorial-active');
    }

    return () => {
      document.body.classList.remove('tutorial-active');
    };
  }, [showTutorial]);

  const handleJoyrideCallback = async (data: CallBackProps) => {
    const { status, type, index, action } = data;
    
    const navigateAndScroll = (path: string) => {
      navigate(path);
      window.scrollTo(0, 0);
    };

    // Handle close button click
    if (type === 'step:after' && action === 'close') {
      if (index === 0) {  // Only for first step
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase
              .from('user_preferences')
              .update({ has_completed_tutorial: true })
              .eq('user_id', user.id);
          }
        } catch (error) {
          console.error('Error updating tutorial status:', error);
        }

        setShowTutorial(false);
        setHasCompletedTutorial(true);
        navigateAndScroll('/');
      }
      return;
    }

    // Update current step based on action
    if (type === 'step:after' && action === 'next') {
      const nextStep = index + 1;
      setCurrentStep(nextStep);
      
      // Handle navigation based on the next step
      switch (nextStep) {
        case 1: // Dashboard intro
          navigateAndScroll('/');
          break;
        case 2: // Stats widgets
        case 3: // Large widgets
          // Stay on dashboard for these steps
          break;
        case 4: // Daily Journal
          navigateAndScroll('/journal');
          break;
        case 5: // Trades
          navigateAndScroll('/trades');
          break;
        case 6: // Trades table
        case 7: // Select all
        case 8: // Mass actions
          // Stay on trades page for these steps
          break;
        case 9: // Notebook intro
          navigateAndScroll('/notebook');
          break;
        case 10: // Add folder
        case 11: // Folders list
          // Stay on notebook page for these steps
          break;
        case 12: // Playbook intro
          navigateAndScroll('/playbook');
          break;
        case 13: // Create playbook
          // Stay on playbook page
          break;
        case 14: // Playbook card
          // Stay on playbook page
          break;
        // case 15: // Playbook stats
        //   // Navigate to first available playbook if exists
        //   const firstPlaybook = playbooks[0];
        //   if (firstPlaybook) {
        //     navigateAndScroll(`/playbook/${firstPlaybook.id}`);
        //   }
        //   break;
        case 15: // Reports
          navigateAndScroll('/reports');
          break;
        default:
          break;
      }
    }

    // Handle back button
    if (type === 'step:after' && action === 'prev') {
      const prevStep = index - 1;
      setCurrentStep(prevStep);
      
      // Handle navigation based on the previous step
      switch (prevStep) {
        case 0: // Welcome
        case 1: // Dashboard intro
        case 2: // Stats widgets
        case 3: // Large widgets
          navigateAndScroll('/');
          break;
        case 4: // Daily Journal
          navigateAndScroll('/journal');
          break;
        case 5: // Trades
        case 6: // Trades table
        case 7: // Select all
        case 8: // Mass actions
          navigateAndScroll('/trades');
          break;
        case 9: // Notebook intro
        case 10: // Add folder
        case 11: // Folders list
          navigateAndScroll('/notebook');
          break;
        case 12: // Playbook intro
        case 13: // Create playbook
        case 14: // Playbook card
          navigateAndScroll('/playbook');
          break;
        case 15: // Playbook stats
          const firstPlaybook = playbooks[0];
          if (firstPlaybook) {
            navigateAndScroll(`/playbook/${firstPlaybook.id}`);
          }
          break;
        case 16: // Reports
          navigateAndScroll('/reports');
          break;
        default:
          break;
      }
    }

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('user_preferences')
            .update({ has_completed_tutorial: true })
            .eq('user_id', user.id);
        }
      } catch (error) {
        console.error('Error updating tutorial status:', error);
      }

      setShowTutorial(false);
      setHasCompletedTutorial(true);
      navigateAndScroll('/');
    }
  };

  return (
    <Joyride
      steps={tutorialSteps}
      run={showTutorial}
      continuous
      showProgress
      showSkipButton
      stepIndex={currentStep}
      callback={handleJoyrideCallback}
      disableCloseOnEsc
      styles={{
        options: {
          primaryColor: '#9333EA', // Purple-600
          textColor: '#FFFFFF',
          backgroundColor: '#1A1A1A',
          arrowColor: '#1A1A1A',
          overlayColor: 'rgba(0, 0, 0, 0.75)',
        },
        tooltip: {
          padding: '20px',
          borderRadius: '12px',
          backgroundColor: '#1A1A1A',
          border: '1px solid rgba(147, 51, 234, 0.3)', // Purple border
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
        }
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