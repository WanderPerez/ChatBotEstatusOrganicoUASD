import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Menu, X, Book, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { suggestedQuestions } from './data/knowledge';
import { generateResponse } from './utils/ai';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'chat'>('home');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      type: 'bot',
      content: '¡Hola! Soy el asistente virtual de la Universidad Autónoma de Santo Domingo (UASD). Estoy aquí para responder tus dudas sobre el Estatuto Orgánico. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    // Get response from AI
    const responseText = await generateResponse(text);

    const newBotMsg: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: responseText,
      timestamp: new Date()
    };

    setIsTyping(false);
    setMessages(prev => [...prev, newBotMsg]);
  };

  const handleQuestionClick = (question: string) => {
    handleSendMessage(question);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  if (currentScreen === 'home') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-96 bg-blue-900 rounded-b-[100px] sm:rounded-b-[200px] shadow-xl"></div>
        <div className="absolute top-20 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 max-w-2xl w-full z-10 text-center relative border border-slate-100"
        >
          <div className="mx-auto w-24 h-24 bg-blue-900 rounded-full flex items-center justify-center mb-6 shadow-lg border-4 border-white">
            <Bot className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">
            Chatbot Inteligente <br className="hidden sm:block" />
            <span className="text-blue-600">Estatuto Orgánico UASD</span>
          </h1>
          
          <p className="text-slate-600 mb-8 text-lg leading-relaxed max-w-xl mx-auto">
            Bienvenido al asistente virtual diseñado para responder tus consultas relacionadas con el Estatuto Orgánico de la Universidad Autónoma de Santo Domingo (UASD).
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <Book className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-800 text-sm">Información Oficial</h3>
              <p className="text-xs text-slate-500 mt-1">Basado en el Estatuto Orgánico de la UASD.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <Sparkles className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-800 text-sm">IA Integrada</h3>
              <p className="text-xs text-slate-500 mt-1">Procesamiento de lenguaje natural.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <Bot className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-800 text-sm">Respuestas Rápidas</h3>
              <p className="text-xs text-slate-500 mt-1">Consultas claras y directas al instante.</p>
            </div>
          </div>
          
          <button
            onClick={() => setCurrentScreen('chat')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-xl inline-flex items-center gap-3"
          >
            Comenzar a consultar
            <Send className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden font-sans fixed inset-0">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Suggested Questions */}
      <motion.aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-80 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-blue-900 text-white">
          <div className="flex items-center gap-2">
            <Book className="w-5 h-5" />
            <h2 className="font-semibold text-lg">Preguntas Sugeridas</h2>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-blue-800 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-sm text-slate-500 mb-4 px-1">
            Selecciona una pregunta para consultar el Estatuto Orgánico.
          </p>
          {suggestedQuestions.map((q, index) => (
            <button
              key={index}
              onClick={() => handleQuestionClick(q)}
              className="w-full text-left p-3 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-100 transition-all text-sm text-slate-700 hover:text-blue-700 group flex items-start gap-2"
            >
              <Sparkles className="w-4 h-4 mt-0.5 text-blue-400 group-hover:text-blue-500 flex-shrink-0" />
              <span>{q}</span>
            </button>
          ))}
        </div>
      </motion.aside>

      {/* Main Chat Area */}
<main className="flex-1 flex flex-col h-[100dvh] lg:h-full bg-slate-50 relative overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 justify-between shadow-sm z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentScreen('home')}
              className="p-2 -ml-2 mr-1 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
              title="Volver al inicio"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            </button>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-md"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center flex-shrink-0 shadow-md">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-800">UASD Bot</h1>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                En línea
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <AlertCircle className="w-3.5 h-3.5 mr-1" />
            IA Basada en el Estatuto Orgánico
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-50 text-blue-800 text-xs px-4 py-2 rounded-full border border-blue-100 text-center max-w-lg">
              Este chatbot utiliza inteligencia artificial para responder preguntas basadas exclusivamente en el <strong>Estatuto Orgánico de la UASD</strong>.
            </div>
          </div>

          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                    message.type === 'user' ? 'bg-slate-700' : 'bg-blue-900 shadow-sm'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                  
                  {/* Message Bubble */}
                 <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
  <div className={`px-3 py-2.5 sm:px-4 sm:py-3 rounded-2xl text-sm sm:text-[15px] ${
    message.type === 'user' 
      ? 'bg-blue-600 text-white rounded-tr-sm shadow-md' 
      : 'bg-white text-slate-800 rounded-tl-sm shadow-sm border border-slate-100'
  }`}>
    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
  </div>
                    <span className="text-[11px] text-slate-400 mt-1.5 mx-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white px-4 py-4 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 flex items-center gap-1">
                  <motion.div className="w-2 h-2 bg-slate-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                  <motion.div className="w-2 h-2 bg-slate-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                  <motion.div className="w-2 h-2 bg-slate-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} className="h-1" />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
            className="max-w-4xl mx-auto flex gap-3 relative"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe tu pregunta sobre el Estatuto Orgánico..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-[15px] shadow-sm"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors shadow-md"
              aria-label="Enviar mensaje"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </form>
          <div className="text-center mt-2">
            <span className="text-[10px] text-slate-400">
              Las respuestas son generadas en base al Estatuto Orgánico de la UASD. Verifica la información importante.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
