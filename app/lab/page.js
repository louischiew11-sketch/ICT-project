'use client';

import Link from 'next/link';
import { RefreshCw, Activity, ChevronRight, ChevronLeft, Settings, Hammer, Minimize2, Maximize2, Home, Lightbulb, CheckCircle2, XCircle, ZoomIn, ZoomOut, BookOpen, FlaskConical } from 'lucide-react';
import { usePhysicsLab } from './usePhysicsLab';

export default function Lab() {
  const {
    sceneRef,
    phase, setPhase,
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
      
      {/* 🚀 NEW: FULL-SCREEN LESSON PAGE */}
      {phase === 'lesson' && (
        <div className="absolute inset-0 z-50 bg-slate-950 overflow-y-auto custom-scrollbar">
          <div className="min-h-screen flex flex-col max-w-4xl mx-auto px-6 py-12 sm:py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Header Navigation */}
            <div className="flex items-center justify-between mb-12">
              <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition">
                <Home className="w-5 h-5" /> <span>Home</span>
              </Link>
              <div className="flex gap-4">
                <button onClick={() => setLesson(Math.max(1, lesson - 1))} disabled={lesson === 1} className="p-2 text-slate-400 hover:text-white disabled:opacity-30 transition bg-slate-900 rounded-lg border border-slate-800 hover:border-slate-600"><ChevronLeft className="w-5 h-5"/></button>
                <button onClick={() => setLesson(Math.min(10, lesson + 1))} disabled={lesson === 10} className="p-2 text-slate-400 hover:text-white disabled:opacity-30 transition bg-slate-900 rounded-lg border border-slate-800 hover:border-slate-600"><ChevronRight className="w-5 h-5"/></button>
              </div>
            </div>

            {/* Lesson Title */}
            <div className="flex items-center gap-4 mb-8 text-cyan-400">
              <div className="p-4 bg-cyan-950/30 rounded-2xl border border-cyan-900/50">
                <BookOpen className="w-10 h-10" />
              </div>
              <div>
                <p className="text-cyan-500 font-bold uppercase tracking-widest text-sm mb-1">Module {lesson} of 10</p>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white">{currentLesson.title}</h1>
              </div>
            </div>

            {/* Deep Theory Content */}
            <div className="space-y-6 text-lg sm:text-xl text-slate-300 leading-relaxed mb-12">
              {currentLesson.theory.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
            
            {/* Formula Block */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-3xl border border-slate-800 flex flex-col items-center justify-center text-center shadow-2xl mb-16">
              <p className="text-sm text-slate-500 mb-3 uppercase tracking-widest font-semibold">Governing Formula</p>
              <p className="text-4xl sm:text-5xl text-emerald-400 font-mono font-bold tracking-tight">{currentLesson.formula}</p>
            </div>

            <div className="flex-grow"></div> {/* Pushes buttons to the bottom if screen is tall */}

            {/* Bottom Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pb-8">
              <button 
                onClick={() => setShowQuiz(true)}
                className="group flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 px-8 rounded-2xl border border-slate-700 transition-all hover:border-yellow-500/50"
              >
                <Lightbulb className="w-6 h-6 text-yellow-500 group-hover:scale-110 transition-transform" />
                Take the Quiz
              </button>
              
              <button 
                onClick={() => setPhase('play')}
                className="group flex items-center justify-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-5 px-8 rounded-2xl transition-all shadow-lg shadow-cyan-900/50"
              >
                <FlaskConical className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                Test It in Lab
              </button>
            </div>

          </div>
        </div>
      )}

      {/* QUIZ MODAL - Placed at z-[60] so it appears over the full-screen lesson */}
      {showQuiz && currentLesson.quiz && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 sm:p-8 rounded-3xl max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-xl">
                  <Lightbulb className="w-6 h-6 text-yellow-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">Knowledge Check</h2>
              </div>
              <button onClick={() => setShowQuiz(false)} className="text-slate-500 hover:text-white transition p-1 bg-slate-800 rounded-full">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <p className="text-slate-300 mb-8 leading-relaxed text-lg">{currentLesson.quiz.question}</p>
            
            <div className="space-y-3 mb-6 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
              {currentLesson.quiz.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === currentLesson.quiz.answer;
                let btnClass = "w-full text-left px-5 py-4 rounded-xl border text-base font-medium transition-all duration-200 ";
                if (quizState === 'idle') {
                  btnClass += "border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:border-slate-500 hover:text-white";
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
              <div className={`p-5 rounded-2xl flex items-start gap-4 animate-in slide-in-from-bottom-4 ${quizState === 'correct' ? 'bg-emerald-950/50 border border-emerald-900/50' : 'bg-rose-950/50 border border-rose-900/50'}`}>
                {quizState === 'correct' ? <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" /> : <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />}
                <div>
                  <h4 className={`text-lg font-bold mb-1 ${quizState === 'correct' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {quizState === 'correct' ? 'Correct!' : 'Not quite!'}
                  </h4>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{currentLesson.quiz.explanation}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PHASE 2: HUD & PLAY MENU (Only visible when phase is 'play') */}
      {phase === 'play' && (
        <div className="absolute top-4 left-4 right-4 sm:right-auto sm:left-6 sm:top-6 z-30 pointer-events-none flex justify-between items-start max-h-[60vh] sm:max-h-[85vh] overflow-y-auto custom-scrollbar max-w-[calc(100vw-32px)]">
          <div className={`bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl shadow-2xl pointer-events-auto transition-all duration-300 ease-in-out ${isMinimized ? 'w-fit p-3 sm:p-4' : 'w-full sm:w-fit min-w-[280px] sm:max-w-md p-4 sm:p-6'}`}>
            <div className={`flex items-center justify-between gap-4 ${isMinimized ? '' : 'mb-4 pb-4 border-b border-slate-800'}`}>
              <div className="flex items-center gap-2">
                {!isMinimized && (
                  <Link href="/" className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 rounded-xl transition mr-1" title="Back to Home">
                    <Home className="w-4 h-4" />
                  </Link>
                )}
                {!isMinimized && <button onClick={() => setLesson(Math.max(1, lesson - 1))} className="p-2 bg-slate-800 hover:bg-cyan-600 rounded-xl disabled:opacity-30 transition"><ChevronLeft className="w-4 h-4"/></button>}
                <Activity className="text-cyan-400 w-5 h-5 hidden sm:block"/>
                <h1 className="text-base sm:text-lg font-bold text-white whitespace-nowrap">
                  {isMinimized ? `L${lesson}` : `Lesson ${lesson}`}
                </h1>
                {!isMinimized && <button onClick={() => setLesson(Math.min(10, lesson + 1))} className="p-2 bg-slate-800 hover:bg-cyan-600 rounded-xl disabled:opacity-30 transition"><ChevronRight className="w-4 h-4"/></button>}
              </div>
              <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-xl transition">
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
            </div>
            
            {!isMinimized && (
              <div className="animate-in fade-in">
                <div className="flex justify-between items-center mb-1">
                  <h2 className="text-cyan-400 font-semibold">{currentLesson.title}</h2>
                  <button onClick={() => setPhase('lesson')} className="text-xs text-slate-400 hover:text-cyan-400 underline flex items-center gap-1"><BookOpen className="w-3 h-3"/> Read Theory</button>
                </div>
                <p className="text-slate-400 text-sm mb-4">{currentLesson.desc}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {currentLesson.buttons?.map((btn, i) => (
                    <button key={i} onClick={btn.action} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm border border-slate-700 transition font-medium">
                      {btn.label}
                    </button>
                  ))}
                  
                  {currentLesson.isGravity && (
                    <>
                      <button onClick={() => changeGravity('Earth')} className={`px-3 py-2 rounded-xl text-sm border font-medium ${gravityType === 'Earth' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>Earth</button>
                      <button onClick={() => changeGravity('Moon')} className={`px-3 py-2 rounded-xl text-sm border font-medium ${gravityType === 'Moon' ? 'bg-slate-300 text-slate-900 border-slate-400' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>Moon</button>
                      <button onClick={() => changeGravity('Jupiter')} className={`px-3 py-2 rounded-xl text-sm border font-medium ${gravityType === 'Jupiter' ? 'bg-orange-700 text-white border-orange-600' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>Jupiter</button>
                    </>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <button onClick={() => setShowCustomizer(!showCustomizer)} className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 text-sm font-medium transition w-full">
                    <Settings className="w-4 h-4" /> {showCustomizer ? 'Close Forge' : 'Open Forge'}
                  </button>
                  
                  {showCustomizer && (
                    <div className="mt-4 space-y-4 bg-slate-950/50 p-5 rounded-2xl border border-slate-800">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-slate-500 block mb-2 tracking-wider">SHAPE</label>
                          <select onChange={e => setCustomShape(e.target.value)} className="w-full bg-slate-800 text-sm p-2.5 rounded-xl border border-slate-700 text-slate-200 outline-none focus:border-cyan-500">
                            <option value="circle">Circle</option><option value="square">Square</option><option value="triangle">Triangle</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 block mb-2 tracking-wider">MATERIAL</label>
                          <select onChange={e => setCustomMaterial(e.target.value)} className="w-full bg-slate-800 text-sm p-2.5 rounded-xl border border-slate-700 text-slate-200 outline-none focus:border-cyan-500">
                            <option value="wood">Wood</option><option value="metal">Metal</option><option value="rubber">Rubber</option><option value="ice">Ice</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-slate-500 flex justify-between mb-2 tracking-wider"><span>SIZE</span><span className="text-cyan-400">{customSize}px</span></label>
                          <input type="range" min="15" max="80" value={customSize} onChange={e => setCustomSize(Number(e.target.value))} className="w-full accent-cyan-500"/>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 flex justify-between mb-2 tracking-wider"><span>MASS</span><span className="text-indigo-400">{customMassMult}x</span></label>
                          <input type="range" min="0.1" max="10" step="0.1" value={customMassMult} onChange={e => setCustomMassMult(Number(e.target.value))} className="w-full accent-indigo-500"/>
                        </div>
                      </div>
                      <button onClick={() => spawn('custom')} className="w-full flex justify-center items-center gap-2 py-3 mt-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-indigo-900/30">
                        <Hammer className="w-4 h-4" /> Forge Object
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Physics Canvas */}
      <div ref={sceneRef} className={`absolute inset-0 z-10 touch-none ${phase === 'lesson' ? 'hidden' : ''}`} />

      {/* Zoom and Reset Controls */}
      {phase === 'play' && (
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex flex-col sm:flex-row items-end sm:items-center gap-3">
          <div className="flex bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-800 overflow-hidden pointer-events-auto">
            <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.4))} className="px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 transition border-r border-slate-700">
              <ZoomOut className="w-5 h-5" />
            </button>
            <div className="px-4 flex items-center justify-center text-sm font-bold text-slate-300 min-w-[3.5rem]">
              {Math.round(zoom * 100)}%
            </div>
            <button onClick={() => setZoom(z => Math.min(z + 0.2, 3))} className="px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 transition border-l border-slate-700">
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>
          
          <button onClick={clearLab} className="flex pointer-events-auto items-center gap-2 px-5 py-3 bg-rose-600/90 hover:bg-rose-500 text-white rounded-2xl shadow-xl backdrop-blur-md transition-all">
            <RefreshCw className="w-5 h-5"/> <span className="hidden sm:inline font-bold">Reset</span>
          </button>
        </div>
      )}

    </div>
  );
}