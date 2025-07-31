import React, { useState } from 'react';
import { Code, Zap, Target, CheckCircle, Clock, AlertCircle, Sparkles, MessageCircle, Send, HelpCircle } from 'lucide-react';

const N8nChallengeGenerator = () => {
  const [currentStep, setCurrentStep] = useState('difficulty');
  const [difficulty, setDifficulty] = useState('');
  const [challenge, setChallenge] = useState('');
  const [userWorkflow, setUserWorkflow] = useState('');
  const [review, setReview] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const difficultyLevels = [
    {
      level: 'easy',
      icon: <Target className="w-8 h-8" />,
      title: 'Easy',
      description: 'Perfect for beginners getting started with n8n',
      color: 'from-emerald-400 to-green-500',
      bgColor: 'from-emerald-500/10 to-green-500/20',
      borderColor: 'border-emerald-500/30 hover:border-emerald-400/50',
      textColor: 'text-emerald-400',
      glowColor: 'shadow-emerald-500/25'
    },
    {
      level: 'medium',
      icon: <Zap className="w-8 h-8" />,
      title: 'Medium',
      description: 'Intermediate challenges for growing skills',
      color: 'from-amber-400 to-orange-500',
      bgColor: 'from-amber-500/10 to-orange-500/20',
      borderColor: 'border-amber-500/30 hover:border-amber-400/50',
      textColor: 'text-amber-400',
      glowColor: 'shadow-amber-500/25'
    },
    {
      level: 'hard',
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Hard',
      description: 'Advanced challenges for n8n masters',
      color: 'from-purple-400 to-violet-500',
      bgColor: 'from-purple-500/10 to-violet-500/20',
      borderColor: 'border-purple-500/30 hover:border-purple-400/50',
      textColor: 'text-purple-400',
      glowColor: 'shadow-purple-500/25'
    }
  ];

  const generateChallenge = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Generate a creative and practical n8n workflow challenge for ${difficulty} difficulty level. 

IMPORTANT: Consider n8n's built-in node capabilities when creating challenges:

**EASY Level Guidelines:**
- Use primarily built-in n8n nodes and popular integrations with direct nodes
- Focus on basic workflow concepts: triggers, data transformation, simple conditions
- Common built-in nodes: HTTP Request, Set, IF, Switch, Code, Schedule Trigger, Webhook
- Well-supported apps: Google Sheets, Gmail, Slack, Discord, Notion, Airtable, Todoist
- Avoid: Complex API integrations, custom authentication, social media posting APIs
- Examples: Data processing, simple notifications, basic CRUD operations

**MEDIUM Level Guidelines:**
- Can include some API integrations that require API key setup
- More complex logic, loops, error handling
- Social media APIs (Facebook, Twitter, Instagram), payment APIs, more advanced integrations
- Multiple connected services with data transformation between them

**HARD Level Guidelines:**
- Complex API integrations, custom authentication flows
- Advanced JavaScript in Code nodes, complex data manipulation
- Multi-step workflows with sophisticated error handling and retry logic
- Custom webhook handling, complex conditional branching

The challenge should:
- Be realistic and applicable to real-world scenarios
- Include clear objectives and requirements
- Specify what nodes/integrations should be used
- Include example data or scenarios to work with
- Be appropriately scoped for ${difficulty} level complexity

Format your response as a well-structured challenge description that's engaging and clear. Don't include any JSON or code examples in the challenge description itself - just the requirements and scenario.`
            }
          ]
        })
      });

      const data = await response.json();
      setChallenge(data.content[0].text);
      setChatMessages([]); // Reset chat when new challenge is generated
      setCurrentStep('challenge');
    } catch (error) {
      console.error('Error generating challenge:', error);
      setChallenge('Sorry, there was an error generating the challenge. Please try again.');
      setCurrentStep('challenge');
    } finally {
      setIsGenerating(false);
    }
  };

  const reviewWorkflow = async () => {
    if (!userWorkflow.trim()) return;
    
    setIsReviewing(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [
            {
              role: "user",
              content: `Please review this n8n workflow JSON for the ${difficulty} level challenge:

CHALLENGE:
${challenge}

WORKFLOW JSON:
${userWorkflow}

Please provide a comprehensive code review covering:
1. **Correctness**: Does it solve the challenge requirements?
2. **Best Practices**: Are n8n best practices followed?
3. **Error Handling**: Is proper error handling implemented?
4. **Efficiency**: Could the workflow be optimized?
5. **Maintainability**: Is the workflow well-structured and maintainable?

Provide specific feedback with examples and suggestions for improvement. Be constructive and educational.`
            }
          ]
        })
      });

      const data = await response.json();
      setReview(data.content[0].text);
      setCurrentStep('review');
    } catch (error) {
      console.error('Error reviewing workflow:', error);
      setReview('Sorry, there was an error reviewing your workflow. Please try again.');
      setCurrentStep('review');
    } finally {
      setIsReviewing(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const conversationHistory = [
        {
          role: 'system',
          content: `You are an expert n8n automation specialist helping users with their workflow challenges. 

CONTEXT:
- Current challenge difficulty: ${difficulty}
- Current challenge: ${challenge}

IMPORTANT n8n KNOWLEDGE:
**Built-in Core Nodes:**
- Triggers: Schedule, Webhook, Manual, Email IMAP, HTTP Request
- Logic: IF, Switch, Merge, Split In Batches, Wait, Set, Code (JavaScript/Python)
- Data: Item Lists, Sort, Limit, Summarize, Aggregate, Filter
- Files: Read/Write Binary File, Move Binary Data

**Popular App Integrations (with dedicated nodes):**
- Google: Sheets, Drive, Gmail, Calendar, Docs, Forms
- Microsoft: Excel, Outlook, OneDrive, Teams, SharePoint
- Communication: Slack, Discord, Telegram, WhatsApp Business
- Productivity: Notion, Airtable, Todoist, Trello, Asana, ClickUp
- E-commerce: Shopify, WooCommerce, Stripe, PayPal
- CRM: HubSpot, Pipedrive, Salesforce
- Social: LinkedIn, Twitter API v2 (limited), YouTube
- Development: GitHub, GitLab, Jira
- Marketing: Mailchimp, SendGrid, ActiveCampaign

**HTTP Request Node:** Can connect to any REST API when no dedicated node exists
**Webhook Node:** Receives HTTP requests, great for triggers
**Code Node:** JavaScript/Python for custom logic and data manipulation
**Set Node:** Transforms and structures data
**IF/Switch Nodes:** Conditional logic and routing

**Common Patterns:**
- Trigger → Process → Action workflows
- Data sync between different platforms
- Automated notifications and alerts
- Content generation and distribution
- Data processing and transformation

Provide helpful, specific advice about n8n workflows, nodes to use, and implementation strategies. Be encouraging and educational.`
        },
        ...chatMessages,
        userMessage
      ];

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          messages: conversationHistory
        })
      });

      const data = await response.json();
      const assistantMessage = { role: 'assistant', content: data.content[0].text };
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      const errorMessage = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const resetChallenge = () => {
    setCurrentStep('difficulty');
    setDifficulty('');
    setChallenge('');
    setUserWorkflow('');
    setReview('');
    setChatMessages([]);
    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                background: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'][Math.floor(Math.random() * 4)],
                animation: `float ${Math.random() * 6 + 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-3/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-2xl shadow-blue-500/25 relative">
            <Code className="w-10 h-10 text-white" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl blur opacity-50 animate-pulse"></div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4">
            n8n Challenge Generator
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Master your automation skills with AI-generated challenges and expert code reviews
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {['difficulty', 'challenge', 'review'].map((step, index) => (
              <React.Fragment key={step}>
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  currentStep === step 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-blue-400 text-white shadow-lg shadow-blue-500/25' 
                    : index < ['difficulty', 'challenge', 'review'].indexOf(currentStep)
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-slate-800/50 border-slate-600 text-slate-400 backdrop-blur-sm'
                }`}>
                  {index < ['difficulty', 'challenge', 'review'].indexOf(currentStep) ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span className="font-semibold">{index + 1}</span>
                  )}
                </div>
                {index < 2 && (
                  <div className={`w-16 h-0.5 transition-all duration-300 ${
                    index < ['difficulty', 'challenge', 'review'].indexOf(currentStep)
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                      : 'bg-slate-600'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step 1: Difficulty Selection */}
        {currentStep === 'difficulty' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Choose Your Challenge Level</h2>
              <p className="text-slate-300 text-lg">Select the difficulty that matches your n8n expertise</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {difficultyLevels.map((level) => (
                <button
                  key={level.level}
                  onClick={() => setDifficulty(level.level)}
                  className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm ${
                    difficulty === level.level 
                      ? `${level.borderColor.replace('hover:', '')} shadow-2xl ${level.glowColor} scale-105` 
                      : level.borderColor
                  } bg-gradient-to-br ${level.bgColor} hover:shadow-xl`}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${level.color} text-white mb-4 shadow-lg relative`}>
                    {level.icon}
                    {difficulty === level.level && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${level.color} rounded-xl blur opacity-50 animate-pulse`}></div>
                    )}
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 ${level.textColor}`}>{level.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{level.description}</p>
                  {difficulty === level.level && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none"></div>
                  )}
                </button>
              ))}
            </div>
            <div className="text-center">
              <button
                onClick={generateChallenge}
                disabled={!difficulty || isGenerating}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    Generating Challenge...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-3" />
                    Generate Challenge
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Challenge Display */}
        {currentStep === 'challenge' && (
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Challenge Content */}
              <div className="lg:col-span-2">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-8 mb-8">
                  <div className="flex items-center mb-6">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${
                      difficultyLevels.find(d => d.level === difficulty)?.color
                    } text-white mr-4 shadow-lg relative`}>
                      {difficultyLevels.find(d => d.level === difficulty)?.icon}
                      <div className={`absolute inset-0 bg-gradient-to-br ${
                        difficultyLevels.find(d => d.level === difficulty)?.color
                      } rounded-xl blur opacity-50 animate-pulse`}></div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Your Challenge</h2>
                      <p className="text-slate-300 capitalize">{difficulty} Difficulty</p>
                    </div>
                  </div>
                  <div className="prose prose-slate max-w-none">
                    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-600/50 backdrop-blur-sm">
                      {challenge.split('\n').map((paragraph, index) => (
                        paragraph.trim() && (
                          <p key={index} className="mb-4 last:mb-0 text-slate-200 leading-relaxed">
                            {paragraph}
                          </p>
                        )
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-8">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Code className="w-6 h-6 mr-3 text-blue-400" />
                    Submit Your Solution
                  </h3>
                  <p className="text-slate-300 mb-6">Paste your n8n workflow JSON below for AI-powered code review</p>
                  <textarea
                    value={userWorkflow}
                    onChange={(e) => setUserWorkflow(e.target.value)}
                    placeholder="Paste your n8n workflow JSON here..."
                    className="w-full h-64 p-4 bg-slate-900/50 border border-slate-600/50 rounded-xl font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 text-slate-200 placeholder-slate-500 backdrop-blur-sm"
                  />
                  <div className="flex justify-between items-center mt-6">
                    <button
                      onClick={resetChallenge}
                      className="px-6 py-3 text-slate-400 hover:text-white font-medium transition-colors duration-200"
                    >
                      ← New Challenge
                    </button>
                    <button
                      onClick={reviewWorkflow}
                      disabled={!userWorkflow.trim() || isReviewing}
                      className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
                      {isReviewing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                          Reviewing Code...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-3" />
                          Get Code Review
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Help Chat */}
              <div className="lg:col-span-1">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-6 h-[600px] flex flex-col">
                  <div className="flex items-center mb-6">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white mr-3 shadow-lg relative">
                      <HelpCircle className="w-5 h-5" />
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl blur opacity-50 animate-pulse"></div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Need Help?</h3>
                      <p className="text-sm text-slate-300">Ask me anything about n8n!</p>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                    {chatMessages.length === 0 && (
                      <div className="text-center py-8">
                        <MessageCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-400 text-sm">Ask me for help with nodes, integrations, or workflow strategies!</p>
                      </div>
                    )}
                    {chatMessages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-xl ${
                          message.role === 'user' 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                            : 'bg-slate-700/50 text-slate-200 border border-slate-600/50 backdrop-blur-sm'
                        }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    {isChatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-slate-700/50 border border-slate-600/50 backdrop-blur-sm p-3 rounded-xl">
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-400 border-t-transparent"></div>
                            <span className="text-sm text-slate-300">Thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !isChatLoading && sendChatMessage()}
                      placeholder="Ask about n8n nodes, workflows..."
                      className="flex-1 p-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 text-slate-200 placeholder-slate-500 backdrop-blur-sm"
                      disabled={isChatLoading}
                    />
                    <button
                      onClick={sendChatMessage}
                      disabled={!chatInput.trim() || isChatLoading}
                      className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-400 hover:to-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Code Review */}
        {currentStep === 'review' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-8 mb-8">
              <div className="flex items-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white mr-4 shadow-lg relative">
                  <CheckCircle className="w-6 h-6" />
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl blur opacity-50 animate-pulse"></div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Code Review Complete</h2>
                  <p className="text-slate-300">AI-powered analysis of your workflow</p>
                </div>
              </div>
              <div className="prose prose-slate max-w-none">
                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-600/50 backdrop-blur-sm">
                  {review.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className="mb-4 last:mb-0 text-slate-200 leading-relaxed">
                        {paragraph}
                      </p>
                    )
                  ))}
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={resetChallenge}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
                <Sparkles className="w-5 h-5 mr-3" />
                Try Another Challenge
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(5px) rotate(240deg); }
        }
      `}</style>
    </div>
  );
};

export default N8nChallengeGenerator;
