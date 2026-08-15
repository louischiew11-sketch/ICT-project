'use client';

import Link from 'next/link';
import { RefreshCw, Activity, ChevronRight, ChevronLeft, Settings, Hammer, Minimize2, Maximize2, Home, Lightbulb, CheckCircle2, XCircle, ZoomIn, ZoomOut, BookOpen, ArrowRight } from 'lucide-react';
import { usePhysicsLab } from './usePhysicsLab';

export default function Lab() {
  const {
    sceneRef,
    phase, setPhase, // 🚀 Pulling in the phase state
    isMinimized, setIsMinimized,
    lesson, setLesson,
    gravityType, changeGravity,
    showCustomizer, setShowCustomizer,
    customShape, setCustomShape,
    customMaterial, setCustomMaterial,
    customSize, setCustomSize,
    customMassMult, setCustomMassMult,
    showQuiz, setShowQuiz,
    quizState, setQuizState,
    selectedAnswer, setSelectedAnswer,
    zoom, setZoom,
    clearLab,
    spawn,
    currentLesson
  } = usePhysicsLab();

  return (
    <div className="relative h-screen w-full overflow-hidden bg-slate-950">
      
      {/* 🚀 NEW: PHASE 1 - THE LESSON OVERLAY */}
      {phase === 'lesson' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-6">
          <div className="max-w-2xl w-full bg-slate-900 p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-12 fade-in duration-500">
            
            <div className="flex items-center gap-3 mb-6 text-cyan-400">
              <BookOpen className="w-8 h-8" />
              <h1 className="text-3xl font-bold text-white">Lesson {lesson}: {currentLesson.title}</h1>
            </div>

            <div className="space-y-6 text-lg text-slate-300">
              <p className="leading-relaxed">
                {currentLesson.theory}
              </p>
              
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-center shadow-inner">
                <p className="text-sm text-slate-500 mb-2 uppercase tracking-widest">Governing Formula</p>
                <p className="text-3xl text-emerald-400 font-bold">{currentLesson.formula}</p>
              </div>
            </div>

            <button 
              onClick={() => setPhase('play')}
              className="mt-10 w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-cyan-900/50"
            >
              I'm ready. Let's Play!
              <ArrowRight className="w-5 h-5" />
            </button>
            
            {/* Quick Navigation directly from the lesson card */}
            <div className="mt-6 flex justify-between items-center text-sm">
              <button onClick={() => setLesson(Math.max(1, lesson - 1))} disabled={lesson === 1} className="text-slate-500 hover:text-cyan-400 disabled:opacity-30 transition flex items-center gap-1"><ChevronLeft className="w-4 h-4"/> Prev Lesson</button>
              <button onClick={() => setLesson(Math.min(10, lesson + 1))} disabled={lesson === 10} className="text-slate-500 hover:text-cyan-400 disabled:opacity-30 transition flex items-center gap-1">Next Lesson <ChevronRight className="w-4 h-4"/></button>
            </div>
          </div>
        </div>
      )}

      {/* QUIZ MODAL */}
      {showQuiz && currentLesson.quiz && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-md w-full shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" /> Knowledge Check
              </h2>
              <button onClick={() => setShowQuiz(false)} className="text-slate-400 hover:text-white transition">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed text-sm sm:text-base">{currentLesson.quiz.question}</p>
            <div className="space-y-3 mb-6 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
              {currentLesson.quiz.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === currentLesson.quiz.answer;
                let btnClass = "w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-200 ";
                if (quizState === 'idle') {
                  btnClass += "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:border-slate-500 hover:text-white";
                } else {
                  if (isCorrect) btnClass += "border-emerald-500 bg-emerald-900/30 text-emerald-400";
                  else if (isSelected && !isCorrect) btnClass += "border-rose-500 bg-rose-900/30 text-rose-400";
                  else btnClass += "border-slate-800 bg-slate-900/50 text-slate-500 opacity-50";
                }
                return (
                  <button key={idx} disabled={quizState !== 'idle'} onClick={() => { setSelectedAnswer(idx); setQuizState(isCorrect ? 'correct' : 'incorrect'); }} className={btnClass}>
                    {opt}
                  </button>
                );
              })}
            </div>
            {quizState !== 'idle' && (
              <div className={`p-4 rounded-xl flex items-start gap-3 animate-in slide-in-from-bottom-2 ${quizState === 'correct' ? 'bg-emerald-900/20 border border-emerald-800/50' : 'bg-rose-900/20 border border-rose-800/50'}`}>
                {quizState === 'correct' ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
                <div>
                  <h4 className={`font-bold mb-1 ${quizState === 'correct' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {quizState === 'correct' ? 'Correct!' : 'Not quite!'}
                  </h4>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{currentLesson.quiz.explanation}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PHASE 2: HUD & PLAY MENU (Only visible when phase is 'play') */}
      {phase === 'play' && (
        <div className="absolute top-4 left-4 right-4 sm:right-auto sm:left-6 sm:top-6 z-30 pointer-events-none flex justify-between items-start max-h-[60vh] sm:max-h-[85vh] overflow-y-auto custom-scrollbar max-w-[calc(100vw-32px)]">
          <div className={`bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl pointer-events-auto transition-all duration-300 ease-in-out ${isMinimized ? 'w-fit p-3 sm:p-4' : 'w-full sm:w-fit min-w-[280px] sm:max-w-md p-4 sm:p-6'}`}>
            <div className={`flex items-center justify-between gap-4 ${isMinimized ? '' : 'mb-4 pb-4 border-b border-slate-800'}`}>
              <div className="flex items-center gap-2">
                {!isMinimized && (
                  <Link href="/" className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 rounded-lg transition mr-1" title="Back to Home">
                    <Home className="w-4 h-4" />
                  </Link>
                )}
                {!isMinimized && <button onClick={() => setLesson(Math.max(1, lesson - 1))} className="p-2 bg-slate-800 hover:bg-cyan-600 rounded-lg disabled:opacity-30 transition"><ChevronLeft className="w-4 h-4"/></button>}
                <Activity className="text-cyan-400 w-5 h-5 hidden sm:block"/>
                <h1 className="text-base sm:text-lg font-bold text-white whitespace-nowrap">
                  {isMinimized ? `L${lesson}` : `Lesson ${lesson}`}
                </h1>
                {!isMinimized && <button onClick={() => setLesson(Math.min(10, lesson + 1))} className="p-2 bg-slate-800 hover:bg-cyan-600 rounded-lg disabled:opacity-30 transition"><ChevronRight className="w-4 h-4"/></button>}
              </div>
              <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-lg transition">
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
            </div>
            
            {!isMinimized && (
              <div className="animate-in fade-in">
                <div className="flex justify-between items-center mb-1">
                  <h2 className="text-cyan-400 font-semibold">{currentLesson.title}</h2>
                  {/* Button to go back and read the lesson again */}
                  <button onClick={() => setPhase('lesson')} className="text-xs text-slate-500 hover:text-cyan-400 underline">Read Theory</button>
                </div>
                <p className="text-slate-400 text-sm mb-4">{currentLesson.desc}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {currentLesson.buttons?.map((btn, i) => (
                    <button key={i} onClick={btn.action} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm border border-slate-700 transition">
                      {btn.label}
                    </button>
                  ))}
                  
                  {currentLesson.isGravity && (
                    <>
                      <button onClick={() => changeGravity('Earth')} className={`px-3 py-2 rounded-lg text-sm border ${gravityType === 'Earth' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>Earth</button>
                      <button onClick={() => changeGravity('Moon')} className={`px-3 py-2 rounded-lg text-sm border ${gravityType === 'Moon' ? 'bg-slate-300 text-slate-900' : 'bg-slate-800 text-slate-400'}`}>Moon</button>
                      <button onClick={() => changeGravity('Jupiter')} className={`px-3 py-2 rounded-lg text-sm border ${gravityType === 'Jupiter' ? 'bg-orange-700 text-white' : 'bg-slate-800 text-slate-400'}`}>Jupiter</button>
                    </>
                  )}
                </div>

                {currentLesson.quiz && (
                  <div className="pt-4 border-t border-slate-800 mb-4">
                    <button onClick={() => setShowQuiz(true)} className="w-full flex justify-center items-center gap-2 py-2.5 bg-yellow-900/20 hover:bg-yellow-900/40 text-yellow-500 border border-yellow-700/50 rounded-lg text-sm font-semibold transition shadow-inner">
                      <Lightbulb className="w-4 h-4" /> Test Knowledge
                    </button>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-800">
                  <button onClick={() => setShowCustomizer(!showCustomizer)} className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 text-sm font-medium transition w-full">
                    <Settings className="w-4 h-4" /> {showCustomizer ? 'Close Forge' : 'Open Forge'}
                  </button>
                  
                  {showCustomizer && (
                    <div className="mt-4 space-y-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-slate-500 block mb-2">SHAPE</label>
                          <select onChange={e => setCustomShape(e.target.value)} className="w-full bg-slate-800 text-xs p-2 rounded-md border border-slate-700">
                            <option value="circle">Circle</option><option value="square">Square</option><option value="triangle">Triangle</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 block mb-2">MATERIAL</label>
                          <select onChange={e => setCustomMaterial(e.target.value)} className="w-full bg-slate-800 text-xs p-2 rounded-md border border-slate-700">
                            <option value="wood">Wood</option><option value="metal">Metal</option><option value="rubber">Rubber</option><option value="ice">Ice</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-slate-500 flex justify-between mb-1"><span>SIZE</span><span>{customSize}px</span></label>
                          <input type="range" min="15" max="80" value={customSize} onChange={e => setCustomSize(Number(e.target.value))} className="w-full accent-cyan-500"/>
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 flex justify-between mb-1"><span>MASS</span><span>{customMassMult}x</span></label>
                          <input type="range" min="0.1" max="10" step="0.1" value={customMassMult} onChange={e => setCustomMassMult(Number(e.target.value))} className="w-full accent-indigo-500"/>
                        </div>
                      </div>
                      <button onClick={() => spawn('custom')} className="w-full flex justify-center items-center gap-2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition">
                        <Hammer className="w-4 h-4" /> Forge
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Physics Canvas (Always rendering in the background!) */}
      <div ref={sceneRef} className={`absolute inset-0 z-10 touch-none ${phase === 'lesson' ? 'opacity-30 blur-sm pointer-events-none' : ''}`} />

      {/* Zoom and Reset Controls (Only visible in 'play' phase) */}
      {phase === 'play' && (
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex flex-col sm:flex-row items-end sm:items-center gap-3">
          <div className="flex bg-slate-900/90 backdrop-blur-md rounded-xl shadow-lg border border-slate-800 overflow-hidden pointer-events-auto">
            <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.4))} className="px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 transition border-r border-slate-700">
              <ZoomOut className="w-5 h-5" />
            </button>
            <div className="px-3 flex items-center justify-center text-xs font-bold text-slate-400 min-w-[3rem]">
              {Math.round(zoom * 100)}%
            </div>
            <button onClick={() => setZoom(z => Math.min(z + 0.2, 3))} className="px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 transition border-l border-slate-700">
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>
          
          <button onClick={clearLab} className="flex pointer-events-auto items-center gap-2 px-4 py-3 bg-rose-600/90 hover:bg-rose-500 text-white rounded-xl shadow-lg backdrop-blur-md transition-all">
            <RefreshCw className="w-5 h-5"/> <span className="hidden sm:inline font-semibold">Reset</span>
          </button>
        </div>
      )}

    </div>
  );
}