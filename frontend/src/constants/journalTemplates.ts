interface Template {
  name: string;
  content: string;
}

export const TEMPLATES: Template[] = [
  {
    name: 'Daily Review',
    content: `# Daily Trading Review

Market Analysis:
- Overall market conditions:
- Key levels:
- Important news:

Trading Performance:
- What went well:
- What could be improved:
- Key lessons:

Plan for Tomorrow:
- Focus areas:
- Potential setups:
- Risk management adjustments:`
  },
  {
    name: 'Trade Analysis',
    content: `# Trade Analysis

Setup:
- Pattern identified:
- Entry trigger:
- Risk/reward ratio:

Execution:
- Entry timing:
- Stop placement:
- Exit strategy:

Post-Trade Review:
- What worked:
- What could be improved:
- Lessons learned:`
  },
  {
    name: 'Weekly Review',
    content: `# Weekly Trading Review

Performance Summary:
- Total P&L:
- Win rate:
- Best/worst trades:

Market Analysis:
- Major trends:
- Key levels:
- Sector performance:

Strategy Review:
- Most effective setups:
- Areas for improvement:
- Adjustments needed:

Next Week's Plan:
- Focus areas:
- Risk management:
- Goals:`
  }
];
