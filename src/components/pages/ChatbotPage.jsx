
// pages/ChatbotPage.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components.css";

/** ---------------------------
 *  Web Speech API: SpeechRecognition 래퍼
 *  --------------------------- */
function makeRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    const rec = new SR();
    rec.lang = "ko-KR";
    rec.interimResults = true;
    rec.continuous = false; // 브라우저별 자동종료 보완은 onend에서
    return rec;
}

/** ---------------------------
 *  Silence Timer (침묵 감지)
 *  --------------------------- */
function useSilenceTimer(callback, ms = 1100) {
    const timer = useRef(null);
    const reset = useCallback(() => {
        clear();
        timer.current = setTimeout(callback, ms);
    }, [callback, ms]);
    const clear = useCallback(() => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }
    }, []);
    return { reset, clear };
}

/** ---------------------------
 *  Beep (시작/종료 피드백)
 *  --------------------------- */
function useBeep() {
    const ctxRef = useRef(null);
    const init = () => {
        if (!ctxRef.current) {
            try {
                ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
            } catch {}
        }
    };
    const beep = (freq = 880, dur = 0.06, type = "sine") => {
        init();
        const ctx = ctxRef.current;
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.value = 0.05;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        setTimeout(() => {
            osc.stop();
            osc.disconnect();
            gain.disconnect();
        }, dur * 1000);
    };
    return { beep };
}

/** ---------------------------
 *  TTS (선택적 읽어주기)
 *  --------------------------- */
function useTTS() {
    const speak = (text, lang = "ko-KR") => {
        if (!window.speechSynthesis) return;
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = lang;
        utter.rate = 1.0;
        utter.pitch = 1.0;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
    };
    const stop = () => {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
    return { speak, stop };
}

/** ---------------------------
 *  Auto scroll to bottom
 *  --------------------------- */
function useAutoScroll(deps) {
    const areaRef = useRef(null);
    useEffect(() => {
        const el = areaRef.current;
        if (!el) return;
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, deps);
    return areaRef;
}

/** ---------------------------
 *  메시지 유틸
 *  --------------------------- */
function uid() {
    return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

/** ===========================
 *   ChatbotPage
 *  =========================== */
export default function ChatbotPage() {
    const navigate = useNavigate();

    // 음성 인식기/상태
    const recRef = useRef(null);
    const [supported, setSupported] = useState(true);
    const [listening, setListening] = useState(false); // 사용자 토글 상태
    const [engineActive, setEngineActive] = useState(false); // 실제 엔진 동작
    const [interim, setInterim] = useState("");
    const [finalBuf, setFinalBuf] = useState("");

    const { beep } = useBeep();
    const { speak, stop: stopTTS } = useTTS();

    // 침묵시 자동 전송
    const autoSendCb = useCallback(() => {
        const text = finalBuf.trim();
        if (text) {
            autoSend(text);
            setFinalBuf("");
        }
    }, [finalBuf]);
    const { reset: resetSilence, clear: clearSilence } = useSilenceTimer(autoSendCb, 1100);

    // 메시지
    const [messages, setMessages] = useState([
        {
            id: uid(),
            sender: "bot",
            text:
                '안녕하세요! 복지 도우미 띵동이에요. 마이크를 켜고 질문하세요.\n예시: "신청 가능한 복지혜택 알려줘"',
        },
    ]);

    // 빠른질문 칩
    const quickChips = [
        "문화누리카드 조건 알려줘",
        "내 지역 복지 신규 뭐 있어?",
        "기초연금 언제부터 가능?",
        "장애인 활동지원 신청 방법",
    ];

    /** 인식기 초기화 */
    useEffect(() => {
        const rec = makeRecognition();
        if (!rec) {
            setSupported(false);
            return;
        }

        rec.onstart = () => {
            setEngineActive(true);
            setInterim("");
        };

        rec.onresult = (e) => {
            let interimText = "";
            let finalText = "";
            for (let i = e.resultIndex; i < e.results.length; i++) {
                const seg = e.results[i][0].transcript.trim();
                if (e.results[i].isFinal) finalText += seg + " ";
                else interimText += seg + " ";
            }
            if (interimText) setInterim(interimText);

            if (finalText) {
                setFinalBuf((prev) => (prev + " " + finalText).trim());
                resetSilence();
            }
        };

        rec.onerror = (e) => {
            // 마이크 권한/네트워크 등 오류
            setEngineActive(false);
            setInterim("");
            // 너무 공격적 재시작 방지 + 사용자 의지가 있는 경우만
            if (listening) {
                setTimeout(() => {
                    try {
                        rec.start();
                    } catch {}
                }, 300);
            }
        };

        rec.onend = () => {
            setEngineActive(false);
            setInterim("");
            // 사용자가 끄지 않았으면 자동 재시작(모바일 보호)
            if (listening) {
                try {
                    rec.start();
                } catch {}
            }
        };

        recRef.current = rec;
        return () => {
            try {
                rec.abort();
            } catch {}
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listening]); // listening이 변할 때만 반응

    /** 탭 전환/잠금 시 정리 */
    useEffect(() => {
        const handleVis = () => {
            if (document.hidden) stopMic(true);
        };
        window.addEventListener("visibilitychange", handleVis);
        return () => window.removeEventListener("visibilitychange", handleVis);
    }, []);

    /** 자동 스크롤 */
    const areaRef = useAutoScroll([messages, interim, engineActive]);

    /** 메시지 액션 */
    const handleCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch {}
    };
    const handleSpeak = (text) => speak(text);
    const handleDelete = (id) => {
        setMessages((prev) => prev.filter((m) => m.id !== id));
    };

    /** 네트워크 스트리밍 호출 (가능하면) + 데모 폴백 */
    const callApiStream = async (text, onChunk) => {
        try {
            const base = import.meta.env.VITE_API_BASE_URL || 'https://d32cc7c8eb4b.ngrok-free.app';
            const res = await fetch(`${base}/api/chat/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'text/plain'
                },
                body: JSON.stringify({ text })
            });
            if (res.ok && res.body) {
                const reader = res.body.getReader();
                const decoder = new TextDecoder('utf-8');
                let done = false;
                while (!done) {
                    const { value, done: doneReading } = await reader.read();
                    done = doneReading;
                    const chunkValue = value ? decoder.decode(value, { stream: !done }) : '';
                    if (chunkValue) onChunk(chunkValue);
                }
                return;
            }
        } catch (e) {
            // 서버 미구현/네트워크 에러 시 데모로 대체
        }

        // 데모 스트리밍 폴백
        const demo = '현재 신청 가능한 주요 복지: 문화누리카드(기초생활·차상위), 기초연금, 장애인 활동지원 등입니다.\n"지역/연령/가구상황"을 알려주시면 더 정확히 추천해드릴게요.';
        for (const token of chunkTokens(demo)) {
            onChunk(token);
            // 살짝 타자치는 느낌
            // eslint-disable-next-line no-await-in-loop
            await new Promise((r) => setTimeout(r, 18));
        }
    };

    // 간단한 토큰 분할기(문장부호/공백 유지)
    function* chunkTokens(s) {
        const parts = s.match(/\S+\s*|\s+/g) || [s];
        for (const p of parts) yield p;
    }

    /** 전송 (스트리밍 응답) */
    const autoSend = async (text) => {
        const clean = text.trim();
        if (!clean) return;

        // 사용자 메시지 push
        const userId = uid();
        setMessages((prev) => [...prev, { id: userId, sender: "user", text: clean }]);
        // 스트리밍용 빈 봇 메시지 추가
        const botId = uid();
        setMessages((prev) => [...prev, { id: botId, sender: "bot", text: "" }]);

        const append = (delta) => {
            setMessages((prev) =>
                prev.map((m) => (m.id === botId ? { ...m, text: (m.text || "") + delta } : m))
            );
        };

        try {
            await callApiStream(clean, append);
        } catch (e) {
            append("오류가 발생했어요. 네트워크 상태를 확인 후 다시 시도해 주세요.");
        }
    };

    /** 마이크 켜기 */
    const startMic = (fromPTT = false) => {
        if (!recRef.current) return;
        setListening(true);
        stopTTS(); // 말 겹침 방지
        clearSilence();
        setFinalBuf("");
        setInterim("");
        try {
            recRef.current.start();
            if (!fromPTT) beep(1200, 0.05, "sine");
        } catch {}
    };

    /** 마이크 끄기 */
    const stopMic = (silent = false) => {
        setListening(false);
        clearSilence();

        const leftover = finalBuf.trim();
        if (leftover) {
            autoSend(leftover);
            setFinalBuf("");
        }
        try {
            recRef.current && recRef.current.abort();
        } catch {}
        if (!silent) beep(600, 0.05, "sine");
    };

    /** ---------------------------
     *  Push-To-Talk (길게 누르기/Space)
     *  --------------------------- */
    const pttRef = useRef(false);

    const handlePTTDown = () => {
        pttRef.current = true;
        startMic(true);
    };
    const handlePTTUp = () => {
        if (pttRef.current) {
            pttRef.current = false;
            stopMic();
        }
    };

    // Space = PTT, Esc = Stop
    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.code === "Space" && !pttRef.current) {
                e.preventDefault();
                handlePTTDown();
            } else if (e.code === "Escape") {
                stopMic();
            }
        };
        const onKeyUp = (e) => {
            if (e.code === "Space") {
                e.preventDefault();
                handlePTTUp();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /** 간편칩 클릭 */
    const handleChip = (q) => autoSend(q);

    return (
        <div className="chatbot-page no-top-tab">
            {/* 상단 헤더 */}
            <header className="chat-header">
                <button
                    type="button"
                    className="back-btn"
                    onClick={() => navigate(-1)}
                    aria-label="뒤로가기"
                    title="뒤로가기"
                >
                    ←
                </button>
                <div className="chat-title">복지도우미</div>
                <div className="header-spacer" />
            </header>

            {/* 빠른질문 칩 */}
            <div className="chip-row" role="list">
                {quickChips.map((c) => (
                    <button
                        key={c}
                        role="listitem"
                        className="chip"
                        onClick={() => handleChip(c)}
                        title={c}
                    >
                        {c}
                    </button>
                ))}
            </div>

            {/* 채팅 영역 */}
            <div
                className="chat-area"
                ref={areaRef}
                aria-live="polite"
                aria-label="채팅 메시지"
            >
                {messages.map((m) => (
                    <div
                        key={m.id}
                        className={`chat-bubble ${m.sender === "user" ? "user-bubble" : "bot-bubble"}`}
                    >
                        <div className="bubble-text">{m.text}</div>

                        {/* 액션들 */}
                        <div className="bubble-actions">
                            <button className="icon-btn" onClick={() => handleCopy(m.text)} title="복사">
                                ⧉
                            </button>
                            {m.sender === "bot" && (
                                <button className="icon-btn" onClick={() => handleSpeak(m.text)} title="읽어주기">
                                    🔊
                                </button>
                            )}
                            <button className="icon-btn" onClick={() => handleDelete(m.id)} title="삭제">
                                ✕
                            </button>
                        </div>
                    </div>
                ))}

                {/* 실시간 자막 */}
                {engineActive && (interim || listening) && (
                    <div className="chat-bubble user-bubble ghost">
                        {interim || "듣는 중... 멈추면 자동 전송"}
                    </div>
                )}
            </div>

            {/* 하단 컨트롤 */}
            <div className="voice-sheet">
                {!supported ? (
                    <p className="warn">
                        이 브라우저는 음성인식을 지원하지 않습니다. (HTTPS/Chrome·Edge·iOS Safari 권장)
                    </p>
                ) : (
                    <>
                        {/* 토글 버튼 */}
                        {listening ? (
                            <>
                                <button className="stop-btn" onClick={() => stopMic()}>
                                    ■ 중지
                                </button>
                                <div className="voice-caption">말씀 중… 멈추면 자동 전송됩니다</div>
                            </>
                        ) : (
                            <>
                                <button
                                    className="voice-btn"
                                    onClick={() => startMic()}
                                    aria-label="음성 인식 시작"
                                    title="음성 인식 시작"
                                >
                                    🎤 시작
                                </button>
                                <div className="voice-caption">
                                    탭하여 마이크 켜기 · 길게 누르면 PTT (Space도 가능)
                                </div>
                            </>
                        )}

                        {/* PTT 버튼 (모바일 길게 누르기) */}
                        <button
                            className="ptt-btn"
                            onPointerDown={handlePTTDown}
                            onPointerUp={handlePTTUp}
                            onPointerCancel={handlePTTUp}
                            title="길게 누르고 말하기 (PTT)"
                        >
                            🎙 길게 누르고 말하기
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
