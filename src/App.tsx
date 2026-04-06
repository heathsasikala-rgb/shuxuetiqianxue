import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  Lightbulb, 
  Triangle, 
  BarChart3, 
  ChevronRight, 
  ArrowLeft, 
  Rocket, 
  BookOpen,
  CheckCircle2,
  PlayCircle,
  Sparkles,
  Loader2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { CURRICULUM_DATA, Module, KnowledgePoint } from './constants';

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export default function App() {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<KnowledgePoint | null>(null);
  const [aiContent, setAiContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'advance' | 'sync'>('advance');
  
  // AI Assistant State
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [userQuestion, setUserQuestion] = useState("");
  const [assistantReply, setAssistantReply] = useState("");
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);

  const handlePointClick = async (point: KnowledgePoint) => {
    setSelectedPoint(point);
    setIsLoading(true);
    setAiContent("");

    try {
      const prompt = `你是一位资深的苏教版小学数学老师。请针对知识点“${point.title}”（${point.grade}）生成一份“提前学”讲义。
      要求：
      1. 语言亲切生动，适合小学生阅读。
      2. 包含：【核心概念】（用通俗易懂的话解释）、【典型例题】（给出详细解题步骤）、【学习小妙招】（记忆口诀或技巧）。
      3. 格式清晰，使用Markdown。`;

      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: prompt }] }],
      });

      setAiContent(response.text || "生成内容失败，请重试。");
    } catch (error) {
      console.error("Gemini Error:", error);
      setAiContent("抱歉，生成内容时遇到错误。请检查网络或稍后再试。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskAssistant = async () => {
    if (!userQuestion.trim()) return;
    setIsAssistantLoading(true);
    setAssistantReply("");

    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: `你是一位专业的小学数学助教。请用简单易懂的语言回答学生的问题：${userQuestion}` }] }],
      });
      setAssistantReply(response.text || "我没听清，能再说一遍吗？");
    } catch (error) {
      setAssistantReply("哎呀，我出了一点小差错，请稍后再问我吧。");
    } finally {
      setIsAssistantLoading(false);
    }
  };

  const renderDashboard = () => (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <header className="text-center space-y-2">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center justify-center gap-2 text-yellow-500"
        >
          <Sparkles className="w-6 h-6 fill-current" />
          <h1 className="text-3xl font-bold text-gray-800">数学提前学</h1>
        </motion.div>
        <p className="text-gray-500">每天进步一点点，数学变得很简单！</p>
      </header>

      <div className="flex justify-center gap-8 py-4">
        <button 
          onClick={() => setMode('advance')}
          className={`flex flex-col items-center gap-2 transition-all ${mode === 'advance' ? 'scale-110 opacity-100' : 'opacity-50 grayscale'}`}
        >
          <div className="p-4 rounded-2xl bg-blue-50 text-blue-600 shadow-sm">
            <Rocket className="w-8 h-8" />
          </div>
          <span className="font-bold text-gray-700">提前学</span>
          <span className="text-xs text-gray-400">一课一规划</span>
        </button>
        <button 
          onClick={() => setMode('sync')}
          className={`flex flex-col items-center gap-2 transition-all ${mode === 'sync' ? 'scale-110 opacity-100' : 'opacity-50 grayscale'}`}
        >
          <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm">
            <BookOpen className="w-8 h-8" />
          </div>
          <span className="font-bold text-gray-700">同步学</span>
          <span className="text-xs text-gray-400">课本全精讲</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CURRICULUM_DATA.map((module, index) => (
          <motion.button
            key={module.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedModule(module)}
            className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all hover:shadow-lg text-left ${module.color}`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/50 backdrop-blur-sm">
                {module.id === 'calculation' && <Calculator className="w-6 h-6" />}
                {module.id === 'problem-solving' && <Lightbulb className="w-6 h-6" />}
                {module.id === 'geometry' && <Triangle className="w-6 h-6" />}
                {module.id === 'statistics' && <BarChart3 className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-xl font-bold">{module.title}</h3>
                <p className="text-sm opacity-80">已学 0 / {module.points.length * 15}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-white/50 px-3 py-1 rounded-full text-sm font-medium">
              开始 <ChevronRight className="w-4 h-4" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const renderModuleView = () => (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <button 
        onClick={() => setSelectedModule(null)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> 返回首页
      </button>

      <div className={`p-8 rounded-3xl border-2 ${selectedModule?.color}`}>
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-3xl font-bold">{selectedModule?.title}模块</h2>
        </div>
        <p className="opacity-80">这里汇集了苏教版小学数学所有的{selectedModule?.title}知识点，点击开始提前预习吧！</p>
      </div>

      <div className="space-y-3">
        {selectedModule?.points.map((point) => (
          <button
            key={point.id}
            onClick={() => handlePointClick(point)}
            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                <PlayCircle className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-800">{point.title}</h4>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{point.grade}</span>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-gray-200" />
          </button>
        ))}
      </div>
    </div>
  );

  const renderLearningView = () => (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <button 
        onClick={() => {
          setSelectedPoint(null);
          setAiContent("");
        }}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> 返回列表
      </button>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h2 className="text-2xl font-bold mb-1">{selectedPoint?.title}</h2>
          <p className="text-blue-100 opacity-80">{selectedPoint?.grade} · 提前学讲义</p>
        </div>

        <div className="p-8 prose prose-blue max-w-none">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="text-gray-500 animate-pulse">AI 老师正在为你准备讲义...</p>
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {aiContent || "点击下方按钮开始学习"}
            </div>
          )}
        </div>

        {!isLoading && aiContent && (
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-center">
            <button 
              onClick={() => {
                setSelectedPoint(null);
                setAiContent("");
              }}
              className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all active:scale-95"
            >
              我学完了！
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans selection:bg-blue-100">
      <AnimatePresence mode="wait">
        {!selectedModule && !selectedPoint && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderDashboard()}
          </motion.div>
        )}

        {selectedModule && !selectedPoint && (
          <motion.div
            key="module"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
          >
            {renderModuleView()}
          </motion.div>
        )}

        {selectedPoint && (
          <motion.div
            key="learning"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            {renderLearningView()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating AI Assistant Button */}
      <button 
        onClick={() => setIsAssistantOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all active:scale-95 z-50 group"
      >
        <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-12 right-0 bg-white text-blue-600 px-3 py-1 rounded-lg text-sm font-bold shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          有问题问我！
        </span>
      </button>

      {/* AI Assistant Modal */}
      <AnimatePresence>
        {isAssistantOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAssistantOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-bold">数学小助手</span>
                </div>
                <button onClick={() => setIsAssistantOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                  <ArrowLeft className="w-5 h-5 rotate-90" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {assistantReply ? (
                  <div className="bg-blue-50 p-4 rounded-2xl text-gray-700 leading-relaxed">
                    {assistantReply}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-10">
                    <p>你好！我是你的数学小助手。</p>
                    <p className="text-sm">你可以问我任何数学问题，比如：</p>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {["什么是凑十法？", "长方形面积怎么算？", "鸡兔同笼怎么解？"].map(q => (
                        <button 
                          key={q}
                          onClick={() => setUserQuestion(q)}
                          className="px-3 py-1 bg-gray-100 rounded-full text-xs hover:bg-blue-100 hover:text-blue-600 transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {isAssistantLoading && (
                  <div className="flex items-center gap-2 text-blue-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">正在思考中...</span>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAskAssistant()}
                    placeholder="输入你的数学问题..."
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  <button 
                    onClick={handleAskAssistant}
                    disabled={isAssistantLoading || !userQuestion.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50 hover:bg-blue-700 transition-colors"
                  >
                    提问
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
